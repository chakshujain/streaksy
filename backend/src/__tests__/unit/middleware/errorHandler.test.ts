import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../common/errors/AppError';
import { logger } from '../../../config/logger';

// Must declare before jest.mock so the hoisted factory can reference it
let mockNodeEnv = 'test';
jest.mock('../../../config/env', () => ({
  get env() {
    return { nodeEnv: mockNodeEnv };
  },
}));

// Import after mock setup
import { errorHandler } from '../../../middleware/errorHandler';

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
    mockNodeEnv = 'test';
  });

  it('should handle AppError with correct status code and message', () => {
    const err = AppError.badRequest('Invalid field', 'INVALID_FIELD');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Invalid field',
      message: 'Invalid field',
      code: 'INVALID_FIELD',
    });
  });

  it('should handle AppError.notFound', () => {
    const err = AppError.notFound('Resource missing');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Resource missing',
      message: 'Resource missing',
      code: 'NOT_FOUND',
    });
  });

  it('should handle AppError.unauthorized', () => {
    const err = AppError.unauthorized('Token expired');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Token expired',
      message: 'Token expired',
      code: 'UNAUTHORIZED',
    });
  });

  it('should handle AppError.conflict', () => {
    const err = AppError.conflict('Already exists');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Already exists',
      message: 'Already exists',
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

  it('should handle PostgreSQL FK violation with user_id constraint as 401', () => {
    const err = Object.assign(new Error('insert or update on table violates foreign key constraint'), {
      code: '23503',
      constraint: 'some_table_user_id_fkey',
    });

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Your account no longer exists. Please sign up again.',
      code: 'ACCOUNT_DELETED',
    });
  });

  it('should handle PostgreSQL FK violation with created_by constraint as 401', () => {
    const err = Object.assign(new Error('insert or update on table violates foreign key constraint'), {
      code: '23503',
      constraint: 'posts_created_by_fkey',
    });

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Your account no longer exists. Please sign up again.',
      code: 'ACCOUNT_DELETED',
    });
  });

  it('should handle PostgreSQL FK violation without user_id constraint as 400', () => {
    const err = Object.assign(new Error('insert or update on table violates foreign key constraint'), {
      code: '23503',
      constraint: 'posts_group_id_fkey',
    });

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Referenced record does not exist',
      code: 'FOREIGN_KEY_VIOLATION',
    });
  });

  it('should include stack trace in development mode', () => {
    mockNodeEnv = 'development';
    const err = new Error('Something broke');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Internal server error',
        stack: expect.any(String),
      })
    );
  });

  it('should not include stack trace in production mode', () => {
    mockNodeEnv = 'production';
    const err = new Error('Something broke');

    errorHandler(err, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
