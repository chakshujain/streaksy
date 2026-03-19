import { authService } from '../../../modules/auth/service/auth.service';
import { authRepository } from '../../../modules/auth/repository/auth.repository';
import { AppError } from '../../../common/errors/AppError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';

// Mock the repository
jest.mock('../../../modules/auth/repository/auth.repository');
const mockedRepo = authRepository as jest.Mocked<typeof authRepository>;

describe('authService', () => {
  const userRow = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    password_hash: '',
    display_name: 'Test User',
    leetcode_username: null,
    email_verified: false,
    email_verification_token: null,
    email_verification_expires: null,
    avatar_url: null,
    bio: null,
    location: null,
    github_url: null,
    linkedin_url: null,
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return user + token', async () => {
      mockedRepo.findByEmail.mockResolvedValue(null);
      mockedRepo.create.mockResolvedValue(userRow);

      const result = await authService.signup('test@example.com', 'password123', 'Test User');

      expect(mockedRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedRepo.create).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String), // bcrypt hash
        'Test User'
      );
      expect(result.user.id).toBe('user-uuid-1');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.displayName).toBe('Test User');
      expect(result.token).toBeDefined();

      // Verify the token is valid
      const decoded = jwt.verify(result.token, env.jwt.secret) as any;
      expect(decoded.userId).toBe('user-uuid-1');
      expect(decoded.email).toBe('test@example.com');
    });

    it('should throw conflict when email already exists', async () => {
      mockedRepo.findByEmail.mockResolvedValue(userRow);

      await expect(
        authService.signup('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow(AppError);

      await expect(
        authService.signup('test@example.com', 'password123', 'Test User')
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('should hash the password with bcrypt', async () => {
      mockedRepo.findByEmail.mockResolvedValue(null);
      mockedRepo.create.mockResolvedValue(userRow);

      await authService.signup('test@example.com', 'password123', 'Test User');

      const hashArg = mockedRepo.create.mock.calls[0][1];
      // Verify it's a valid bcrypt hash
      expect(hashArg).toMatch(/^\$2[aby]\$/);
      // Verify the hash matches the original password
      expect(await bcrypt.compare('password123', hashArg)).toBe(true);
    });
  });

  describe('login', () => {
    it('should return user + token for valid credentials', async () => {
      const hash = await bcrypt.hash('correctpassword', 12);
      mockedRepo.findByEmail.mockResolvedValue({ ...userRow, password_hash: hash });

      const result = await authService.login('test@example.com', 'correctpassword');

      expect(result.user.id).toBe('user-uuid-1');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.displayName).toBe('Test User');
      expect(result.token).toBeDefined();
    });

    it('should throw unauthorized when user not found', async () => {
      mockedRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('nonexistent@example.com', 'password')
      ).rejects.toThrow('Invalid credentials');

      await expect(
        authService.login('nonexistent@example.com', 'password')
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw unauthorized for wrong password', async () => {
      const hash = await bcrypt.hash('correctpassword', 12);
      mockedRepo.findByEmail.mockResolvedValue({ ...userRow, password_hash: hash });

      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('connectLeetcode', () => {
    it('should connect leetcode username for existing user', async () => {
      mockedRepo.findById.mockResolvedValue(userRow);
      mockedRepo.connectLeetcode.mockResolvedValue();

      await authService.connectLeetcode('user-uuid-1', 'leetcodeuser');

      expect(mockedRepo.connectLeetcode).toHaveBeenCalledWith('user-uuid-1', 'leetcodeuser');
    });

    it('should throw notFound when user does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(
        authService.connectLeetcode('nonexistent', 'leetcodeuser')
      ).rejects.toThrow('User not found');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = authService.generateToken('user-1', 'user@test.com');
      const decoded = jwt.verify(token, env.jwt.secret) as any;

      expect(decoded.userId).toBe('user-1');
      expect(decoded.email).toBe('user@test.com');
      expect(decoded.exp).toBeDefined();
    });
  });
});
