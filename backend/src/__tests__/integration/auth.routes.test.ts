import request from 'supertest';
import app from '../../app';
import { authRepository } from '../../modules/auth/repository/auth.repository';
import bcrypt from 'bcryptjs';
import { generateTestToken } from '../helpers';

// Mock the auth repository
jest.mock('../../modules/auth/repository/auth.repository');
const mockedRepo = authRepository as jest.Mocked<typeof authRepository>;

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    const validSignup = {
      email: 'newuser@example.com',
      password: 'securepassword',
      displayName: 'New User',
    };

    it('should create a new user and return 201 with token', async () => {
      mockedRepo.findByEmail.mockResolvedValue(null);
      mockedRepo.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'newuser@example.com',
        password_hash: 'hashed',
        display_name: 'New User',
        leetcode_username: null, email_verified: false, email_verification_token: null, email_verification_expires: null, avatar_url: null, bio: null, location: null, github_url: null, linkedin_url: null,
        created_at: new Date(),
      } as any);

      const res = await request(app).post('/api/auth/signup').send(validSignup);

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('newuser@example.com');
      expect(res.body.user.displayName).toBe('New User');
      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe('string');
    });

    it('should return 409 when email already registered', async () => {
      mockedRepo.findByEmail.mockResolvedValue({
        id: 'existing',
        email: 'newuser@example.com',
        password_hash: 'hash',
        display_name: 'Existing',
        leetcode_username: null, email_verified: false, email_verification_token: null, email_verification_expires: null, avatar_url: null, bio: null, location: null, github_url: null, linkedin_url: null,
        created_at: new Date(),
      } as any);

      const res = await request(app).post('/api/auth/signup').send(validSignup);

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Email already registered');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'bad', password: 'password123', displayName: 'User' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should return 400 for short password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'user@test.com', password: 'short', displayName: 'User' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app).post('/api/auth/signup').send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return token for valid credentials', async () => {
      const hash = await bcrypt.hash('correctpassword', 12);
      mockedRepo.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        password_hash: hash,
        display_name: 'Test User',
        leetcode_username: null, email_verified: false, email_verification_token: null, email_verification_expires: null, avatar_url: null, bio: null, location: null, github_url: null, linkedin_url: null,
        created_at: new Date(),
      } as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com', password: 'correctpassword' });

      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe('user-1');
      expect(res.body.token).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
      const hash = await bcrypt.hash('correctpassword', 12);
      mockedRepo.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        password_hash: hash,
        display_name: 'Test User',
        leetcode_username: null, email_verified: false, email_verification_token: null, email_verification_expires: null, avatar_url: null, bio: null, location: null, github_url: null, linkedin_url: null,
        created_at: new Date(),
      } as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return 401 for nonexistent user', async () => {
      mockedRepo.findByEmail.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'noone@test.com', password: 'password' });

      expect(res.status).toBe(401);
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/connect-leetcode', () => {
    it('should connect leetcode for authenticated user', async () => {
      const token = generateTestToken('user-1', 'user@test.com');
      mockedRepo.findById.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        password_hash: 'hash',
        display_name: 'User',
        leetcode_username: null, email_verified: false, email_verification_token: null, email_verification_expires: null, avatar_url: null, bio: null, location: null, github_url: null, linkedin_url: null,
        created_at: new Date(),
      } as any);
      mockedRepo.connectLeetcode.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/connect-leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ leetcodeUsername: 'myLeetcodeUser' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('LeetCode account connected');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/auth/connect-leetcode')
        .send({ leetcodeUsername: 'myUser' });

      expect(res.status).toBe(401);
    });

    it('should return 404 when user not found', async () => {
      const token = generateTestToken('nonexistent', 'user@test.com');
      mockedRepo.findById.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/connect-leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ leetcodeUsername: 'myUser' });

      expect(res.status).toBe(404);
    });
  });
});
