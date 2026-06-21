import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const dbUsers = await db.select().from(users).where(eq(users.uid, req.user.uid));
    const user = dbUsers[0];

    if (!user) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    req.dbUser = user;

    if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'editor') {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
  } catch (err) {
    console.error('Error checking DB role:', err);
    return res.status(500).json({ error: 'Internal server error checking permissions' });
  }
};
