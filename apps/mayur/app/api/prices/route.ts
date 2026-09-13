import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get('category_id');
    const q = searchParams.get('q');

    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();

    let query = `
      SELECT 
        mp.id,
        mp.commodity_id,
        c.name as commodity_name,
        c.category_id,
        c.category,
        c.unit,
        c.growth_days,
        c.base_cost_per_kg,
        mp.region,
        mp.market_name,
        mp.farmer_price,
        mp.wholesale_price,
        mp.consumer_price,
        mp.trend,
        mp.volatility,
        mp.date
      FROM market_prices mp
      JOIN commodities c ON c.id = mp.commodity_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (category_id && category_id !== 'semua') {
      query += ' AND c.category_id = ?';
      params.push(category_id);
    }

    if (q) {
      query += ' AND (c.name LIKE ? OR mp.region LIKE ? OR mp.market_name LIKE ? OR c.category LIKE ?)';
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY c.category_id ASC, c.name ASC';

    const prices = db.prepare(query).all(...params);
    return NextResponse.json({ ok: true, categories, data: prices });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
