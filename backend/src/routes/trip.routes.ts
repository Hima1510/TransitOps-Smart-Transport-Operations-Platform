import { Router, Request, Response } from 'express';
import { tripService } from '../services/trip.service';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try { res.json(tripService.getAll({ status: req.query.status as string, search: req.query.search as string })); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const t = tripService.getById(parseInt(req.params.id));
    if (!t) { res.status(404).json({ error: 'Trip not found' }); return; }
    res.json(t);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireRole('fleet_manager', 'driver'), (req: Request, res: Response) => {
  try { res.status(201).json(tripService.create(req.body)); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/:id/dispatch', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { res.json(tripService.dispatch(parseInt(req.params.id))); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/:id/complete', requireRole('fleet_manager', 'driver'), (req: Request, res: Response) => {
  try { res.json(tripService.complete(parseInt(req.params.id), req.body)); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.post('/:id/cancel', requireRole('fleet_manager'), (req: Request, res: Response) => {
  try { res.json(tripService.cancel(parseInt(req.params.id))); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
