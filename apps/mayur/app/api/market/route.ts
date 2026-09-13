import getDb from '@/lib/db';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET(req: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region');

    let query = `
      SELECT 
        hl.*,
        c.name as commodity_name,
        c.category,
        c.unit
      FROM harvest_listings hl
      JOIN commodities c ON c.id = hl.commodity_id
      WHERE hl.status = 'available'
    `;

    const params: any[] = [];
    if (region && region !== 'Semua') {
      query += ' AND hl.region = ?';
      params.push(region);
    }

    query += ' ORDER BY hl.ready_date ASC';

    const listings = db.prepare(query).all(...params);
    return NextResponse.json({ ok: true, data: listings });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { farmer_name, phone, region, commodity_id, estimated_kg, ready_date, asking_price, notes } = body;

    if (!farmer_name || !phone || !commodity_id || !estimated_kg || !ready_date) {
      return NextResponse.json({ ok: false, error: 'Data wajib diisi lengkap' }, { status: 400 });
    }

    const id = randomUUID();
    db.prepare(`
      INSERT INTO harvest_listings (id, farmer_name, phone, region, commodity_id, estimated_kg, ready_date, asking_price, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      farmer_name,
      phone,
      region || 'Jawa Barat',
      commodity_id,
      Number(estimated_kg),
      ready_date,
      asking_price ? Number(asking_price) : null,
      notes || null
    );

    return NextResponse.json({ ok: true, id });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
