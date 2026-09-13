import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = db.prepare('SELECT * FROM ai_settings WHERE user_id = ?').get(session.userId);
  if (!settings) return NextResponse.json({ provider: 'openai', model: 'gpt-4o-mini', is_active: false });

  // Mask API key
  const s = settings as Record<string, unknown>;
  return NextResponse.json({ ...s, api_key_encrypted: s.api_key_encrypted ? '••••••••' : '' });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { provider, api_key_encrypted, model, custom_endpoint, is_active } = await req.json();

  const existing = db.prepare('SELECT id FROM ai_settings WHERE user_id = ?').get(session.userId);

  // Don't overwrite key if masked value sent
  const keyToSave = api_key_encrypted === '••••••••'
    ? (db.prepare('SELECT api_key_encrypted FROM ai_settings WHERE user_id = ?').get(session.userId) as { api_key_encrypted: string } | undefined)?.api_key_encrypted ?? ''
    : api_key_encrypted;

  if (existing) {
    db.prepare(`
      UPDATE ai_settings SET provider=?, api_key_encrypted=?, model=?, custom_endpoint=?, is_active=?, updated_at=datetime('now')
      WHERE user_id=?
    `).run(provider, keyToSave, model, custom_endpoint ?? null, is_active ? 1 : 0, session.userId);
  } else {
    db.prepare(`
      INSERT INTO ai_settings (id, user_id, provider, api_key_encrypted, model, custom_endpoint, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), session.userId, provider, keyToSave, model, custom_endpoint ?? null, is_active ? 1 : 0);
  }

  return NextResponse.json({ ok: true });
}
