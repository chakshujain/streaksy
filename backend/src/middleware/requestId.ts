import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../config/logger';

export function requestId(req: Request, _res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  (req as any).requestId = id;
  (req as any).log = logger.child({ requestId: id });
  _res.setHeader('X-Request-ID', id);
  next();
}
