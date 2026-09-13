import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as {
      id: string; email: string; password_hash: string;
    } | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const token = await createSessionToken(user.id, user.email);
    const response = NextResponse.json({ ok: true });
    return setSessionCookie(response, token);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
