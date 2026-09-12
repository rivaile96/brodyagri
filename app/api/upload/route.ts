import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const plant_id = (formData.get('plant_id') as string) || 'plant';
  const week_number = (formData.get('week_number') as string) || '1';

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${plant_id}-week${week_number}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const photo_url = `/uploads/${filename}`;

  // Update cover photo profil tanaman ke foto terbaru ini langsung
  if (plant_id && plant_id !== 'plant') {
    db.prepare('UPDATE plants SET cover_photo_url = ? WHERE id = ?').run(photo_url, plant_id);
  }

  return NextResponse.json({ photo_url, url: photo_url });
}
