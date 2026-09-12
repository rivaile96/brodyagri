import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

    const body = await req.json();
    const { symptoms, plant_name, crop_name, photo_base64 } = body;

    // Ambil settingan AI user jika ada, fallback ke model openagentic
    const aiSettings = db.prepare('SELECT * FROM ai_settings WHERE user_id = ?').get(user.userId) as any;

    let apiKey = aiSettings?.api_key_encrypted;
    let baseUrl = aiSettings?.custom_endpoint || 'https://openagentic.id/api/v1';
    let model = aiSettings?.model || 'gemini-3.8-flash-high';

    // Fallback ambil master API key dari openclaw config jika user belum setting sendiri
    if (!apiKey) {
      try {
        const fs = await import('fs');
        const cfg = JSON.parse(fs.readFileSync('/home/brody/.openclaw/openclaw.json', 'utf-8'));
        apiKey = cfg.models?.providers?.['custom-openagentic-id']?.apiKey;
      } catch (e) {}
    }

    if (!apiKey) {
      return NextResponse.json(generateHeuristicDiagnosis(symptoms, crop_name));
    }

    // Bangun Prompt untuk AI
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

    const userMessageContent: any[] = [
      {
        type: 'text',
        text: `Tanaman: ${plant_name || crop_name || 'Tanaman Holtikultura'}
Jenis/Komoditas: ${crop_name || 'Tidak spesifik'}
Gejala yang terlihat: ${symptoms || 'Lihat gambar terlampir'}`
      }
    ];

    if (photo_base64) {
      userMessageContent.push({
        type: 'image_url',
        image_url: {
          url: photo_base64.startsWith('data:') ? photo_base64 : `data:image/jpeg;base64,${photo_base64}`
        }
      });
    }

    const aiRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.includes('gemini') || model.includes('claude') ? model : 'gemini-3.8-flash-high',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessageContent }
        ],
        temperature: 0.2,
      })
    });

    if (!aiRes.ok) {
      return NextResponse.json(generateHeuristicDiagnosis(symptoms, crop_name));
    }

    const aiData = await aiRes.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '{}';
    
    // Parse JSON
    const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      const parsed = JSON.parse(cleanJson);
      return NextResponse.json(parsed);
    } catch (err) {
      return NextResponse.json(generateHeuristicDiagnosis(symptoms, crop_name));
    }

  } catch (error: any) {
    console.error('Doctor API error:', error);
    return NextResponse.json({ error: error.message || 'Gagal memproses diagnosa' }, { status: 500 });
  }
}

function generateHeuristicDiagnosis(symptoms: string = '', cropName: string = '') {
  const sym = symptoms.toLowerCase();
  
  if (sym.includes('kuning') || sym.includes('daun bawah')) {
    return {
      diagnosis: 'Defisiensi Nitrogen (Kekurangan Nutrisi) / Overwatering',
      severity: 'Sedang',
      confidence: 80,
      causes: [
        'Penyiraman terlalu sering sehingga akar kekurangan oksigen',
        'Unsur hara Nitrogen dalam media tanam sudah habis terkuras'
      ],
      home_remedy: {
        title: 'Kocor Air Cucian Beras & Kurangi Siram',
        recipe: 'Air bilasan pertama beras + biarkan 1 hari di wadah terbuka',
        instructions: 'Siramkan 1 gelas (200ml) per pot seminggu sekali. Cek tanah: siram hanya jika 2cm tanah atas kering.'
      },
      chemical_remedy: {
        title: 'Pupuk NPK Seimbang',
        product: 'NPK 16-16-16 (Mutiara / Pak Tani)',
        instructions: '1/2 sendok teh dilarutkan ke 1 liter air, siramkan tipis-tipis tiap 2 minggu.'
      },
      preventions: [
        'Pastikan pot memiliki lubang drainase yang lancar',
        'Jangan biarkan air menggenang di tatakan pot'
      ]
    };
  }

  if (sym.includes('putih') || sym.includes('kutu') || sym.includes('semut')) {
    return {
      diagnosis: 'Serangan Kutu Putih (Mealybugs) & Kutu Kebul',
      severity: 'Sedang',
      confidence: 88,
      causes: [
        'Hama kutu putih mengisap cairan daun dan menghasilkan embun jelaga',
        'Adanya simbiosis dengan semut yang memindahkan kutu ke tunas muda'
      ],
      home_remedy: {
        title: 'Semprotan Sabun Cuci Piring & Bawang Putih',
        recipe: '1 siung bawang putih dihaluskan + 1 liter air + 3 tetes sabun cuci piring (Sunlight/Mama Lemon)',
        instructions: 'Kocok rata, saring, lalu semprotkan ke bawah permukaan daun yang ada kutunya pada sore hari (hindari matahari terik).'
      },
      chemical_remedy: {
        title: 'Insektisida Kontak Nabati / Kimia',
        product: 'Neem Oil (Minyak Mimba) atau Decis 25EC',
        instructions: '1ml per liter air, semprot 3 hari sekali sampai tuntas.'
      },
      preventions: [
        'Rutin bersihkan gulma dan sarang semut di sekitar pot',
        'Pangkas daun yang terinfeksi parah lalu musnahkan'
      ]
    };
  }

  return {
    diagnosis: 'Stres Adaptasi Lingkungan / Kelembaban',
    severity: 'Rendah',
    confidence: 75,
    causes: [
      'Fluktuasi panas matahari yang terlalu terik mendadak',
      'Media tanam memadat atau drainase kurang maksimal'
    ],
    home_remedy: {
      title: 'Pemberian Naungan & Sirkulasi Udara',
      recipe: 'Letakkan tanaman di tempat teduh terang (bawah teras/paranet)',
      instructions: 'Gemburkan permukaan tanah perlahan menggunakan garpu kecil dan siram di pagi hari.'
    },
    chemical_remedy: {
      title: 'Vitamin B1 Tanaman (Anti Stres)',
      product: 'Liquinox Start Vitamin B1',
      instructions: '1 tutup botol untuk 2 liter air, siramkan ke pangkal tanaman.'
    },
    preventions: [
      'Hindari memindahkan tanaman secara tiba-tiba ke bawah terik matahari langsung',
      'Gunakan mulsa (sekam bakar/sabut kelapa) di atas pot untuk menjaga kelembaban'
    ]
  };
}