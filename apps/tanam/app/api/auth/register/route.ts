import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Pendaftaran akun baru ditutup oleh Administrator (Mode Privat).' },
    { status: 403 }
  );
}
