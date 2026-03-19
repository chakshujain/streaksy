import { signupSchema, loginSchema, connectLeetcodeSchema } from '../../../modules/auth/validation/auth.schema';

describe('auth validation schemas', () => {
  describe('signupSchema', () => {
    it('should accept valid signup data', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        displayName: 'John Doe',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = signupSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
        displayName: 'John',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password (< 8 chars)', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'short',
        displayName: 'John',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password exceeding 128 chars', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'a'.repeat(129),
        displayName: 'John',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty displayName', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        displayName: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject displayName exceeding 100 chars', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        displayName: 'A'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = signupSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'anypassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'bad',
        password: 'password',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('connectLeetcodeSchema', () => {
    it('should accept valid leetcode username', () => {
      const result = connectLeetcodeSchema.safeParse({
        leetcodeUsername: 'coder123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty username', () => {
      const result = connectLeetcodeSchema.safeParse({
        leetcodeUsername: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject username exceeding 100 chars', () => {
      const result = connectLeetcodeSchema.safeParse({
        leetcodeUsername: 'x'.repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });
});
