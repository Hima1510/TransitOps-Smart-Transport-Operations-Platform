import { Router, Request, Response } from 'express';
import { driverService } from '../services/driver.service';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try { res.json(driverService.getAll({ status: req.query.status as string, search: req.query.search as string })); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/eligible', (req: Request, res: Response) => {
  try { res.json(driverService.getEligibleForAssignment()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/expiring', (req: Request, res: Response) => {
  try { res.json(driverService.getExpiringSoon(parseInt(req.query.days as string) || 30)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/expired', (req: Request, res: Response) => {
  try { res.json(driverService.getExpired()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const d = driverService.getById(parseInt(req.params.id));
    if (!d) { res.status(404).json({ error: 'Driver not found' }); return; }
    res.json(d);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id/profile', (req: Request, res: Response) => {
  try { res.json(driverService.getDriverProfile(parseInt(req.params.id))); }
  catch (err: any) { res.status(404).json({ error: err.message }); }
});

router.post('/', requireRole('fleet_manager', 'safety_officer'), (req: Request, res: Response) => {
  try { res.status(201).json(driverService.create(req.body)); }
  catch (err: any) { res.status(err.message.includes('already exists') ? 409 : 400).json({ error: err.message }); }
});

router.put('/:id', requireRole('fleet_manager', 'safety_officer'), (req: Request, res: Response) => {
  try { res.json(driverService.update(parseInt(req.params.id), req.body)); }
  catch (err: any) { res.status(err.message.includes('not found') ? 404 : 400).json({ error: err.message }); }
});

router.delete('/:id', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { driverService.delete(parseInt(req.params.id)); res.json({ success: true }); }
  catch (err: any) { res.status(err.message.includes('not found') ? 404 : 400).json({ error: err.message }); }
});

export default router;
