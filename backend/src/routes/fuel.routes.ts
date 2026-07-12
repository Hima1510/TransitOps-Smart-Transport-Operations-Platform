import { Router, Request, Response } from 'express';
import { fuelService } from '../services/fuel-expense.service';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try { res.json(fuelService.getAll({ vehicle_id: req.query.vehicle_id ? parseInt(req.query.vehicle_id as string) : undefined })); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', (req: Request, res: Response) => {
  try { res.status(201).json(fuelService.create(req.body)); }
  catch (err: any) { res.status(400).json({ error: err.message }); }
});

export default router;
