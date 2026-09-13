import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import db from '@/lib/db';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter ya.' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = randomUUID();

    db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(id, email, password_hash);

    const token = await createSessionToken(id, email);
    const response = NextResponse.json({ ok: true });
    return setSessionCookie(response, token);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
