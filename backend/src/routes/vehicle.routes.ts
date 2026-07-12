import { Router, Request, Response } from 'express';
import { vehicleService } from '../services/vehicle.service';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const filters = { type: req.query.type as string, status: req.query.status as string, region: req.query.region as string, search: req.query.search as string };
    res.json(vehicleService.getAll(filters));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/eligible', (req: Request, res: Response) => {
  try { res.json(vehicleService.getEligibleForDispatch()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const v = vehicleService.getById(parseInt(req.params.id));
    if (!v) { res.status(404).json({ error: 'Vehicle not found' }); return; }
    res.json(v);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id/360', (req: Request, res: Response) => {
  try { res.json(vehicleService.getVehicle360(parseInt(req.params.id))); }
  catch (err: any) { res.status(404).json({ error: err.message }); }
});

router.post('/', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { res.status(201).json(vehicleService.create(req.body)); }
  catch (err: any) { res.status(err.message.includes('already exists') ? 409 : 400).json({ error: err.message }); }
});

router.put('/:id', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { res.json(vehicleService.update(parseInt(req.params.id), req.body)); }
  catch (err: any) { res.status(err.message.includes('not found') ? 404 : 400).json({ error: err.message }); }
});

router.delete('/:id', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { vehicleService.delete(parseInt(req.params.id)); res.json({ success: true }); }
  catch (err: any) { res.status(err.message.includes('not found') ? 404 : 400).json({ error: err.message }); }
});

export default router;
