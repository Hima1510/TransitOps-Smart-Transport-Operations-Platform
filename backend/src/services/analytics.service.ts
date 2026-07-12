import { getDb } from '../db/database';

export class AnalyticsService {
  getDashboardKPIs() {
    const db = getDb();
    const totalVehicles = (db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status != 'Retired'").get() as any).count;
    const availableVehicles = (db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'Available'").get() as any).count;
    const inMaintenance = (db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'In Shop'").get() as any).count;
    const onTrip = (db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'On Trip'").get() as any).count;
    const activeTrips = (db.prepare("SELECT COUNT(*) as count FROM trips WHERE status = 'Dispatched'").get() as any).count;
    const pendingTrips = (db.prepare("SELECT COUNT(*) as count FROM trips WHERE status = 'Draft'").get() as any).count;
    const driversOnDuty = (db.prepare("SELECT COUNT(*) as count FROM drivers WHERE status = 'On Trip'").get() as any).count;

    return {
      totalVehicles, availableVehicles, inMaintenance, vehiclesOnTrip: onTrip,
      activeTrips, pendingTrips, driversOnDuty,
      fleetUtilization: totalVehicles > 0 ? Math.round((onTrip / totalVehicles) * 100) : 0,
    };
  }

  getAttentionItems() {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    const thirtyDays = new Date(); thirtyDays.setDate(thirtyDays.getDate() + 30);
    const thirtyDaysStr = thirtyDays.toISOString().split('T')[0];

    const expiringLicenses = db.prepare('SELECT * FROM drivers WHERE license_expiry BETWEEN ? AND ? ORDER BY license_expiry ASC').all(today, thirtyDaysStr);
    const expiredLicenses = db.prepare('SELECT * FROM drivers WHERE license_expiry < ? ORDER BY license_expiry ASC').all(today);

    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const overdueMaintenance = db.prepare(`
      SELECT m.*, v.reg_number as vehicle_reg FROM maintenance m
      LEFT JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.status = 'open' AND m.opened_at < ? ORDER BY m.opened_at ASC
    `).all(sevenDaysAgo.toISOString());

    return { expiringLicenses, expiredLicenses, overdueMaintenance };
  }

  getFuelEfficiency() {
    return getDb().prepare(`
      SELECT v.id, v.reg_number, v.name_model, v.type,
        COALESCE(SUM(t.actual_distance_km), 0) as total_distance,
        COALESCE(fl.total_liters, 0) as total_liters,
        CASE WHEN COALESCE(fl.total_liters, 0) > 0
          THEN ROUND(COALESCE(SUM(t.actual_distance_km), 0) / fl.total_liters, 2) ELSE 0
        END as km_per_liter
      FROM vehicles v
      LEFT JOIN trips t ON t.vehicle_id = v.id AND t.status = 'Completed'
      LEFT JOIN (SELECT vehicle_id, SUM(liters) as total_liters FROM fuel_logs GROUP BY vehicle_id) fl ON fl.vehicle_id = v.id
      WHERE v.status != 'Retired' GROUP BY v.id ORDER BY km_per_liter DESC
    `).all();
  }

  getCostBreakdown() {
    return getDb().prepare(`
      SELECT v.id, v.reg_number, v.name_model, v.type,
        COALESCE(fc.fuel_cost, 0) as fuel_cost,
        COALESCE(mc.maint_cost, 0) as maintenance_cost,
        COALESCE(ec.expense_total, 0) as other_expenses,
        COALESCE(fc.fuel_cost, 0) + COALESCE(mc.maint_cost, 0) + COALESCE(ec.expense_total, 0) as total_cost
      FROM vehicles v
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as fuel_cost FROM fuel_logs GROUP BY vehicle_id) fc ON fc.vehicle_id = v.id
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as maint_cost FROM maintenance GROUP BY vehicle_id) mc ON mc.vehicle_id = v.id
      LEFT JOIN (SELECT vehicle_id, SUM(amount) as expense_total FROM expenses GROUP BY vehicle_id) ec ON ec.vehicle_id = v.id
      WHERE v.status != 'Retired' ORDER BY total_cost DESC
    `).all();
  }

  getROILeaderboard() {
    return getDb().prepare(`
      SELECT v.id, v.reg_number, v.name_model, v.type, v.acquisition_cost,
        COALESCE(tr.total_revenue, 0) as total_revenue,
        COALESCE(fc.fuel_cost, 0) + COALESCE(mc.maint_cost, 0) + COALESCE(ec.expense_total, 0) as total_cost,
        CASE WHEN v.acquisition_cost > 0
          THEN ROUND((COALESCE(tr.total_revenue, 0) - (COALESCE(fc.fuel_cost, 0) + COALESCE(mc.maint_cost, 0) + COALESCE(ec.expense_total, 0))) / v.acquisition_cost * 100, 2)
          ELSE 0 END as roi_percent
      FROM vehicles v
      LEFT JOIN (SELECT vehicle_id, SUM(revenue) as total_revenue FROM trips WHERE status = 'Completed' GROUP BY vehicle_id) tr ON tr.vehicle_id = v.id
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as fuel_cost FROM fuel_logs GROUP BY vehicle_id) fc ON fc.vehicle_id = v.id
      LEFT JOIN (SELECT vehicle_id, SUM(cost) as maint_cost FROM maintenance GROUP BY vehicle_id) mc ON mc.vehicle_id = v.id
      LEFT JOIN (SELECT vehicle_id, SUM(amount) as expense_total FROM expenses GROUP BY vehicle_id) ec ON ec.vehicle_id = v.id
      WHERE v.status != 'Retired' ORDER BY roi_percent DESC
    `).all();
  }

  getUtilizationOverTime() {
    const db = getDb();
    const results: { date: string; utilization: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const tripsOnDay = (db.prepare(`
        SELECT COUNT(DISTINCT vehicle_id) as count FROM trips
        WHERE status IN ('Dispatched', 'Completed')
          AND dispatched_at <= ? AND (completed_at IS NULL OR completed_at >= ?)
      `).get(dateStr + 'T23:59:59', dateStr + 'T00:00:00') as any).count;
      const totalVehicles = (db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status != 'Retired'").get() as any).count;
      results.push({ date: dateStr, utilization: totalVehicles > 0 ? Math.round((tripsOnDay / totalVehicles) * 100) : 0 });
    }
    return results;
  }
}

export const analyticsService = new AnalyticsService();
