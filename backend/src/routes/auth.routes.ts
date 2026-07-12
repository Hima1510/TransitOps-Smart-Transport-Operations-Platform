import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { signToken } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

function getPasswordHash(user: any): string | undefined {
  if (!user) return undefined;
  if (typeof user.password_hash === 'string') return user.password_hash;
  if (typeof user.passwordHash === 'string') return user.passwordHash;
  if (Array.isArray(user) && typeof user[3] === 'string') return user[3];
  return undefined;
}

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

    const passwordHash = getPasswordHash(user);
    if (!passwordHash) {
      res.status(500).json({ error: 'User record is missing a password hash' });
      return;
    }

    const valid = bcrypt.compareSync(password, passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signToken({
      id: user.id ?? user[0],
      email: user.email ?? user[2],
      role: user.role ?? user[4],
      name: user.name ?? user[1],
    });
    res.json({
      token,
      user: {
        id: user.id ?? user[0],
        name: user.name ?? user[1],
        email: user.email ?? user[2],
        role: user.role ?? user[4],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Name, email, password, and role are required' });
      return;
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(name, email, passwordHash, role);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as any;
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
