import { authenticate } from '../../../middleware/auth';
import { AuthRequest } from '../../../common/types';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';

describe('authenticate middleware', () => {
  let req: AuthRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} } as AuthRequest;
    res = {} as Response;
    next = jest.fn();
  });

  it('should throw unauthorized when no authorization header', () => {
    expect(() => authenticate(req, res, next)).toThrow(AppError);
    expect(() => authenticate(req, res, next)).toThrow('Missing or invalid authorization header');
  });

  it('should throw unauthorized when header does not start with Bearer', () => {
    req.headers.authorization = 'Basic abc123';
    expect(() => authenticate(req, res, next)).toThrow('Missing or invalid authorization header');
  });

  it('should throw unauthorized for invalid token', () => {
    req.headers.authorization = 'Bearer invalid-token-xyz';
    expect(() => authenticate(req, res, next)).toThrow('Invalid or expired token');
  });

  it('should throw unauthorized for expired token', () => {
    const expiredToken = jwt.sign(
      { userId: 'u1', email: 'test@test.com' },
      env.jwt.secret,
      { expiresIn: '0s' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${expiredToken}`;
    expect(() => authenticate(req, res, next)).toThrow('Invalid or expired token');
  });

  it('should set req.user and call next for valid token', () => {
    const token = jwt.sign(
      { userId: 'user-123', email: 'valid@test.com' },
      env.jwt.secret,
      { expiresIn: '1h' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${token}`;

    authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user!.userId).toBe('user-123');
    expect(req.user!.email).toBe('valid@test.com');
    expect(next).toHaveBeenCalled();
  });

  it('should throw for token signed with wrong secret', () => {
    const token = jwt.sign(
      { userId: 'u1', email: 'test@test.com' },
      'wrong-secret',
      { expiresIn: '1h' } as jwt.SignOptions
    );
    req.headers.authorization = `Bearer ${token}`;
    expect(() => authenticate(req, res, next)).toThrow('Invalid or expired token');
  });
});
