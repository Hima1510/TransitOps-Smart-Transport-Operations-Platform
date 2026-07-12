import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database';
import { runMigrations } from './db/migrations';
import { authenticateToken } from './middleware/auth';

// Route imports
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import driverRoutes from './routes/driver.routes';
import tripRoutes from './routes/trip.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import fuelRoutes from './routes/fuel.routes';
import expenseRoutes from './routes/expense.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check (no auth)
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (no auth middleware required for login)
app.use('/api/auth', authRoutes);

// Protected routes — require authentication
app.use('/api/vehicles', authenticateToken, vehicleRoutes);
app.use('/api/drivers', authenticateToken, driverRoutes);
app.use('/api/trips', authenticateToken, tripRoutes);
app.use('/api/maintenance', authenticateToken, maintenanceRoutes);
app.use('/api/fuel', authenticateToken, fuelRoutes);
app.use('/api/expenses', authenticateToken, expenseRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Async startup — initialize DB then start server
async function start() {
    await initDatabase();
    runMigrations();
    console.log('✅ Database initialized and migrations applied');

    app.listen(PORT, () => {
        console.log(`🚀 TransitOps API running on http://localhost:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
}

start().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});

export default app;
