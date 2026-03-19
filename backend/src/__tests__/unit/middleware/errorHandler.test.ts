import { errorHandler } from '../../../middleware/errorHandler';
import { AppError } from '../../../common/errors/AppError';
import { logger } from '../../../config/logger';
import { Request, Response, NextFunction } from 'express';

describe('errorHandler middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {} as Request;
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = { status: statusMock, json: jsonMock } as unknown as Response;
    next = jest.fn();
  });

  it('should handle AppError with correct status code and message', () => {
    const err = AppError.badRequest('Invalid field', 'INVALID_FIELD');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Invalid field',
      code: 'INVALID_FIELD',
    });
  });

  it('should handle AppError.notFound', () => {
    const err = AppError.notFound('Resource missing');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Resource missing',
      code: 'NOT_FOUND',
    });
  });

  it('should handle AppError.unauthorized', () => {
    const err = AppError.unauthorized('Token expired');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Token expired',
      code: 'UNAUTHORIZED',
    });
  });

  it('should handle AppError.conflict', () => {
    const err = AppError.conflict('Already exists');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Already exists',
      code: 'CONFLICT',
    });
  });

  it('should handle unknown errors with 500 and generic message', () => {
    const err = new Error('Database connection lost');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Internal server error' })
    );
  });

  it('should log unknown errors via logger', () => {
    const err = new Error('Unexpected failure');

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalled();
  });
});
