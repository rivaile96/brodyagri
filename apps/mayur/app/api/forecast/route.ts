import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const commodities = db.prepare(`
      SELECT 
        c.*,
        mp.farmer_price,
        mp.wholesale_price,
        mp.consumer_price,
        mp.trend,
        mp.region,
        mp.market_name
      FROM commodities c
      LEFT JOIN market_prices mp ON mp.commodity_id = c.id
      ORDER BY c.name ASC
    `).all();

    const forecasts = commodities.map((item: any) => {
      const today = new Date();
      const harvestDate = new Date();
      harvestDate.setDate(today.getDate() + item.growth_days);

      const harvestMonthName = harvestDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      const currentFarmerPrice = item.farmer_price || 10000;

      let projectedPrice = currentFarmerPrice;
      let outlook: 'bullish' | 'bearish' | 'stable' = 'stable';
      let confidence = 82;
      let reasoning = '';

      if (item.trend === 'down' || currentFarmerPrice < item.base_cost_per_kg * 1.5) {
        projectedPrice = Math.round(currentFarmerPrice * 1.65);
        outlook = 'bullish';
        confidence = 88;
        reasoning = `Harga saat ini sedang rendah sehingga petani umumnya menahan tanam. Pada saat panen (${harvestMonthName}), pasokan di pasar induk diproyeksikan berkurang 35-40% yang memicu kenaikan harga signifikan.`;
      } else if (item.trend === 'up' || currentFarmerPrice > item.base_cost_per_kg * 2.5) {
        projectedPrice = Math.round(currentFarmerPrice * 0.75);
        outlook = 'bearish';
        confidence = 84;
        reasoning = `Harga saat ini sedang tinggi dan memicu panen serentak dari daerah sentra lain. Saat panen (${harvestMonthName}), risiko banjir pasokan cukup tinggi. Disarankan bertahap.`;
      } else {
        projectedPrice = Math.round(currentFarmerPrice * 1.1);
        outlook = 'stable';
        confidence = 80;
        reasoning = `Permintaan pasar stabil sepanjang tahun dengan pasokan regional yang seimbang hingga ${harvestMonthName}.`;
      }

      const profitPerKg = projectedPrice - item.base_cost_per_kg;

      return {
        commodity_id: item.id,
        commodity_name: item.name,
        category: item.category,
        unit: item.unit,
        growth_days: item.growth_days,
        base_cost_per_kg: item.base_cost_per_kg,
        current_farmer_price: currentFarmerPrice,
        current_consumer_price: item.consumer_price || currentFarmerPrice * 1.5,
        target_harvest_date: harvestDate.toISOString().split('T')[0],
        harvest_month_name: harvestMonthName,
        projected_farmer_price: projectedPrice,
        profit_estimate_per_kg: profitPerKg,
        outlook,
        confidence_pct: confidence,
        reasoning,
      };
    });

    return NextResponse.json({ ok: true, data: forecasts });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
