import { asyncHandler } from '../../../common/utils/asyncHandler';
import { Request, Response, NextFunction } from 'express';

describe('asyncHandler', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
    next = jest.fn();
  });

  it('should call the handler and resolve without error', async () => {
    const handler = asyncHandler(async (_req, res, _next) => {
      res.json({ ok: true });
    });

    await handler(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('should catch errors and forward to next()', async () => {
    const error = new Error('Something went wrong');
    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should catch async rejection and forward to next()', async () => {
    const handler = asyncHandler(async () => {
      return Promise.reject(new Error('Async fail'));
    });

    // asyncHandler wraps in Promise.resolve().catch(next), need to wait a tick
    handler(req, res, next);
    await new Promise((r) => setTimeout(r, 10));

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
