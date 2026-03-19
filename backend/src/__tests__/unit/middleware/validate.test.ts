import { validate } from '../../../middleware/validate';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

describe('validate middleware', () => {
  let req: Partial<Request>;
  let res: Response;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = { status: statusMock, json: jsonMock } as unknown as Response;
    next = jest.fn();
  });

  it('should call next() when body is valid', () => {
    req.body = { email: 'test@example.com', password: 'longpassword' };

    validate(schema)(req as Request, res, next);

    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should set parsed data back on req.body', () => {
    req.body = { email: 'test@example.com', password: 'longpassword' };

    validate(schema)(req as Request, res, next);

    expect(req.body).toEqual({ email: 'test@example.com', password: 'longpassword' });
  });

  it('should return 400 when body is invalid', () => {
    req.body = { email: 'not-an-email', password: 'short' };

    validate(schema)(req as Request, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Array),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 when required fields are missing', () => {
    req.body = {};

    validate(schema)(req as Request, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should validate params source', () => {
    const paramSchema = z.object({ id: z.string().uuid() });
    req.params = { id: 'not-a-uuid' } as any;

    validate(paramSchema, 'params')(req as Request, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should validate query source', () => {
    const querySchema = z.object({ page: z.string() });
    req.query = { page: '1' } as any;

    validate(querySchema, 'query')(req as Request, res, next);

    expect(next).toHaveBeenCalled();
  });
});
