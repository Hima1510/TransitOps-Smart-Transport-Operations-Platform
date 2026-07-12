import { Router, Request, Response } from 'express';
import { maintenanceService } from '../services/maintenance.service';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try { res.json(maintenanceService.getAll({ status: req.query.status as string, vehicle_id: req.query.vehicle_id ? parseInt(req.query.vehicle_id as string) : undefined })); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { res.status(201).json(maintenanceService.create(req.body)); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/:id/close', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { res.json(maintenanceService.close(parseInt(req.params.id), req.body)); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
