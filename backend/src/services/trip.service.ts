import { getDb } from '../db/database';

export class TripService {
  getAll(filters?: { status?: string; search?: string }) {
    const db = getDb();
    let sql = `SELECT t.*, v.reg_number as vehicle_reg, d.name as driver_name
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      WHERE 1=1`;
    const params: any[] = [];
    if (filters?.status) { sql += ' AND t.status = ?'; params.push(filters.status); }
    if (filters?.search) {
      sql += ' AND (t.source LIKE ? OR t.destination LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    sql += ' ORDER BY t.id DESC';
    return db.prepare(sql).all(...params);
  }

  getById(id: number) {
    return getDb().prepare(`
      SELECT t.*, v.reg_number as vehicle_reg, d.name as driver_name
      FROM trips t LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id WHERE t.id = ?
    `).get(id);
  }

  /** Create a trip as Draft. Validates cargo weight against vehicle max load. */
  create(data: any) {
    const db = getDb();
    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(data.vehicle_id) as any;
    if (!vehicle) throw new Error('Vehicle not found');

    const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(data.driver_id) as any;
    if (!driver) throw new Error('Driver not found');

    // ===== GUARDRAIL: Cargo overload =====
    if (data.cargo_weight_kg > vehicle.max_load_kg) {
      throw new Error(`🛡️ GUARDRAIL: Cargo weight (${data.cargo_weight_kg}kg) exceeds vehicle max load (${vehicle.max_load_kg}kg)`);
    }

    const result = db.prepare(
      'INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(data.source, data.destination, data.vehicle_id, data.driver_id, data.cargo_weight_kg, data.planned_distance_km, data.revenue || 0, 'Draft');

    return this.getById(result.lastInsertRowid as number);
  }

  /** Dispatch a Draft trip. Enforces ALL business rules. */
  dispatch(id: number) {
    const db = getDb();
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as any;
    if (!trip) throw new Error('Trip not found');

    // ===== GUARDRAIL: Only Draft can be dispatched =====
    if (trip.status !== 'Draft') {
      throw new Error(`🛡️ GUARDRAIL: Only Draft trips can be dispatched. Current status: ${trip.status}`);
    }

    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(trip.vehicle_id) as any;
    const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(trip.driver_id) as any;

    // ===== GUARDRAIL: Vehicle must be Available =====
    if (vehicle.status !== 'Available') {
      throw new Error(`🛡️ GUARDRAIL: Vehicle ${vehicle.reg_number} is not available (current: ${vehicle.status})`);
    }

    // ===== GUARDRAIL: Retired vehicles cannot be dispatched =====
    if (vehicle.status === 'Retired') {
      throw new Error(`🛡️ GUARDRAIL: Vehicle ${vehicle.reg_number} is retired and cannot be dispatched`);
    }

    // ===== GUARDRAIL: Driver must have valid license =====
    const today = new Date().toISOString().split('T')[0];
    if (driver.license_expiry < today) {
      throw new Error(`🛡️ GUARDRAIL: Driver ${driver.name}'s license expired on ${driver.license_expiry}`);
    }

    // ===== GUARDRAIL: Driver must be Available =====
    if (driver.status !== 'Available') {
      throw new Error(`🛡️ GUARDRAIL: Driver ${driver.name} is not available (current: ${driver.status})`);
    }

    // ===== GUARDRAIL: Suspended driver cannot drive =====
    if (driver.status === 'Suspended') {
      throw new Error(`🛡️ GUARDRAIL: Driver ${driver.name} is suspended`);
    }

    // ===== GUARDRAIL: Re-validate cargo weight =====
    if (trip.cargo_weight_kg > vehicle.max_load_kg) {
      throw new Error(`🛡️ GUARDRAIL: Cargo (${trip.cargo_weight_kg}kg) exceeds vehicle max (${vehicle.max_load_kg}kg)`);
    }

    // All clear — transition statuses
    const now = new Date().toISOString();
    db.prepare("UPDATE trips SET status = 'Dispatched', dispatched_at = ? WHERE id = ?").run(now, id);
    db.prepare("UPDATE vehicles SET status = 'On Trip' WHERE id = ?").run(trip.vehicle_id);
    db.prepare("UPDATE drivers SET status = 'On Trip' WHERE id = ?").run(trip.driver_id);

    return this.getById(id);
  }

  /** Complete a Dispatched trip. Returns vehicle & driver to Available. */
  complete(id: number, data: { actual_distance_km?: number; revenue?: number }) {
    const db = getDb();
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as any;
    if (!trip) throw new Error('Trip not found');

    // ===== GUARDRAIL: Only Dispatched can be completed =====
    if (trip.status !== 'Dispatched') {
      throw new Error(`🛡️ GUARDRAIL: Only Dispatched trips can be completed. Current status: ${trip.status}`);
    }

    const now = new Date().toISOString();
    db.prepare(
      "UPDATE trips SET status = 'Completed', completed_at = ?, actual_distance_km = ?, revenue = ? WHERE id = ?"
    ).run(now, data.actual_distance_km || trip.planned_distance_km, data.revenue ?? trip.revenue, id);

    // Return vehicle & driver to Available
    db.prepare("UPDATE vehicles SET status = 'Available' WHERE id = ?").run(trip.vehicle_id);
    db.prepare("UPDATE drivers SET status = 'Available' WHERE id = ?").run(trip.driver_id);

    // Update odometer
    if (data.actual_distance_km) {
      db.prepare('UPDATE vehicles SET odometer = odometer + ? WHERE id = ?').run(data.actual_distance_km, trip.vehicle_id);
    }

    return this.getById(id);
  }

  /** Cancel a Draft or Dispatched trip. Returns vehicle & driver to Available if Dispatched. */
  cancel(id: number) {
    const db = getDb();
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as any;
    if (!trip) throw new Error('Trip not found');

    if (!['Draft', 'Dispatched'].includes(trip.status)) {
      throw new Error(`🛡️ GUARDRAIL: Only Draft or Dispatched trips can be cancelled. Current: ${trip.status}`);
    }

    db.prepare("UPDATE trips SET status = 'Cancelled' WHERE id = ?").run(id);

    if (trip.status === 'Dispatched') {
      db.prepare("UPDATE vehicles SET status = 'Available' WHERE id = ?").run(trip.vehicle_id);
      db.prepare("UPDATE drivers SET status = 'Available' WHERE id = ?").run(trip.driver_id);
    }

    return this.getById(id);
  }
}

export const tripService = new TripService();
