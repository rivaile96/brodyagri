import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbInstance: any = null;

export function getDb() {
  if (!dbInstance) {
    const dbPath = path.join(process.cwd(), 'data', 'agriradar.db');
    const dbDir = path.dirname(dbPath);

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS commodities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'kg',
      growth_days INTEGER NOT NULL,
      season_optimal TEXT,
      base_cost_per_kg INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS market_prices (
      id TEXT PRIMARY KEY,
      commodity_id TEXT NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
      region TEXT NOT NULL,
      market_name TEXT NOT NULL,
      farmer_price INTEGER NOT NULL,
      wholesale_price INTEGER NOT NULL,
      consumer_price INTEGER NOT NULL,
      trend TEXT CHECK(trend IN ('up', 'down', 'stable')) DEFAULT 'stable',
      volatility TEXT CHECK(volatility IN ('low', 'medium', 'high')) DEFAULT 'low',
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS harvest_listings (
      id TEXT PRIMARY KEY,
      farmer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      region TEXT NOT NULL,
      commodity_id TEXT NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
      estimated_kg INTEGER NOT NULL,
      ready_date TEXT NOT NULL,
      asking_price INTEGER,
      status TEXT CHECK(status IN ('available', 'booked', 'sold')) DEFAULT 'available',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export default getDb;
