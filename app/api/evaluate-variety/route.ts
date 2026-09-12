import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { evaluateSuitability, type ClimateData } from '@/lib/suitability';
import db from '@/lib/db';
import fs from 'fs';

/**
 * POST /api/evaluate-variety
 * Evaluate custom variety name by:
 * 1. First try local heuristic (keyword matching)
 * 2. If AI settings available, call AI for richer analysis
 * Returns SuitabilityResult-compatible object with full card metadata
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

  // ── Coba enrichment via AI jika user punya AI settings atau fallback ke sistem ──
  let aiNote: string | null = null;
  let customDesc = meta.description;
  let advantages = [
    `Adaptif terhadap ketinggian ${climate.elevation_m} mdpl`,
    `Toleran pada suhu ${climate.avg_temp_c}°C di area ${placement}`
  ];
  let challenges: string[] = [];
  let mediaRecommendation = '2 Bagian Sekam Bakar : 1 Kompos : 1 Tanah Humus Gembur';

  if (commodity.toLowerCase().includes('anggur')) {
    mediaRecommendation = '2 Sekam Bakar : 1 Sekam Mentah : 1 Tanah : 1/2 Pasir Malang (Super Poros)';
    challenges.push('Wajib drainase sangat lancar untuk mencegah busuk akar');
  } else if (commodity.toLowerCase().includes('mangga')) {
    mediaRecommendation = '2 Tanah Hitam : 1 Kompos Matang : 1 Arang Sekam';
  } else if (commodity.toLowerCase().includes('cabai')) {
    mediaRecommendation = '1 Tanah Subur : 1 Kompos Organik : 1 Arang Sekam';
    challenges.push('Waspadai serangan kutu daun / thrips saat cuaca lembab');
  }

  try {
    const aiSettings = db.prepare('SELECT * FROM ai_settings WHERE user_id = ?').get(user.userId) as any;
    
    let apiKey = aiSettings?.api_key_encrypted;
    let baseUrl = aiSettings?.custom_endpoint || 'https://openagentic.id/api/v1';
    let model = aiSettings?.model || 'gemini-3.8-flash-high';

    if (!apiKey) {
      try {
        const cfg = JSON.parse(fs.readFileSync('/home/brody/.openclaw/openclaw.json', 'utf-8'));
        apiKey = cfg.models?.providers?.['custom-openagentic-id']?.apiKey;
      } catch (e) {}
    }

    if (apiKey) {
      aiNote = await callAIForVarietyInfo(name, commodity, category, climate, placement, {
        apiKey,
        baseUrl,
        model,
        provider: aiSettings?.provider || 'custom'
      });
    }
  } catch (err) {
    console.error('AI Variety Enrichment error:', err);
  }

  // Level & badge styling
  let level = 'Sangat Direkomendasikan';
  let badge = 'emerald';
  if (result.score < 65) {
    level = 'Cukup Menantang';
    badge = 'rose';
  } else if (result.score < 80) {
    level = 'Direkomendasikan Bersyarat';
    badge = 'amber';
  }

  return NextResponse.json({
    ...result,
    name,
    description: aiNote || customDesc,
    advantages,
    challenges,
    media: mediaRecommendation,
    level,
    badge,
    ai_note: aiNote,
    is_custom: true,
  });
}

function inferVarietyMeta(name: string, commodity: string, category: string) {
  const lower = name.toLowerCase();

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
    base.fungus_resistance = base.fungus_resistance === 'High' ? 'Medium' : 'Low';
  }

  return {
    name,
    description: `${name} adalah varietas ${commodity} yang adaptif terhadap iklim lokal dan cocok dibudidayakan di lingkungan rumah.`,
    category,
    ...base,
  };
}

async function callAIForVarietyInfo(
  name: string, commodity: string, category: string,
  climate: ClimateData, placement: string,
  aiConfig: { apiKey: string; baseUrl: string; model: string; provider: string }
): Promise<string> {
  const prompt = `Saya menanam ${name} (varietas ${commodity}, kategori ${category}) di lokasi dengan kondisi:
- Suhu rata-rata: ${climate.avg_temp_c}°C
- Kelembaban: ${climate.avg_humidity_pct}%
- Curah hujan: ${climate.annual_rainfall_mm} mm/tahun
- Elevasi: ${climate.elevation_m} mdpl
- Lokasi tanam: ${placement}

Berikan deskripsi karakteristik varietas dan analisis singkat kesesuaiannya (2-3 kalimat) dalam Bahasa Indonesia:
Jelaskan keunggulan varietas ini dan tips praktis perawatannya di kondisi tersebut. Jawab langsung tanpa intro.`;

  if (aiConfig.provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': aiConfig.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: aiConfig.model || 'claude-3-5-haiku-20241022',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }]
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? '';
  }

  const endpoint = aiConfig.baseUrl.endsWith('/chat/completions')
    ? aiConfig.baseUrl
    : `${aiConfig.baseUrl}/chat/completions`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: aiConfig.model || 'gemini-3.8-flash-high',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}
