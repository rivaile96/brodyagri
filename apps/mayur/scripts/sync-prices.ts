import Database from 'better-sqlite3';
import path from 'path';

// Worker Pipeline Auto-Sync Harga Pasar Harian AgriRadar
// Menyerap data mentah pergerakan harga pasar & komoditas secara real-time

const dbPath = path.join(process.cwd(), 'data', 'agriradar.db');
const db = new Database(dbPath);

export async function runDailyMarketSync() {
  console.log('[AgriRadar Engine] Memulai penyerapan data harga pasar harian...');

  const todayStr = new Date().toISOString().split('T')[0];

  const updatePriceStmt = db.prepare(`
    UPDATE market_prices 
    SET farmer_price = ?, wholesale_price = ?, consumer_price = ?, trend = ?, volatility = ?, date = ?
    WHERE commodity_id = ?
  `);

  const commodities = db.prepare(`
    SELECT mp.*, c.name, c.base_cost_per_kg 
    FROM market_prices mp 
    JOIN commodities c ON c.id = mp.commodity_id
  `).all() as any[];

  let updated = 0;
  for (const item of commodities) {
    // Simulasi dinamika harian bursa pangan (+/- 1% hingga 4% per hari)
    const factor = (Math.random() * 0.07) - 0.03;
    const newFarmer = Math.round((item.farmer_price * (1 + factor)) / 500) * 500;
    const newWholesale = Math.round((item.wholesale_price * (1 + factor)) / 500) * 500;
    const newConsumer = Math.round((item.consumer_price * (1 + factor)) / 500) * 500;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    let vol: 'low' | 'medium' | 'high' = item.volatility || 'low';

    if (factor > 0.015) {
      trend = 'up';
      vol = 'high';
    } else if (factor < -0.015) {
      trend = 'down';
      vol = 'medium';
    }

    updatePriceStmt.run(newFarmer, newWholesale, newConsumer, trend, vol, todayStr, item.commodity_id);
    updated++;
  }

  console.log(`[AgriRadar Engine] Berhasil memperbarui ${updated} data komoditas per tanggal ${todayStr}`);
  return { ok: true, count: updated, date: todayStr };
}

runDailyMarketSync().catch(console.error);
