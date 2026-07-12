import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { signToken } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Name, email, password and role are required' });
      return;
    }

    const validRoles = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
      return;
    }

    const db = getDb();

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).run(name, email, password_hash, role);

    const userId = result.lastInsertRowid;

    const token = signToken({ id: userId, email, role, name });
    res.status(201).json({
      token,
      user: { id: userId, name, email, role },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
