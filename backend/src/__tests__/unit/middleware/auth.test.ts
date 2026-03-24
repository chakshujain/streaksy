import { authenticate } from '../../../middleware/auth';
import { AuthRequest } from '../../../common/types';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';
import { redis } from '../../../config/redis';

const mockedRedis = redis as jest.Mocked<typeof redis>;

function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}

describe('authenticate middleware', () => {
  let req: AuthRequest;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} } as AuthRequest;
    res = {} as Response;
    next = jest.fn();
    (mockedRedis.get as jest.Mock).mockResolvedValue(null);
  });

  it('should call next with unauthorized error when no authorization header', () => {
    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Missing or invalid authorization header' })
    );
  });

  it('should call next with unauthorized error when header does not start with Bearer', () => {
    req.headers.authorization = 'Basic abc123';

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Missing or invalid authorization header' })
    );
  });

  it('should call next with unauthorized error for invalid token', () => {
    req.headers.authorization = 'Bearer invalid-token-xyz';

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid or expired token' })
    );
  });

  it('should call next with unauthorized error for expired token', () => {
    const expiredToken = jwt.sign(
      { userId: 'u1', email: 'test@test.com' },
      env.jwt.secret,
      { expiresIn: '0s' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${expiredToken}`;

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid or expired token' })
    );
  });

  it('should call next with unauthorized error for token signed with wrong secret', () => {
    const token = jwt.sign(
      { userId: 'u1', email: 'test@test.com' },
      'wrong-secret',
      { expiresIn: '1h' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${token}`;

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid or expired token' })
    );
  });

  it('should set req.user and call next for valid token', async () => {
    const token = jwt.sign(
      { userId: 'user-123', email: 'valid@test.com' },
      env.jwt.secret,
      { expiresIn: '1h' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${token}`;

    authenticate(req, res, next);
    await flushPromises();

    expect(req.user).toBeDefined();
    expect(req.user!.userId).toBe('user-123');
    expect(req.user!.email).toBe('valid@test.com');
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with unauthorized error for blacklisted token', async () => {
    (mockedRedis.get as jest.Mock).mockResolvedValue('1');

    const token = jwt.sign(
      { userId: 'user-123', email: 'valid@test.com' },
      env.jwt.secret,
      { expiresIn: '1h' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${token}`;

    authenticate(req, res, next);
    await flushPromises();

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token has been revoked' })
    );
    expect(req.user).toBeUndefined();
  });

  it('should fail-open and set req.user when Redis is down', async () => {
    (mockedRedis.get as jest.Mock).mockRejectedValue(new Error('Redis connection refused'));

    const token = jwt.sign(
      { userId: 'user-456', email: 'redis-down@test.com' },
      env.jwt.secret,
      { expiresIn: '1h' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${token}`;

    authenticate(req, res, next);
    await flushPromises();

    expect(req.user).toBeDefined();
    expect(req.user!.userId).toBe('user-456');
    expect(req.user!.email).toBe('redis-down@test.com');
    expect(next).toHaveBeenCalledWith();
  });
});
