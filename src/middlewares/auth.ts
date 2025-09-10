import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/security.js';
import { AuthError } from '../utils/errors.js';

export interface AuthContext {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AuthError('Missing bearer token'));
  }
  const token = header.slice('Bearer '.length);
  try {
    const decoded = verifyAccessToken(token) as { sub?: string; userId?: string };
    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      return next(new AuthError('Invalid token payload'));
    }
    req.auth = { userId };
    return next();
  } catch (_err) {
    return next(new AuthError('Invalid or expired token'));
  }
}

