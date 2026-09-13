import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { is_done } = await req.json();

  // Verify ownership via plant
  const task = db.prepare(`
    SELECT wt.* FROM weekly_tasks wt
    JOIN plants p ON p.id = wt.plant_id
    WHERE wt.id = ? AND p.user_id = ?
  `).get(id, session.userId);
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare('UPDATE weekly_tasks SET is_done = ?, done_at = ? WHERE id = ?')
    .run(is_done ? 1 : 0, is_done ? new Date().toISOString() : null, id);

  return NextResponse.json({ ok: true });
}
