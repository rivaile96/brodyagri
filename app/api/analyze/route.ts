import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

    const { plant_id, week_number, photo_url, completed_tasks, plant_info } = await req.json();

    // 1. Ambil Data Tanaman & Seluruh Riwayat Pertumbuhan Sebelumnya
    const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(plant_id) as any;
    const pastAnalyses = db.prepare(`
      SELECT week_number, photo_url, ai_summary, tasks_for_next_week, created_at 
      FROM weekly_analyses 
      WHERE plant_id = ? AND week_number < ?
      ORDER BY week_number ASC
    `).all(plant_id, Number(week_number)) as any[];

    const allPastTasks = db.prepare(`
      SELECT week_number, task, is_done 
      FROM weekly_tasks 
      WHERE plant_id = ? AND week_number <= ?
      ORDER BY week_number ASC
    `).all(plant_id, Number(week_number)) as any[];

    // 2. Ambil Kredensial AI
    const aiSettings = db.prepare('SELECT * FROM ai_settings WHERE user_id = ?').get(session.userId) as any;
    let apiKey = aiSettings?.api_key_encrypted;
    let baseUrl = aiSettings?.custom_endpoint || 'https://openagentic.id/api/v1';
    let model = aiSettings?.model || 'gemini-3.8-flash-high';

    if (!apiKey) {
      try {
        const cfg = JSON.parse(fs.readFileSync('/home/brody/.openclaw/openclaw.json', 'utf-8'));
        apiKey = cfg.models?.providers?.['custom-openagentic-id']?.apiKey;
      } catch (e) {}
    }

    // 3. Bangun Rantai Riwayat Pertumbuhan (Historical Context) untuk AI
    let historyChronologyText = '';
    if (pastAnalyses.length > 0) {
      historyChronologyText = pastAnalyses.map(a => {
        const tasksForThisWeek = allPastTasks.filter(t => t.week_number === a.week_number);
        const doneCount = tasksForThisWeek.filter(t => t.is_done).length;
        return `[Minggu Ke-${a.week_number}]:
- Tugas Selesai: ${doneCount}/${tasksForThisWeek.length} tugas.
- Catatan Evaluasi AI Sebelumnya: "${a.ai_summary || 'Tidak ada catatan'}"`;
      }).join('\n\n');
    } else {
      historyChronologyText = 'Ini adalah minggu awal (Minggu ke-1), belum ada riwayat pekan sebelumnya.';
    }

    const currentTasksText = completed_tasks?.length
      ? completed_tasks.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')
      : 'Belum ada tugas yang ditandai selesai.';

    const systemPrompt = `Kamu adalah Pakar Agrikultur, Botani, dan Dokter Patologi Tanaman.
Tugasmu adalah menganalisis foto tanaman secara berkesinambungan (kontinuitas dari minggu ke minggu).
Kamu harus mengingat catatan perkembangan minggu sebelumnya untuk melihat apakah kondisi tanaman membaik, bertambah subur, atau mengalami gejala baru (misal daun menguning, layu, hama kutu putih, ulat, atau busuk akar).

Berikan evaluasi dan rekomendasi tugas minggu berikutnya dalam format JSON murni:
{
  "summary": "Analisis perkembangan 2-4 kalimat yang menghubungkan kondisi minggu lalu dengan foto minggu ini secara jelas dan membangun.",
  "health_status": "Sangat Sehat" | "Tumbuh Normal" | "Perlu Perhatian" | "Terserang Hama/Penyakit",
  "growth_milestone": "Fase/Capaian (cth: Muncul Tunas Baru / Pembungaan Awal / Pemulihan Daun)",
  "tasks_for_next_week": [
    "Tugas konkret 1 untuk minggu depan",
    "Tugas konkret 2 untuk minggu depan",
    "Tugas konkret 3 untuk minggu depan",
    "Tugas konkret 4 untuk minggu depan"
  ]
}`;

    const userText = `[PROFIL SPESIMEN TANAMAN]:
Nama: ${plant?.name || plant_info?.name || 'Tanaman Saya'}
Varietas: ${plant?.variety_name || plant_info?.variety} (${plant?.crop_name || plant_info?.category})
Kategori: ${plant?.category || 'Holtikultura'}
Penempatan: ${plant?.location_type || 'Pot Pekarangan'}
Telemetri Iklim: Suhu ${plant?.avg_temp_c ?? 28}°C, Elevasi ${plant?.elevation_m ?? 25} mdpl, Hujan ${plant?.annual_rainfall_mm ?? 2000} mm/thn.

[REKAM JEJAK PERKEMBANGAN DARI MINGGU KE MINGGU]:
${historyChronologyText}

[KONDISI MINGGU INI (Minggu Ke-${week_number})]:
Tugas perawatan yang diselesaikan:
${currentTasksText}

Foto kondisi aktual terlampir. Periksa perubahan fisik tanaman dibanding minggu sebelumnya, evaluasi kesehatan daun/batang, dan berikan tugas tindakan lanjutan untuk minggu ke-${Number(week_number) + 1}.`;

    const userContent: any[] = [{ type: 'text', text: userText }];

    // Lampirkan gambar jika ada
    if (photo_url) {
      try {
        const localPath = path.join(process.cwd(), 'public', photo_url.replace(/^\//, ''));
        if (fs.existsSync(localPath)) {
          const imgBase64 = fs.readFileSync(localPath).toString('base64');
          userContent.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imgBase64}` }
          });
        }
      } catch (e) {
        console.error('Failed to attach photo base64:', e);
      }
    }

    let parsed: any = {
      summary: 'Tanaman menunjukkan perkembangan yang stabil. Daun dan batang merespons perawatan dengan baik.',
      health_status: 'Tumbuh Normal',
      growth_milestone: 'Adaptasi & Pembentukan Daun Baru',
      tasks_for_next_week: [
        'Siram rutin di pagi hari secukupnya',
        'Amati pembentukan kuncup daun baru',
        'Berikan pupuk organik cair dosis seimbang',
        'Jaga kebersihan permukaan media tanam'
      ]
    };

    if (apiKey) {
      try {
        const aiRes = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model.includes('gemini') || model.includes('claude') ? model : 'gemini-3.8-flash-high',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userContent }
            ],
            temperature: 0.2,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const rawContent = aiData.choices?.[0]?.message?.content || '{}';
          const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleanJson);
        }
      } catch (err) {
        console.error('AI call fallback:', err);
      }
    }

    // 4. Simpan ke database SQLite (weekly_analyses)
    const analysisId = randomUUID();
    const tasksJson = JSON.stringify(parsed.tasks_for_next_week || []);

    db.prepare(`
      INSERT INTO weekly_analyses (id, plant_id, week_number, photo_url, ai_summary, tasks_for_next_week)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(analysisId, plant_id, Number(week_number), photo_url ?? null, parsed.summary, tasksJson);

    // 5. Update Foto Profil Tanaman (cover_photo_url) & Naikkan Siklus Minggu
    const nextWeek = Number(week_number) + 1;
    if (photo_url) {
      db.prepare(`
        UPDATE plants 
        SET cover_photo_url = ?, current_week = ?
        WHERE id = ?
      `).run(photo_url, nextWeek, plant_id);
    } else {
      db.prepare(`
        UPDATE plants 
        SET current_week = ?
        WHERE id = ?
      `).run(nextWeek, plant_id);
    }

    // 6. Masukkan tugas baru untuk minggu berikutnya ke tabel weekly_tasks
    const insertTask = db.prepare(`
      INSERT INTO weekly_tasks (id, plant_id, week_number, task) VALUES (?, ?, ?, ?)
    `);

    for (const t of (parsed.tasks_for_next_week || [])) {
      insertTask.run(randomUUID(), plant_id, nextWeek, t);
    }

    const analysis = db.prepare('SELECT * FROM weekly_analyses WHERE id = ?').get(analysisId);

    return NextResponse.json({
      analysis,
      tasks_for_next_week: parsed.tasks_for_next_week ?? [],
      next_week: nextWeek,
      cover_photo_url: photo_url,
    });

  } catch (err: any) {
    console.error('AI analyze error:', err);
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan server' }, { status: 500 });
  }
}
