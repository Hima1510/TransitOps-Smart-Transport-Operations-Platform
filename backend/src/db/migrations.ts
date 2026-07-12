import { getDb } from './database';

export function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('fleet_manager','driver','safety_officer','financial_analyst')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reg_number TEXT NOT NULL UNIQUE,
      name_model TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Truck','Van','Bus','Car')),
      max_load_kg REAL NOT NULL DEFAULT 0,
      odometer REAL NOT NULL DEFAULT 0,
      acquisition_cost REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available','On Trip','In Shop','Retired')),
      region TEXT DEFAULT 'North',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      license_number TEXT NOT NULL UNIQUE,
      license_category TEXT NOT NULL DEFAULT 'HMV',
      license_expiry TEXT NOT NULL,
      contact_number TEXT,
      safety_score INTEGER NOT NULL DEFAULT 100 CHECK(safety_score >= 0 AND safety_score <= 100),
      status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available','On Trip','Off Duty','Suspended')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      destination TEXT NOT NULL,
      vehicle_id INTEGER NOT NULL,
      driver_id INTEGER NOT NULL,
      cargo_weight_kg REAL NOT NULL DEFAULT 0,
      planned_distance_km REAL NOT NULL DEFAULT 0,
      actual_distance_km REAL,
      status TEXT NOT NULL DEFAULT 'Draft' CHECK(status IN ('Draft','Dispatched','Completed','Cancelled')),
      dispatched_at TEXT,
      completed_at TEXT,
      revenue REAL NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
    );

    CREATE TABLE IF NOT EXISTS maintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      cost REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')),
      opened_at TEXT DEFAULT (datetime('now')),
      closed_at TEXT,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS fuel_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      liters REAL NOT NULL,
      cost REAL NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );
  `);

  console.log('✅ Migrations completed successfully');
}
