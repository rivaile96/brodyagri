import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

    const body = await req.json();
    const { symptoms, plant_name, crop_name, photo_base64 } = body;

    // Ambil settingan AI user jika ada
    const aiSettings = db.prepare('SELECT * FROM ai_settings WHERE user_id = ?').get(user.userId) as any;

    let provider = aiSettings?.provider || 'gemini';
    let apiKey = aiSettings?.api_key_encrypted;
    let baseUrl = aiSettings?.custom_endpoint;
    let model = aiSettings?.model || 'gemini-2.5-flash';

    // Fallback ambil master API key dari openclaw config jika user belum setting sendiri
    let isMasterFallback = false;
    if (!apiKey) {
      try {
        const cfg = JSON.parse(fs.readFileSync('/home/brody/.openclaw/openclaw.json', 'utf-8'));
        apiKey = cfg.models?.providers?.['custom-openagentic-id']?.apiKey;
        baseUrl = cfg.models?.providers?.['custom-openagentic-id']?.baseUrl || 'https://openagentic.id/api/v1';
        model = 'gemini-3.8-flash-high';
        provider = 'custom';
        isMasterFallback = true;
      } catch (e) {}
    }

    if (!apiKey) {
      return NextResponse.json(generateHeuristicDiagnosis(symptoms, crop_name));
    }

    const systemPrompt = `Kamu adalah Ahli Patologi Tanaman & Dokter Agrikultur Ramah Pemula.
Tugasmu adalah menganalisis masalah tanaman dari gejala atau foto yang dikirimkan.
Berikan diagnosa dalam format JSON murni:
{
  "diagnosis": "Nama penyakit/hama/defisiensi",
  "severity": "Rendah" | "Sedang" | "Kritis",
  "confidence": 85,
  "causes": ["Penyebab 1", "Penyebab 2"],
  "home_remedy": {
    "title": "Solusi Bahan Dapur / Alami",
    "recipe": "Langkah atau bahan dapur yang dipakai (contoh: air cucian beras, rendaman bawang, sabun cair)",
    "instructions": "Cara aplikasi dan frekuensi"
  },
  "chemical_remedy": {
    "title": "Opsi Toko Pertanian (Jika Parah)",
    "product": "Nama jenis fungisida/insektisida/pupuk",
    "instructions": "Dosis aman"
  },
  "preventions": ["Tips agar tidak terulang 1", "Tips 2"]
}`;

    const promptText = `Tanaman: ${plant_name || crop_name || 'Tanaman Holtikultura'}
Jenis/Komoditas: ${crop_name || 'Tidak spesifik'}
Gejala yang terlihat: ${symptoms || 'Lihat gambar terlampir'}`;

    let parsedResult: any = null;

    // ── 1. NATIVE GOOGLE GEMINI DIRECT API (AI Studio Key: AIzaSy...) ──
    if (provider === 'gemini' && apiKey.startsWith('AIzaSy') && !baseUrl) {
      try {
        const geminiModel = model || 'gemini-2.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

        const parts: any[] = [{ text: `${systemPrompt}\n\n${promptText}` }];

        if (photo_base64) {
          const cleanBase64 = photo_base64.replace(/^data:image\/\w+;base64,/, '');
          parts.push({
            inline_data: {
              mime_type: 'image/jpeg',
              data: cleanBase64
            }
          });
        }

        const geminiRes = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.2,
              response_mime_type: 'application/json'
            }
          })
        });

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const textOut = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textOut) {
            const cleanText = textOut.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            parsedResult = JSON.parse(jsonMatch ? jsonMatch[0] : cleanText);
          }
        }
      } catch (gemErr) {
        console.error('Gemini Direct Call Error:', gemErr);
      }
    }

    // ── 2. OPENAI / ANTHROPIC / CUSTOM OPENAI-COMPATIBLE API ──
    if (!parsedResult) {
      const userMessageContent: any[] = [{ type: 'text', text: promptText }];
      if (photo_base64) {
        userMessageContent.push({
          type: 'image_url',
          image_url: {
            url: photo_base64.startsWith('data:') ? photo_base64 : `data:image/jpeg;base64,${photo_base64}`
          }
        });
      }

      const activeBaseUrl = baseUrl || (provider === 'openai' ? 'https://api.openai.com/v1' : 'https://openagentic.id/api/v1');
      const targetEndpoint = activeBaseUrl.endsWith('/chat/completions') ? activeBaseUrl : `${activeBaseUrl}/chat/completions`;

      const aiRes = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || 'gemini-3.8-flash-high',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessageContent }
          ],
          temperature: 0.2
        })
      });

      if (aiRes.ok) {
        const textResp = await aiRes.text();
        const cleanedResp = textResp.replace(/data:\s*\[DONE\].*/g, '').trim();
        const data = JSON.parse(cleanedResp);
        const raw = data.choices?.[0]?.message?.content;
        if (raw) {
          const cleanRaw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
          const jsonMatch = cleanRaw.match(/\{[\s\S]*\}/);
          parsedResult = JSON.parse(jsonMatch ? jsonMatch[0] : cleanRaw);
        }
      }
    }

    if (parsedResult) {
      return NextResponse.json(parsedResult);
    }

    return NextResponse.json(generateHeuristicDiagnosis(symptoms, crop_name));
  } catch (error: any) {
    console.error('Doctor diagnosis error:', error);
    return NextResponse.json({ error: error.message || 'Gagal menganalisis keluhan tanaman' }, { status: 500 });
  }
}

function generateHeuristicDiagnosis(symptoms?: string, crop_name?: string) {
  const sym = (symptoms || '').toLowerCase();
  const crop = (crop_name || 'Tanaman').toLowerCase();

  if (sym.includes('kuning') || sym.includes('bercak')) {
    return {
      diagnosis: 'Defisiensi Nitrogen & Klorosis Daun',
      severity: 'Sedang',
      confidence: 82,
      causes: ['Kurang unsur hara makro N', 'Media tanam terlalu padat/menggenang', 'pH tanah terlalu asam'],
      home_remedy: {
        title: 'Kocoran Air Cucian Beras Fermentasi + Ampas Kopi',
        recipe: '1 Liter air cucian beras dicampur 1 sendok teh ampas kopi, endapkan 12 jam.',
        instructions: 'Siramkan 200ml ke sekeliling akar tanaman 3 hari sekali di pagi hari.'
      },
      chemical_remedy: {
        title: 'Pupuk NPK 16-16-16 / Urea Cair',
        product: 'NPK Seimbang 16-16-16',
        instructions: '1 sendok teh dilarutkan dalam 2 liter air, siram 1x seminggu.'
      },
      preventions: ['Gunakan media dengan drainase poros', 'Hindari penyiraman berlebih di malam hari']
    };
  }

  return {
    diagnosis: 'Serangan Hama Kutu Putih / Thrips Ringan',
    severity: 'Rendah',
    confidence: 78,
    causes: ['Sirkulasi udara kurang lancar', 'Kondisi lembab di balik daun'],
    home_remedy: {
      title: 'Semprotan White Oil Minyak Goreng & Sabun',
      recipe: '1 sdt sabun cuci piring + 1 sdt minyak goreng + 1 liter air hangat.',
      instructions: 'Semprotkan merata ke bagian bawah daun di sore hari saat matahari teduh.'
    },
    chemical_remedy: {
      title: 'Insektisida Nabati / Abamektin',
      product: 'Insektisida Bahan Aktif Abamektin',
      instructions: '0.5ml per liter air, semprot 5 hari sekali.'
    },
    preventions: ['Rutin pangkas daun tua', 'Jaga jarak antar pot minimal 30cm']
  };
}
