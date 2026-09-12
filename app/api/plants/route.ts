import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getInitialTasks } from '@/lib/tasks';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const plants = db.prepare('SELECT * FROM plants WHERE user_id = ? ORDER BY created_at DESC').all(session.userId);
  return NextResponse.json(plants);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    name,
    variety_name,
    crop_name,
    category,
    location_type,
    planted_at,
    // Telemetry & Climate history
    location_name,
    latitude,
    longitude,
    avg_temp_c,
    current_temp_c,
    avg_humidity_pct,
    annual_rainfall_mm,
    dry_months_count,
    sunshine_hours_day,
    elevation_m,
    climate_zone,
  } = body;

  const id = randomUUID();
  db.prepare(`
    INSERT INTO plants (
      id, user_id, name, variety_name, crop_name, category, location_type, planted_at,
      location_name, latitude, longitude, avg_temp_c, current_temp_c,
      avg_humidity_pct, annual_rainfall_mm, dry_months_count, sunshine_hours_day,
      elevation_m, climate_zone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    session.userId,
    name,
    variety_name,
    crop_name ?? variety_name,
    category,
    location_type,
    planted_at,
    location_name ?? null,
    latitude ?? null,
    longitude ?? null,
    avg_temp_c ?? null,
    current_temp_c ?? null,
    avg_humidity_pct ?? null,
    annual_rainfall_mm ?? null,
    dry_months_count ?? null,
    sunshine_hours_day ?? null,
    elevation_m ?? null,
    climate_zone ?? null
  );

  // Insert week 1 tasks
  const tasks = getInitialTasks(category, location_type);
  const insertTask = db.prepare(`
    INSERT INTO weekly_tasks (id, plant_id, week_number, task) VALUES (?, ?, 1, ?)
  `);
  for (const task of tasks) {
    insertTask.run(randomUUID(), id, task);
  }

  const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(id);
  return NextResponse.json(plant);
}
