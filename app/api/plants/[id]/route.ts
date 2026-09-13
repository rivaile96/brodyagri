import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const plant = db.prepare('SELECT * FROM plants WHERE id = ? AND user_id = ?').get(id, session.userId);
  if (!plant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const tasks = db.prepare('SELECT * FROM weekly_tasks WHERE plant_id = ? ORDER BY created_at').all(id);
  const analyses = db.prepare('SELECT * FROM weekly_analyses WHERE plant_id = ? ORDER BY week_number DESC').all(id);

  return NextResponse.json({ plant, tasks, analyses });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const plant = db.prepare('SELECT * FROM plants WHERE id = ? AND user_id = ?').get(id, session.userId);
  if (!plant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const ALLOWED_FIELDS = ['name', 'variety_name', 'crop_name', 'category', 'location_type', 'planted_at', 'cover_photo_url', 'current_week'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const key of Object.keys(body)) {
    if (ALLOWED_FIELDS.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
  }

  values.push(id, session.userId);
  db.prepare(`UPDATE plants SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const plant = db.prepare('SELECT * FROM plants WHERE id = ? AND user_id = ?').get(id, session.userId);
  if (!plant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Hapus data tanaman (karena foreign key ON DELETE CASCADE, tasks & analyses terhapus otomatis)
  db.prepare('DELETE FROM plants WHERE id = ?').run(id);

  return NextResponse.json({ ok: true });
}