import { initDatabase, getDb } from './database';
import { runMigrations } from './migrations';
import bcrypt from 'bcryptjs';

export async function seedDatabase(): Promise<void> {
  await initDatabase();
  const db = getDb();
  runMigrations();

  // Clear existing data
  db.exec(`
    DELETE FROM expenses;
    DELETE FROM fuel_logs;
    DELETE FROM maintenance;
    DELETE FROM trips;
    DELETE FROM drivers;
    DELETE FROM vehicles;
    DELETE FROM users;
  `);

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // ===== USERS =====
  const insertUser = db.prepare(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`
  );
  insertUser.run('Rajesh Kumar', 'fleet@transitops.io', hash('demo1234'), 'fleet_manager');
  insertUser.run('Alex Thompson', 'driver@transitops.io', hash('demo1234'), 'driver');
  insertUser.run('Priya Sharma', 'safety@transitops.io', hash('demo1234'), 'safety_officer');
  insertUser.run('Michael Chen', 'finance@transitops.io', hash('demo1234'), 'financial_analyst');

  // ===== VEHICLES (12) =====
  const insertVehicle = db.prepare(
    `INSERT INTO vehicles (reg_number, name_model, type, max_load_kg, odometer, acquisition_cost, status, region) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  insertVehicle.run('TRK-001', 'Tata Prima 4928', 'Truck', 12000, 145230, 3200000, 'Available', 'North');
  insertVehicle.run('TRK-002', 'Ashok Leyland 4220', 'Truck', 10000, 98450, 2800000, 'Available', 'South');
  insertVehicle.run('TRK-003', 'BharatBenz 3523R', 'Truck', 15000, 210800, 3500000, 'On Trip', 'North');
  insertVehicle.run('TRK-004', 'Eicher Pro 6049', 'Truck', 8000, 67300, 2200000, 'Retired', 'West');
  insertVehicle.run('VAN-001', 'Tata Ace Gold', 'Van', 750, 42100, 650000, 'Available', 'South');
  insertVehicle.run('VAN-002', 'Mahindra Supro', 'Van', 1000, 35600, 720000, 'Available', 'North');
  insertVehicle.run('VAN-003', 'Ashok Leyland Dost', 'Van', 1500, 58900, 850000, 'In Shop', 'West');
  insertVehicle.run('VAN-004', 'Maruti Eeco Cargo', 'Van', 500, 28400, 480000, 'Available', 'South');
  insertVehicle.run('BUS-001', 'Volvo 9600', 'Bus', 2000, 312000, 12000000, 'Available', 'North');
  insertVehicle.run('BUS-002', 'Tata Starbus', 'Bus', 1500, 189000, 5500000, 'Available', 'West');
  insertVehicle.run('CAR-001', 'Toyota Innova', 'Car', 400, 67800, 1800000, 'Available', 'South');
  insertVehicle.run('CAR-002', 'Maruti Ertiga', 'Car', 350, 45200, 1200000, 'Available', 'North');

  // ===== DRIVERS (12) =====
  const insertDriver = db.prepare(
    `INSERT INTO drivers (name, license_number, license_category, license_expiry, contact_number, safety_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const today = new Date();
  const daysFromNow = (d: number) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().split('T')[0];
  };
  const daysAgo = (d: number) => daysFromNow(-d);

  insertDriver.run('Amit Patel', 'DL-2024-001', 'HMV', daysFromNow(365), '9876543210', 92, 'Available');
  insertDriver.run('Suresh Nair', 'DL-2024-002', 'HMV', daysFromNow(180), '9876543211', 88, 'Available');
  insertDriver.run('Vikram Singh', 'DL-2024-003', 'HMV', daysFromNow(400), '9876543212', 95, 'On Trip');
  insertDriver.run('Ravi Gupta', 'DL-2024-004', 'LMV', daysFromNow(90), '9876543213', 78, 'Available');
  insertDriver.run('Deepak Yadav', 'DL-2024-005', 'HMV', daysAgo(90), '9876543214', 65, 'Available'); // EXPIRED
  insertDriver.run('Manoj Kumar', 'DL-2024-006', 'HMV', daysFromNow(15), '9876543215', 70, 'Available'); // Expiring SOON
  insertDriver.run('Sanjay Verma', 'DL-2024-007', 'HMV', daysFromNow(250), '9876543216', 40, 'Suspended'); // SUSPENDED
  insertDriver.run('Arun Mehta', 'DL-2024-008', 'LMV', daysFromNow(300), '9876543217', 85, 'Available');
  insertDriver.run('Karthik Reddy', 'DL-2024-009', 'HMV', daysFromNow(200), '9876543218', 91, 'Available');
  insertDriver.run('Naveen Joshi', 'DL-2024-010', 'HMV', daysFromNow(150), '9876543219', 82, 'Off Duty');
  insertDriver.run('Prakash Rao', 'DL-2024-011', 'LMV', daysFromNow(500), '9876543220', 96, 'Available');
  insertDriver.run('Ganesh Pillai', 'DL-2024-012', 'HMV', daysFromNow(60), '9876543221', 74, 'Available');

  // ===== TRIPS (25) =====
  const insertTrip = db.prepare(
    `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, actual_distance_km, status, dispatched_at, completed_at, revenue, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const routes: [string, string, number][] = [
    ['Mumbai', 'Delhi', 1400], ['Chennai', 'Bangalore', 350], ['Hyderabad', 'Pune', 560],
    ['Kolkata', 'Patna', 600], ['Jaipur', 'Udaipur', 400], ['Ahmedabad', 'Surat', 270],
    ['Lucknow', 'Varanasi', 320], ['Delhi', 'Chandigarh', 250], ['Pune', 'Goa', 460],
    ['Bangalore', 'Mysore', 150], ['Mumbai', 'Nashik', 170], ['Delhi', 'Agra', 230],
  ];

  // Completed trips (18)
  for (let i = 0; i < 18; i++) {
    const route = routes[i % routes.length];
    const vId = (i % 10) + 1;
    const dId = (i % 10) + 1;
    const daysBack = 90 - (i * 4);
    const createdAt = daysAgo(daysBack + 2);
    const dispatchedAt = daysAgo(daysBack);
    const completedAt = daysAgo(daysBack - 2);
    const cargo = Math.floor(Math.random() * 3000) + 500;
    const dist = route[2];
    const actualDist = dist + Math.floor(Math.random() * 40) - 20;
    const rev = Math.floor(dist * (Math.random() * 30 + 20));

    insertTrip.run(route[0], route[1], vId, dId, cargo, dist, actualDist, 'Completed', dispatchedAt, completedAt, rev, createdAt);
  }

  // Cancelled (2)
  insertTrip.run('Mumbai', 'Pune', 1, 1, 5000, 150, null, 'Cancelled', daysAgo(20), null, 0, daysAgo(22));
  insertTrip.run('Delhi', 'Jaipur', 2, 2, 3000, 280, null, 'Cancelled', daysAgo(15), null, 0, daysAgo(17));

  // Dispatched (3) — vehicle 3 & driver 3 are On Trip
  insertTrip.run('Delhi', 'Mumbai', 3, 3, 8000, 1400, null, 'Dispatched', daysAgo(1), null, 0, daysAgo(2));
  insertTrip.run('Chennai', 'Hyderabad', 9, 9, 1200, 630, null, 'Dispatched', daysAgo(0), null, 0, daysAgo(1));
  insertTrip.run('Bangalore', 'Kochi', 10, 4, 1000, 560, null, 'Dispatched', daysAgo(0), null, 0, daysAgo(1));

  // Draft (2)
  insertTrip.run('Pune', 'Mumbai', 1, 1, 4000, 150, null, 'Draft', null, null, 0, daysAgo(0));
  insertTrip.run('Surat', 'Ahmedabad', 2, 2, 2000, 270, null, 'Draft', null, null, 0, daysAgo(0));

  // Fix statuses for dispatched trips
  db.prepare(`UPDATE vehicles SET status = 'On Trip' WHERE id = ?`).run(3);
  db.prepare(`UPDATE vehicles SET status = 'On Trip' WHERE id = ?`).run(9);
  db.prepare(`UPDATE vehicles SET status = 'On Trip' WHERE id = ?`).run(10);
  db.prepare(`UPDATE drivers SET status = 'On Trip' WHERE id = ?`).run(3);
  db.prepare(`UPDATE drivers SET status = 'On Trip' WHERE id = ?`).run(9);
  db.prepare(`UPDATE drivers SET status = 'On Trip' WHERE id = ?`).run(4);

  // ===== FUEL LOGS (45) =====
  const insertFuel = db.prepare(`INSERT INTO fuel_logs (vehicle_id, liters, cost, date) VALUES (?, ?, ?, ?)`);
  for (let i = 0; i < 45; i++) {
    const vId = (i % 12) + 1;
    const liters = Math.floor(Math.random() * 200) + 30;
    const cost = Math.round(liters * (95 + Math.random() * 10));
    const date = daysAgo(Math.floor(Math.random() * 90));
    insertFuel.run(vId, liters, cost, date);
  }

  // ===== EXPENSES (22) =====
  const insertExpense = db.prepare(`INSERT INTO expenses (vehicle_id, category, amount, date, note) VALUES (?, ?, ?, ?, ?)`);
  const expenseNotes = [
    'Highway toll - NH48', 'Toll plaza - Bandra-Worli', 'Parking charges',
    'Weighbridge fee', 'RTO permit', 'Cleaning & washing', 'Tire repair',
    'Loading/unloading charges',
  ];
  for (let i = 0; i < 22; i++) {
    const vId = (i % 12) + 1;
    const category = i % 3 === 0 ? 'other' : 'toll';
    const amount = Math.floor(Math.random() * 2000) + 100;
    const date = daysAgo(Math.floor(Math.random() * 90));
    insertExpense.run(vId, category, amount, date, expenseNotes[i % expenseNotes.length]);
  }

  // ===== MAINTENANCE (8) =====
  const insertMaint = db.prepare(`INSERT INTO maintenance (vehicle_id, description, cost, status, opened_at, closed_at) VALUES (?, ?, ?, ?, ?, ?)`);
  insertMaint.run(1, 'Engine oil change and filter replacement', 8500, 'closed', daysAgo(60), daysAgo(58));
  insertMaint.run(2, 'Brake pad replacement - all wheels', 12000, 'closed', daysAgo(45), daysAgo(43));
  insertMaint.run(3, 'Transmission fluid change', 6500, 'closed', daysAgo(30), daysAgo(28));
  insertMaint.run(5, 'AC compressor repair', 15000, 'closed', daysAgo(25), daysAgo(22));
  insertMaint.run(9, 'Suspension spring replacement', 22000, 'closed', daysAgo(20), daysAgo(17));
  insertMaint.run(7, 'Major engine overhaul - cylinder head gasket', 45000, 'open', daysAgo(5), null);
  insertMaint.run(1, 'Clutch plate replacement scheduled', 18000, 'open', daysAgo(2), null);
  insertMaint.run(6, 'Wheel alignment and balancing', 3500, 'open', daysAgo(1), null);

  // Vehicle 6 (VAN-002) → In Shop due to open maintenance
  db.prepare(`UPDATE vehicles SET status = 'In Shop' WHERE id = ?`).run(6);

  console.log('✅ Seed data inserted successfully');
  console.log('   Users: 4 (fleet@transitops.io / driver@transitops.io / safety@transitops.io / finance@transitops.io)');
  console.log('   Password: demo1234');
  console.log('   Vehicles: 12 | Drivers: 12 | Trips: 25 | Fuel Logs: 45 | Expenses: 22 | Maintenance: 8');
}

// Run directly
seedDatabase().then(() => {
  console.log('🚀 Database seeded!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
