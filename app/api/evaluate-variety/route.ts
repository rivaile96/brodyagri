import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { evaluateSuitability, type ClimateData } from '@/lib/suitability';

/**
 * POST /api/evaluate-variety
 * Evaluate custom variety name by:
 * 1. First try local heuristic (keyword matching)
 * 2. If AI settings available, call AI for richer analysis
 * Returns SuitabilityResult-compatible object
 */
export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { variety_name, commodity, category, climate, placement } = body as {
    variety_name: string;
    commodity: string;
    category: string;
    climate: ClimateData;
    placement: string;
  };

  if (!variety_name?.trim() || !commodity || !climate || !placement) {
    return NextResponse.json({ error: 'Parameter tidak lengkap' }, { status: 400 });
  }

  const name = variety_name.trim();

  // ── Heuristic meta: infer dari nama varietas ──
  const meta = inferVarietyMeta(name, commodity, category);

  // ── Hitung skor kesesuaian ──
  const result = evaluateSuitability(meta, climate, placement);

  // ── Coba enrichment via AI jika user punya AI settings ──
  let aiNote: string | null = null;
  try {
    const { default: db } = await import('@/lib/db');
    const settings = db.prepare('SELECT ai_provider, ai_api_key, ai_enabled FROM settings WHERE user_id = ?').get(user.userId) as any;
    if (settings?.ai_enabled && settings?.ai_api_key) {
      aiNote = await callAIForVarietyInfo(name, commodity, category, climate, placement, settings);
    }
  } catch { /* AI optional, skip if error */ }

  return NextResponse.json({
    ...result,
    name,
    ai_note: aiNote,
    is_custom: true,
  });
}

/**
 * Infer VarietyMeta dari nama varietas menggunakan keyword heuristic.
 * Ini fallback tanpa AI — tetap akurat untuk nama umum.
 */
function inferVarietyMeta(name: string, commodity: string, category: string) {
  const lower = name.toLowerCase();

  // Default berdasarkan komoditas
  const defaults: Record<string, { optimal_temp_c: number; min_elevation_m: number; max_elevation_m: number; sunlight_hours: number; fungus_resistance: 'Low' | 'Medium' | 'High' }> = {
    'Mangga':     { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 600,  sunlight_hours: 8, fungus_resistance: 'Medium' },
    'Alpukat':    { optimal_temp_c: 22, min_elevation_m: 200, max_elevation_m: 1000, sunlight_hours: 6, fungus_resistance: 'Medium' },
    'Stroberi':   { optimal_temp_c: 18, min_elevation_m: 600, max_elevation_m: 1500, sunlight_hours: 6, fungus_resistance: 'Low'    },
    'Anggur':     { optimal_temp_c: 26, min_elevation_m: 0,   max_elevation_m: 700,  sunlight_hours: 8, fungus_resistance: 'Medium' },
    'Kelengkeng': { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 600,  sunlight_hours: 8, fungus_resistance: 'High'   },
    'Jeruk':      { optimal_temp_c: 26, min_elevation_m: 0,   max_elevation_m: 800,  sunlight_hours: 7, fungus_resistance: 'Medium' },
    'Jambu':      { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 700,  sunlight_hours: 7, fungus_resistance: 'High'   },
    'Pepaya':     { optimal_temp_c: 28, min_elevation_m: 0,   max_elevation_m: 700,  sunlight_hours: 8, fungus_resistance: 'Medium' },
    'Pisang':     { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 800,  sunlight_hours: 7, fungus_resistance: 'Medium' },
    'Semangka':   { optimal_temp_c: 29, min_elevation_m: 0,   max_elevation_m: 500,  sunlight_hours: 8, fungus_resistance: 'Medium' },
    'Nanas':      { optimal_temp_c: 28, min_elevation_m: 0,   max_elevation_m: 600,  sunlight_hours: 8, fungus_resistance: 'High'   },
    'Sirsak':     { optimal_temp_c: 28, min_elevation_m: 0,   max_elevation_m: 700,  sunlight_hours: 7, fungus_resistance: 'High'   },
    'Rambutan':   { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 500,  sunlight_hours: 7, fungus_resistance: 'Medium' },
    'Durian':     { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 600,  sunlight_hours: 8, fungus_resistance: 'Low'    },
    'Belimbing':  { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 600,  sunlight_hours: 7, fungus_resistance: 'Medium' },
    'Cabai':      { optimal_temp_c: 27, min_elevation_m: 0,   max_elevation_m: 800,  sunlight_hours: 8, fungus_resistance: 'Medium' },
    'Tomat':      { optimal_temp_c: 24, min_elevation_m: 100, max_elevation_m: 900,  sunlight_hours: 7, fungus_resistance: 'Medium' },
  };

  const base = defaults[commodity] ?? { optimal_temp_c: 27, min_elevation_m: 0, max_elevation_m: 800, sunlight_hours: 7, fungus_resistance: 'Medium' as const };

  // Keyword modifiers — sesuaikan meta berdasarkan petunjuk nama
  if (lower.includes('dataran tinggi') || lower.includes('highland') || lower.includes('pegunungan')) {
    base.min_elevation_m = Math.max(base.min_elevation_m, 500);
    base.optimal_temp_c  = Math.min(base.optimal_temp_c, 22);
  }
  if (lower.includes('tropis') || lower.includes('lowland') || lower.includes('dataran rendah')) {
    base.max_elevation_m = Math.min(base.max_elevation_m, 500);
    base.optimal_temp_c  = Math.max(base.optimal_temp_c, 26);
  }
  if (lower.includes('tahan') && (lower.includes('panas') || lower.includes('kering'))) {
    base.fungus_resistance = 'High';
    base.optimal_temp_c    = Math.max(base.optimal_temp_c, 28);
  }
  if (lower.includes('impor') || lower.includes('import') || lower.includes('eropa') || lower.includes('jepang') || lower.includes('korea')) {
    // Varietas impor cenderung butuh kondisi spesifik
    base.fungus_resistance = base.fungus_resistance === 'High' ? 'Medium' : 'Low';
  }

  return {
    name,
    description: `${name} — varietas ${commodity} yang diinput manual.`,
    category,
    ...base,
  };
}

/**
 * Optional: panggil AI untuk deskripsi lebih kaya tentang varietas custom.
 */
async function callAIForVarietyInfo(
  name: string, commodity: string, category: string,
  climate: ClimateData, placement: string,
  settings: { ai_provider: string; ai_api_key: string }
): Promise<string> {
  const prompt = `Saya menanam ${name} (varietas ${commodity}, kategori ${category}) di lokasi dengan kondisi:
- Suhu rata-rata: ${climate.avg_temp_c}°C
- Kelembaban: ${climate.avg_humidity_pct}%
- Curah hujan: ${climate.annual_rainfall_mm} mm/tahun
- Elevasi: ${climate.elevation_m} mdpl
- Lokasi tanam: ${placement}

Berikan analisis singkat (2-3 kalimat) dalam Bahasa Indonesia:
1. Apakah varietas ini cocok di kondisi tersebut?
2. Satu tips praktis paling penting untuk kondisi ini.
Jawab langsung tanpa intro.`;

  const isOpenAI = settings.ai_provider === 'openai' || !settings.ai_provider;
  const url = isOpenAI
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.anthropic.com/v1/messages';

  if (isOpenAI) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${settings.ai_api_key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 200 }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  } else {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'x-api-key': settings.ai_api_key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 200, messages: [{ role: 'user', content: prompt }] }),
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? '';
  }
}
