import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * Generate a valid JWT token for testing authenticated routes.
 */
export function generateTestToken(userId = 'test-user-id', email = 'test@example.com'): string {
  return jwt.sign({ userId, email }, env.jwt.secret, { expiresIn: '1h' } as jwt.SignOptions);
}

/**
 * Standard test user data.
 */
export const testUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  password: 'password123',
  displayName: 'Test User',
  passwordHash: '$2b$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', // placeholder
};

/** Full UserRow shape for mocks (includes all new columns). */
export function mockUserRow(overrides?: Partial<Record<string, unknown>>) {
  return {
    id: testUser.id,
    email: testUser.email,
    password_hash: testUser.passwordHash,
    display_name: testUser.displayName,
    leetcode_username: null,
    email_verified: false,
    email_verification_token: null,
    email_verification_expires: null,
    avatar_url: null,
    bio: null,
    location: null,
    github_url: null,
    linkedin_url: null,
    created_at: new Date('2024-01-01'),
    ...overrides,
  };
}

export const testProblem = {
  id: 'prob-uuid-1',
  title: 'Two Sum',
  slug: 'two-sum',
  difficulty: 'easy',
  url: 'https://leetcode.com/problems/two-sum/',
  created_at: new Date('2024-01-01'),
};

export const testGroup = {
  id: 'group-uuid-1',
  name: 'DSA Study Group',
  description: 'A test group',
  invite_code: 'abc123def456',
  created_by: 'test-user-id',
  created_at: new Date('2024-01-01'),
  plan: null,
  objective: null,
  target_date: null,
};
