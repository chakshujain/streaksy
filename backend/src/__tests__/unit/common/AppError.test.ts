import { AppError } from '../../../common/errors/AppError';

describe('AppError', () => {
  it('should create an error with statusCode and message', () => {
    const err = new AppError(400, 'Bad request', 'BAD_REQUEST');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
    expect(err.code).toBe('BAD_REQUEST');
    expect(err.name).toBe('AppError');
  });

  it('should create error without code', () => {
    const err = new AppError(500, 'Server error');
    expect(err.code).toBeUndefined();
    expect(err.statusCode).toBe(500);
  });

  describe('static factories', () => {
    it('badRequest creates 400 error', () => {
      const err = AppError.badRequest('Invalid input', 'INVALID');
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Invalid input');
      expect(err.code).toBe('INVALID');
    });

    it('badRequest without code', () => {
      const err = AppError.badRequest('Invalid');
      expect(err.code).toBeUndefined();
    });

    it('unauthorized creates 401 error with default message', () => {
      const err = AppError.unauthorized();
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Unauthorized');
      expect(err.code).toBe('UNAUTHORIZED');
    });

    it('unauthorized creates 401 error with custom message', () => {
      const err = AppError.unauthorized('Token expired');
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Token expired');
    });

    it('forbidden creates 403 error', () => {
      const err = AppError.forbidden();
      expect(err.statusCode).toBe(403);
      expect(err.message).toBe('Forbidden');
      expect(err.code).toBe('FORBIDDEN');
    });

    it('forbidden with custom message', () => {
      const err = AppError.forbidden('Access denied');
      expect(err.message).toBe('Access denied');
    });

    it('notFound creates 404 error', () => {
      const err = AppError.notFound();
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Not found');
      expect(err.code).toBe('NOT_FOUND');
    });

    it('notFound with custom message', () => {
      const err = AppError.notFound('User not found');
      expect(err.message).toBe('User not found');
    });

    it('conflict creates 409 error', () => {
      const err = AppError.conflict('Already exists');
      expect(err.statusCode).toBe(409);
      expect(err.message).toBe('Already exists');
      expect(err.code).toBe('CONFLICT');
    });
  });
});
