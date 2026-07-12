import { getDb } from '../db/database';

export class VehicleService {
  getAll(filters?: { type?: string; status?: string; region?: string; search?: string }) {
    const db = getDb();
    let sql = 'SELECT * FROM vehicles WHERE 1=1';
    const params: any[] = [];

    if (filters?.type) { sql += ' AND type = ?'; params.push(filters.type); }
    if (filters?.status) { sql += ' AND status = ?'; params.push(filters.status); }
    if (filters?.region) { sql += ' AND region = ?'; params.push(filters.region); }
    if (filters?.search) {
      sql += ' AND (reg_number LIKE ? OR name_model LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    sql += ' ORDER BY id DESC';
    return db.prepare(sql).all(...params);
  }

  getById(id: number) {
    return getDb().prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  }

  getEligibleForDispatch() {
    return getDb().prepare("SELECT * FROM vehicles WHERE status = 'Available' ORDER BY reg_number").all();
  }

  create(data: any) {
    const db = getDb();
    const existing = db.prepare('SELECT id FROM vehicles WHERE reg_number = ?').get(data.reg_number);
    if (existing) throw new Error('Vehicle with this registration number already exists');

    const result = db.prepare(
      'INSERT INTO vehicles (reg_number, name_model, type, max_load_kg, odometer, acquisition_cost, status, region) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(data.reg_number, data.name_model, data.type, data.max_load_kg || 0, data.odometer || 0, data.acquisition_cost || 0, data.status || 'Available', data.region || 'North');

    return this.getById(result.lastInsertRowid as number);
  }

  update(id: number, data: any) {
    const db = getDb();
    const vehicle = this.getById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    if (data.reg_number && data.reg_number !== (vehicle as any).reg_number) {
      const existing = db.prepare('SELECT id FROM vehicles WHERE reg_number = ? AND id != ?').get(data.reg_number, id);
      if (existing) throw new Error('Vehicle with this registration number already exists');
    }

    db.prepare(
      'UPDATE vehicles SET reg_number=?, name_model=?, type=?, max_load_kg=?, odometer=?, acquisition_cost=?, status=?, region=? WHERE id=?'
    ).run(
      data.reg_number || (vehicle as any).reg_number, data.name_model || (vehicle as any).name_model,
      data.type || (vehicle as any).type, data.max_load_kg ?? (vehicle as any).max_load_kg,
      data.odometer ?? (vehicle as any).odometer, data.acquisition_cost ?? (vehicle as any).acquisition_cost,
      data.status || (vehicle as any).status, data.region || (vehicle as any).region, id
    );
    return this.getById(id);
  }

  delete(id: number) {
    const vehicle = this.getById(id) as any;
    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.status === 'On Trip') throw new Error('Cannot delete a vehicle that is currently on a trip');
    getDb().prepare('DELETE FROM vehicles WHERE id = ?').run(id);
  }

  getVehicle360(id: number) {
    const db = getDb();
    const vehicle = this.getById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    const trips = db.prepare('SELECT * FROM trips WHERE vehicle_id = ? ORDER BY created_at DESC').all(id);
    const fuelLogs = db.prepare('SELECT * FROM fuel_logs WHERE vehicle_id = ? ORDER BY date DESC').all(id);
    const maintenanceRecords = db.prepare('SELECT * FROM maintenance WHERE vehicle_id = ? ORDER BY opened_at DESC').all(id);
    const expenses = db.prepare('SELECT * FROM expenses WHERE vehicle_id = ? ORDER BY date DESC').all(id);

    const totalRevenue = (db.prepare("SELECT COALESCE(SUM(revenue),0) as total FROM trips WHERE vehicle_id = ? AND status = 'Completed'").get(id) as any).total;
    const totalFuelCost = (db.prepare('SELECT COALESCE(SUM(cost),0) as total FROM fuel_logs WHERE vehicle_id = ?').get(id) as any).total;
    const totalMaintenanceCost = (db.prepare('SELECT COALESCE(SUM(cost),0) as total FROM maintenance WHERE vehicle_id = ?').get(id) as any).total;
    const totalExpenses = (db.prepare('SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE vehicle_id = ?').get(id) as any).total;
    const totalDistance = (db.prepare("SELECT COALESCE(SUM(actual_distance_km),0) as total FROM trips WHERE vehicle_id = ? AND status = 'Completed'").get(id) as any).total;
    const totalLiters = (db.prepare('SELECT COALESCE(SUM(liters),0) as total FROM fuel_logs WHERE vehicle_id = ?').get(id) as any).total;

    const operationalCost = totalFuelCost + totalMaintenanceCost + totalExpenses;
    const roi = (vehicle as any).acquisition_cost > 0
      ? Math.round(((totalRevenue - operationalCost) / (vehicle as any).acquisition_cost) * 100 * 100) / 100
      : 0;

    return {
      vehicle, trips, fuelLogs, maintenanceRecords, expenses,
      financials: {
        totalRevenue, totalFuelCost, totalMaintenanceCost, totalExpenses, operationalCost,
        totalDistance, totalLiters,
        fuelEfficiency: totalLiters > 0 ? Math.round((totalDistance / totalLiters) * 100) / 100 : 0,
        roi,
      },
    };
  }
}

export const vehicleService = new VehicleService();
