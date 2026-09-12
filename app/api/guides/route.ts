import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    let query = 'SELECT id, slug, title, category, difficulty, harvest_time, sunlight_req, optimal_temp, optimal_elevation, summary FROM plant_guides';
    const conditions: string[] = [];
    const params: any[] = [];

    if (category && category !== 'Semua') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (q && q.trim()) {
      conditions.push('(title LIKE ? OR summary LIKE ? OR category LIKE ?)');
      const pattern = `%${q.trim()}%`;
      params.push(pattern, pattern, pattern);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY title ASC';

    const guides = db.prepare(query).all(...params);
    return NextResponse.json(guides);
  } catch (err: any) {
    console.error('Guides list error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
