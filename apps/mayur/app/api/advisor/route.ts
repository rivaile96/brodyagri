import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const db = getDb();
    const { region, area_m2, target_duration } = await req.json();

    const commodities = db.prepare(`
      SELECT 
        c.*,
        mp.farmer_price,
        mp.wholesale_price,
        mp.consumer_price,
        mp.trend
      FROM commodities c
      LEFT JOIN market_prices mp ON mp.commodity_id = c.id
      ORDER BY c.growth_days ASC
    `).all();

    const recommendations = commodities.map((item: any) => {
      const today = new Date();
      const harvestDate = new Date();
      harvestDate.setDate(today.getDate() + item.growth_days);
      const harvestMonthName = harvestDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

      const currentFarmerPrice = item.farmer_price || 10000;
      let projectedFarmerPrice = currentFarmerPrice;
      let score = 70;
      let pros: string[] = [];
      let cons: string[] = [];

      if (target_duration === 'cepat' && item.growth_days <= 45) {
        score += 20;
        pros.push('Umur panen sangat cepat (kurang dari 45 hari), perputaran modal cepat.');
      } else if (target_duration === 'sedang' && item.growth_days > 45 && item.growth_days <= 80) {
        score += 20;
        pros.push('Umur panen sedang (45-80 hari), pas dengan siklus pemupukan.');
      } else if (target_duration === 'panjang' && item.growth_days > 80) {
        score += 20;
        pros.push('Investasi panen jangka panjang dengan potensi harga tinggi.');
      }

      if (item.trend === 'down' || currentFarmerPrice < item.base_cost_per_kg * 1.5) {
        projectedFarmerPrice = Math.round(currentFarmerPrice * 1.65);
        score += 25;
        pros.push(`Harga saat ini sedang murah, diproyeksikan melonjak saat panen (${harvestMonthName}) karena sedikit yang tanam.`);
      } else if (item.trend === 'up') {
        projectedFarmerPrice = Math.round(currentFarmerPrice * 0.75);
        score -= 15;
        cons.push('Harga saat ini sedang di puncak, risiko banjir pasokan saat panen nanti cukup tinggi.');
      } else {
        projectedFarmerPrice = Math.round(currentFarmerPrice * 1.1);
        pros.push('Permintaan pasar relatif stabil sepanjang tahun.');
      }

      const area = Number(area_m2) || 100;
      let yieldPerM2 = 2;
      if (item.category === 'Cabai' || item.category === 'Sayuran') yieldPerM2 = 1.8;
      if (item.category === 'Sayuran Buah' || item.category === 'Buah-buahan') yieldPerM2 = 3.0;
      if (item.category === 'Umbi-umbian') yieldPerM2 = 2.5;

      const totalEstKg = Math.round(area * yieldPerM2);
      const estRevenue = totalEstKg * projectedFarmerPrice;
      const estCost = totalEstKg * item.base_cost_per_kg;
      const estNetProfit = estRevenue - estCost;

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        growth_days: item.growth_days,
        season_optimal: item.season_optimal,
        harvest_month_name: harvestMonthName,
        current_farmer_price: currentFarmerPrice,
        projected_farmer_price: projectedFarmerPrice,
        score,
        total_est_kg: totalEstKg,
        est_revenue: estRevenue,
        est_cost: estCost,
        est_net_profit: estNetProfit,
        pros,
        cons,
      };
    });

    recommendations.sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json({
      ok: true,
      data: {
        region: region || 'Jawa Barat & Nasional',
        area_m2: area_m2 || 100,
        top_recommendations: recommendations.slice(0, 4),
        avoid_recommendations: recommendations.filter((r: any) => r.score < 60).slice(0, 2),
      }
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
