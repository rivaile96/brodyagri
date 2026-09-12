import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.userId;

    // 1. Ambil tanaman user
    const plants = db.prepare(`
      SELECT * FROM plants WHERE user_id = ? ORDER BY created_at DESC
    `).all(userId) as any[];

    const activePlants = plants.filter(p => p.status === 'active');
    const harvestedPlants = plants.filter(p => p.status === 'harvested');

    // 2. Telemetri Cuaca (Gunakan tanaman pertama atau default Jakarta jika belum ada GPS)
    let weather = {
      temp_c: 29,
      humidity_pct: 72,
      wind_kmh: 8,
      condition: 'Cerah Berawan',
      location: 'Kebun Saya',
      alert: 'Kondisi cuaca ideal untuk aktivitas penyiraman pagi.',
    };

    const plantWithLoc = plants.find(p => p.latitude && p.longitude);
    if (plantWithLoc) {
      try {
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${plantWithLoc.latitude}&longitude=${plantWithLoc.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
        const forecastRes = await fetch(forecastUrl, { next: { revalidate: 1800 } });
        const forecastData = await forecastRes.json();

        if (forecastData?.current) {
          const temp = Math.round(forecastData.current.temperature_2m * 10) / 10;
          const humidity = Math.round(forecastData.current.relative_humidity_2m);
          const wind = Math.round(forecastData.current.wind_speed_10m * 10) / 10;
          const wcode = forecastData.current.weather_code ?? 0;

          let cond = 'Cerah Berawan';
          let alertMsg = 'Kondisi cuaca seimbang. Lakukan penyiraman rutin di pagi hari.';

          if (wcode === 0) {
            cond = 'Cerah Terik';
            if (temp > 32) alertMsg = `Suhu terik ${temp}°C — Disarankan siram ekstra di sore hari untuk pot teras/rooftop.`;
          } else if (wcode <= 3) {
            cond = 'Sebagian Berawan';
          } else if (wcode <= 67) {
            cond = 'Hujan Berlangsung';
            alertMsg = 'Sedang hujan — Tunda penyiraman dan periksa drainase pot agar tidak menggenang.';
          } else {
            cond = 'Mendung Tebal';
          }

          weather = {
            temp_c: temp,
            humidity_pct: humidity,
            wind_kmh: wind,
            condition: cond,
            location: plantWithLoc.location_name?.split(',')[0] || 'Kebun Saya',
            alert: alertMsg,
          };
        }
      } catch (e) {
        console.error('Dashboard weather error:', e);
      }
    }

    // 3. Ambil seluruh tugas harian & hitung statistik
    const allTasks = db.prepare(`
      SELECT wt.*, p.name as plant_name, p.variety_name, p.category 
      FROM weekly_tasks wt
      JOIN plants p ON p.id = wt.plant_id
      WHERE p.user_id = ? AND p.status = 'active'
    `).all(userId) as any[];

    const doneCount = allTasks.filter(t => t.is_done).length;
    const totalCount = allTasks.length;
    const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 100;

    // 4. Hitung Garden Health Index (Skor Kesehatan Kebun)
    const analyses = db.prepare(`
      SELECT wa.* FROM weekly_analyses wa
      JOIN plants p ON p.id = wa.plant_id
      WHERE p.user_id = ?
    `).all(userId) as any[];

    let healthIndex = 95;
    if (analyses.length > 0) {
      // Hitung dari kata kunci dalam evaluasi AI
      const summaries = analyses.map(a => (a.ai_summary || '').toLowerCase());
      const warningCount = summaries.filter(s => s.includes('hama') || s.includes('kuning') || s.includes('layu') || s.includes('perhatian')).length;
      healthIndex = Math.max(60, 98 - (warningCount * 8));
    }

    // 5. Tanaman yang Membutuhkan Perhatian / Spotlight (Perlu upload foto minggu ini)
    const needPhotoPlants = activePlants.filter(p => {
      const hasCurrentAnalysis = analyses.some(a => a.plant_id === p.id && a.week_number === p.current_week);
      return !hasCurrentAnalysis;
    });

    return NextResponse.json({
      weather,
      stats: {
        active_count: activePlants.length,
        harvested_count: harvestedPlants.length,
        completion_rate: completionRate,
        health_index: healthIndex,
        total_tasks: totalCount,
        done_tasks: doneCount,
      },
      need_action: needPhotoPlants,
      active_plants: activePlants,
    });
  } catch (err: any) {
    console.error('Dashboard API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
