import { getDb } from '../db/database';

export class DriverService {
  getAll(filters?: { status?: string; search?: string }) {
    const db = getDb();
    let sql = 'SELECT * FROM drivers WHERE 1=1';
    const params: any[] = [];
    if (filters?.status) { sql += ' AND status = ?'; params.push(filters.status); }
    if (filters?.search) {
      sql += ' AND (name LIKE ? OR license_number LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    sql += ' ORDER BY id DESC';
    return db.prepare(sql).all(...params);
  }

  getById(id: number) {
    return getDb().prepare('SELECT * FROM drivers WHERE id = ?').get(id);
  }

  getEligibleForAssignment() {
    const today = new Date().toISOString().split('T')[0];
    return getDb().prepare(
      "SELECT * FROM drivers WHERE status = 'Available' AND license_expiry >= ? AND safety_score >= 50 ORDER BY safety_score DESC"
    ).all(today);
  }

  getExpiringSoon(days: number = 30) {
    const today = new Date().toISOString().split('T')[0];
    const future = new Date(); future.setDate(future.getDate() + days);
    return getDb().prepare('SELECT * FROM drivers WHERE license_expiry BETWEEN ? AND ? ORDER BY license_expiry ASC').all(today, future.toISOString().split('T')[0]);
  }

  getExpired() {
    const today = new Date().toISOString().split('T')[0];
    return getDb().prepare('SELECT * FROM drivers WHERE license_expiry < ? ORDER BY license_expiry ASC').all(today);
  }

  create(data: any) {
    const db = getDb();
    const existing = db.prepare('SELECT id FROM drivers WHERE license_number = ?').get(data.license_number);
    if (existing) throw new Error('Driver with this license number already exists');

    const result = db.prepare(
      'INSERT INTO drivers (name, license_number, license_category, license_expiry, contact_number, safety_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(data.name, data.license_number, data.license_category || 'HMV', data.license_expiry, data.contact_number || '', data.safety_score ?? 100, data.status || 'Available');

    return this.getById(result.lastInsertRowid as number);
  }

  update(id: number, data: any) {
    const db = getDb();
    const driver = this.getById(id) as any;
    if (!driver) throw new Error('Driver not found');

    if (data.license_number && data.license_number !== driver.license_number) {
      const existing = db.prepare('SELECT id FROM drivers WHERE license_number = ? AND id != ?').get(data.license_number, id);
      if (existing) throw new Error('Driver with this license number already exists');
    }

    db.prepare(
      'UPDATE drivers SET name=?, license_number=?, license_category=?, license_expiry=?, contact_number=?, safety_score=?, status=? WHERE id=?'
    ).run(
      data.name || driver.name, data.license_number || driver.license_number,
      data.license_category || driver.license_category, data.license_expiry || driver.license_expiry,
      data.contact_number ?? driver.contact_number, data.safety_score ?? driver.safety_score,
      data.status || driver.status, id
    );
    return this.getById(id);
  }

  delete(id: number) {
    const driver = this.getById(id) as any;
    if (!driver) throw new Error('Driver not found');
    if (driver.status === 'On Trip') throw new Error('Cannot delete a driver currently on a trip');
    getDb().prepare('DELETE FROM drivers WHERE id = ?').run(id);
  }

  getDriverProfile(id: number) {
    const db = getDb();
    const driver = this.getById(id);
    if (!driver) throw new Error('Driver not found');

    const trips = db.prepare(`
      SELECT t.*, v.reg_number as vehicle_reg FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      WHERE t.driver_id = ? ORDER BY t.created_at DESC
    `).all(id);

    const stats = db.prepare(`
      SELECT COUNT(*) as totalTrips,
        COALESCE(SUM(actual_distance_km), 0) as totalDistance,
        COALESCE(SUM(revenue), 0) as totalRevenue
      FROM trips WHERE driver_id = ? AND status = 'Completed'
    `).get(id) as any;

    return { driver, trips, stats };
  }
}

export const driverService = new DriverService();
