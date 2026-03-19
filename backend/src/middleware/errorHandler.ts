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
  res.status(500).json({
    error: 'Internal server error',
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}
