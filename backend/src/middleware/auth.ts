import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest, AuthPayload } from '../common/types';
import { AppError } from '../common/errors/AppError';
import { redis } from '../config/redis';

const TOKEN_BLACKLIST_PREFIX = 'bl:';

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Missing or invalid authorization header'));
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwt.secret) as AuthPayload;

    // Check if token has been blacklisted (user logged out)
    redis.get(`${TOKEN_BLACKLIST_PREFIX}${token}`).then(blacklisted => {
      if (blacklisted) {
        return next(AppError.unauthorized('Token has been revoked'));
      }
      req.user = payload;
      next();
    }).catch(() => {
      // If Redis is down, allow the request (fail-open for auth)
      req.user = payload;
      next();
    });
  } catch {
    return next(AppError.unauthorized('Invalid or expired token'));
  }
}

/**
 * Blacklist a JWT token until its natural expiry.
 * Called on logout to prevent reuse of the token.
 */
export async function blacklistToken(token: string): Promise<void> {
  try {
    const payload = jwt.decode(token) as { exp?: number } | null;
    if (!payload?.exp) return;

    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.set(`${TOKEN_BLACKLIST_PREFIX}${token}`, '1', 'EX', ttl);
    }
  } catch {
    // Best effort — if Redis is down, token remains valid until expiry
  }
}
