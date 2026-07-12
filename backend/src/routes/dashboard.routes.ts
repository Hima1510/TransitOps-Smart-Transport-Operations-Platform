import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';

const router = Router();

router.get('/kpis', (req: Request, res: Response) => {
  try { res.json(analyticsService.getDashboardKPIs()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/attention', (req: Request, res: Response) => {
  try { res.json(analyticsService.getAttentionItems()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/fuel-efficiency', (req: Request, res: Response) => {
  try { res.json(analyticsService.getFuelEfficiency()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/cost-breakdown', (req: Request, res: Response) => {
  try { res.json(analyticsService.getCostBreakdown()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/roi-leaderboard', (req: Request, res: Response) => {
  try { res.json(analyticsService.getROILeaderboard()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/utilization-over-time', (req: Request, res: Response) => {
  try { res.json(analyticsService.getUtilizationOverTime()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/safety', (req: Request, res: Response) => {
  try { res.json(analyticsService.getSafetyOfficerDashboard()); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
