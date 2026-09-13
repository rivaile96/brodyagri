import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'brodyagri.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variety_name TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    category TEXT NOT NULL,
    location_type TEXT NOT NULL,
    planted_at TEXT NOT NULL,
    current_week INTEGER DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    cover_photo_url TEXT,
    location_name TEXT,
    latitude REAL,
    longitude REAL,
    avg_temp_c REAL,
    current_temp_c REAL,
    avg_humidity_pct INTEGER,
    annual_rainfall_mm INTEGER,
    dry_months_count INTEGER,
    sunshine_hours_day REAL,
    elevation_m INTEGER,
    climate_zone TEXT,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weekly_tasks (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    plant_id TEXT NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    task TEXT NOT NULL,
    is_done INTEGER DEFAULT 0 NOT NULL,
    done_at TEXT,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weekly_analyses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    plant_id TEXT NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    photo_url TEXT,
    ai_summary TEXT,
    tasks_for_next_week TEXT DEFAULT '[]' NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ai_settings (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT DEFAULT 'openai' NOT NULL,
    api_key_encrypted TEXT,
    model TEXT DEFAULT 'gpt-4o-mini' NOT NULL,
    custom_endpoint TEXT,
    is_active INTEGER DEFAULT 0 NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plant_guides (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    harvest_time TEXT NOT NULL,
    sunlight_req TEXT NOT NULL,
    optimal_temp TEXT NOT NULL,
    optimal_elevation TEXT NOT NULL,
    summary TEXT NOT NULL,
    media_recipe TEXT NOT NULL,
    vegetative_steps TEXT NOT NULL,
    generative_steps TEXT NOT NULL,
    pests_diseases TEXT NOT NULL,
    pro_tips TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL
  );
`);

export default db;