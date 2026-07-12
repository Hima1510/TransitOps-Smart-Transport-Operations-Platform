import { getDb } from '../db/database';

export class MaintenanceService {
  getAll(filters?: { status?: string; vehicle_id?: number }) {
    const db = getDb();
    let sql = `SELECT m.*, v.reg_number as vehicle_reg FROM maintenance m
      LEFT JOIN vehicles v ON m.vehicle_id = v.id WHERE 1=1`;
    const params: any[] = [];
    if (filters?.status) { sql += ' AND m.status = ?'; params.push(filters.status); }
    if (filters?.vehicle_id) { sql += ' AND m.vehicle_id = ?'; params.push(filters.vehicle_id); }
    sql += ' ORDER BY m.opened_at DESC';
    return db.prepare(sql).all(...params);
  }

  /** Create maintenance record — automatically moves vehicle to "In Shop" */
  create(data: { vehicle_id: number; description: string; cost?: number }) {
    const db = getDb();
    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(data.vehicle_id) as any;
    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.status === 'On Trip') throw new Error('🛡️ GUARDRAIL: Cannot open maintenance on a vehicle currently on a trip');

    const result = db.prepare(
      'INSERT INTO maintenance (vehicle_id, description, cost) VALUES (?, ?, ?)'
    ).run(data.vehicle_id, data.description, data.cost || 0);

    // ===== AUTO: Vehicle → In Shop =====
    db.prepare("UPDATE vehicles SET status = 'In Shop' WHERE id = ?").run(data.vehicle_id);

    return db.prepare('SELECT m.*, v.reg_number as vehicle_reg FROM maintenance m LEFT JOIN vehicles v ON m.vehicle_id = v.id WHERE m.id = ?').get(result.lastInsertRowid);
  }

  /** Close maintenance record — returns vehicle to "Available" */
  close(id: number, data?: { cost?: number }) {
    const db = getDb();
    const record = db.prepare('SELECT * FROM maintenance WHERE id = ?').get(id) as any;
    if (!record) throw new Error('Maintenance record not found');
    if (record.status === 'closed') throw new Error('This maintenance record is already closed');

    const now = new Date().toISOString();
    db.prepare("UPDATE maintenance SET status = 'closed', closed_at = ?, cost = ? WHERE id = ?")
      .run(now, data?.cost ?? record.cost, id);

    // ===== AUTO: Vehicle → Available (only if no other open maintenance) =====
    const otherOpen = db.prepare("SELECT COUNT(*) as count FROM maintenance WHERE vehicle_id = ? AND status = 'open' AND id != ?").get(record.vehicle_id, id) as any;
    if (otherOpen.count === 0) {
      db.prepare("UPDATE vehicles SET status = 'Available' WHERE id = ?").run(record.vehicle_id);
    }

    return db.prepare('SELECT m.*, v.reg_number as vehicle_reg FROM maintenance m LEFT JOIN vehicles v ON m.vehicle_id = v.id WHERE m.id = ?').get(id);
  }
}

export const maintenanceService = new MaintenanceService();
