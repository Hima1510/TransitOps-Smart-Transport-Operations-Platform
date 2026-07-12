import { getDb } from '../db/database';

export class FuelService {
  getAll(filters?: { vehicle_id?: number }) {
    const db = getDb();
    let sql = `SELECT f.*, v.reg_number as vehicle_reg FROM fuel_logs f
      LEFT JOIN vehicles v ON f.vehicle_id = v.id WHERE 1=1`;
    const params: any[] = [];
    if (filters?.vehicle_id) { sql += ' AND f.vehicle_id = ?'; params.push(filters.vehicle_id); }
    sql += ' ORDER BY f.date DESC';
    return db.prepare(sql).all(...params);
  }

  create(data: { vehicle_id: number; liters: number; cost: number; date: string }) {
    const db = getDb();
    const vehicle = db.prepare('SELECT id FROM vehicles WHERE id = ?').get(data.vehicle_id);
    if (!vehicle) throw new Error('Vehicle not found');

    const result = db.prepare('INSERT INTO fuel_logs (vehicle_id, liters, cost, date) VALUES (?, ?, ?, ?)')
      .run(data.vehicle_id, data.liters, data.cost, data.date);

    return db.prepare('SELECT f.*, v.reg_number as vehicle_reg FROM fuel_logs f LEFT JOIN vehicles v ON f.vehicle_id = v.id WHERE f.id = ?').get(result.lastInsertRowid);
  }
}

export class ExpenseService {
  getAll(filters?: { vehicle_id?: number }) {
    const db = getDb();
    let sql = `SELECT e.*, v.reg_number as vehicle_reg FROM expenses e
      LEFT JOIN vehicles v ON e.vehicle_id = v.id WHERE 1=1`;
    const params: any[] = [];
    if (filters?.vehicle_id) { sql += ' AND e.vehicle_id = ?'; params.push(filters.vehicle_id); }
    sql += ' ORDER BY e.date DESC';
    return db.prepare(sql).all(...params);
  }

  create(data: { vehicle_id: number; category: string; amount: number; date: string; note?: string }) {
    const db = getDb();
    const vehicle = db.prepare('SELECT id FROM vehicles WHERE id = ?').get(data.vehicle_id);
    if (!vehicle) throw new Error('Vehicle not found');

    const result = db.prepare('INSERT INTO expenses (vehicle_id, category, amount, date, note) VALUES (?, ?, ?, ?, ?)')
      .run(data.vehicle_id, data.category || 'other', data.amount, data.date, data.note || '');

    return db.prepare('SELECT e.*, v.reg_number as vehicle_reg FROM expenses e LEFT JOIN vehicles v ON e.vehicle_id = v.id WHERE e.id = ?').get(result.lastInsertRowid);
  }
}

export const fuelService = new FuelService();
export const expenseService = new ExpenseService();
