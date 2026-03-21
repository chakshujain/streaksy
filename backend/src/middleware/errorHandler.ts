import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/AppError';
import { env } from '../config/env';
import { logger } from '../config/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  const log = (req as any).log || logger;
  log.error({ err }, 'Unhandled error');

  // Handle PostgreSQL foreign key violations — typically means the user was deleted
  const pgErr = err as { code?: string; constraint?: string; message?: string };
  if (pgErr.code === '23503') {
    // FK violation — user_id references a deleted user
    if (pgErr.constraint?.includes('user_id') || pgErr.constraint?.includes('created_by')) {
      res.status(401).json({
        error: 'Your account no longer exists. Please sign up again.',
        code: 'ACCOUNT_DELETED',
      });
      return;
    }
    res.status(400).json({
      error: 'Referenced record does not exist',
      code: 'FOREIGN_KEY_VIOLATION',
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}
