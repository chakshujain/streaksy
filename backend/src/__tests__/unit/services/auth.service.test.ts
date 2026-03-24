import { authService } from '../../../modules/auth/service/auth.service';
import { authRepository } from '../../../modules/auth/repository/auth.repository';
import { AppError } from '../../../common/errors/AppError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../../config/env';

// Mock the repository
jest.mock('../../../modules/auth/repository/auth.repository');
const mockedRepo = authRepository as jest.Mocked<typeof authRepository>;

// Mock email sending
jest.mock('../../../config/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

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
    oauth_provider: null as string | null,
    oauth_id: null as string | null,
    google_refresh_token: null as string | null,
    google_calendar_connected: false,
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

    it('should block OAuth user with no password from logging in with password', async () => {
      const oauthUser = {
        ...userRow,
        password_hash: '',
        oauth_provider: 'google',
        oauth_id: 'google-123',
      };
      mockedRepo.findByEmail.mockResolvedValue(oauthUser);

      await expect(
        authService.login('test@example.com', 'anypassword')
      ).rejects.toThrow('This account uses Google/GitHub login');

      await expect(
        authService.login('test@example.com', 'anypassword')
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('should block login when password_hash is null', async () => {
      const oauthUser = {
        ...userRow,
        password_hash: null as any,
        oauth_provider: 'github',
        oauth_id: 'github-456',
      };
      mockedRepo.findByEmail.mockResolvedValue(oauthUser);

      await expect(
        authService.login('test@example.com', 'anypassword')
      ).rejects.toThrow('This account uses Google/GitHub login');
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

  describe('getProfile', () => {
    it('should return the user profile for a valid userId', async () => {
      const profileUser = {
        ...userRow,
        bio: 'Hello world',
        location: 'NYC',
        github_url: 'https://github.com/testuser',
        linkedin_url: 'https://linkedin.com/in/testuser',
        leetcode_username: 'lc_user',
        email_verified: true,
        avatar_url: '/uploads/avatars/test.png',
        google_calendar_connected: true,
      };
      mockedRepo.findById.mockResolvedValue(profileUser);

      const result = await authService.getProfile('user-uuid-1');

      expect(mockedRepo.findById).toHaveBeenCalledWith('user-uuid-1');
      expect(result).toEqual({
        id: 'user-uuid-1',
        email: 'test@example.com',
        displayName: 'Test User',
        leetcodeUsername: 'lc_user',
        emailVerified: true,
        avatarUrl: '/uploads/avatars/test.png',
        bio: 'Hello world',
        location: 'NYC',
        githubUrl: 'https://github.com/testuser',
        linkedinUrl: 'https://linkedin.com/in/testuser',
        googleCalendarConnected: true,
      });
    });

    it('should throw notFound when user does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(
        authService.getProfile('nonexistent')
      ).rejects.toThrow('User not found');

      await expect(
        authService.getProfile('nonexistent')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should default emailVerified to false when null', async () => {
      mockedRepo.findById.mockResolvedValue({ ...userRow, email_verified: null as any });

      const result = await authService.getProfile('user-uuid-1');

      expect(result.emailVerified).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update and return the profile', async () => {
      const updatedUser = {
        ...userRow,
        bio: 'Updated bio',
        location: 'San Francisco',
        github_url: 'https://github.com/updated',
        linkedin_url: 'https://linkedin.com/in/updated',
      };
      mockedRepo.updateProfile.mockResolvedValue(updatedUser);

      const data = {
        bio: 'Updated bio',
        location: 'San Francisco',
        githubUrl: 'https://github.com/updated',
        linkedinUrl: 'https://linkedin.com/in/updated',
      };
      const result = await authService.updateProfile('user-uuid-1', data);

      expect(mockedRepo.updateProfile).toHaveBeenCalledWith('user-uuid-1', data);
      expect(result).toEqual({
        id: 'user-uuid-1',
        email: 'test@example.com',
        displayName: 'Test User',
        avatarUrl: null,
        bio: 'Updated bio',
        location: 'San Francisco',
        githubUrl: 'https://github.com/updated',
        linkedinUrl: 'https://linkedin.com/in/updated',
      });
    });

    it('should handle partial updates', async () => {
      const updatedUser = { ...userRow, bio: 'Just a bio' };
      mockedRepo.updateProfile.mockResolvedValue(updatedUser);

      const data = { bio: 'Just a bio' };
      const result = await authService.updateProfile('user-uuid-1', data);

      expect(mockedRepo.updateProfile).toHaveBeenCalledWith('user-uuid-1', data);
      expect(result.bio).toBe('Just a bio');
      expect(result.location).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should create a reset token and send email for existing user', async () => {
      mockedRepo.findByEmail.mockResolvedValue(userRow);
      mockedRepo.createPasswordResetToken.mockResolvedValue();

      await authService.forgotPassword('test@example.com');

      expect(mockedRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedRepo.createPasswordResetToken).toHaveBeenCalledWith(
        'user-uuid-1',
        expect.any(String), // token hash
        expect.any(Date)    // expires at
      );
    });

    it('should silently return when user does not exist (prevent email enumeration)', async () => {
      mockedRepo.findByEmail.mockResolvedValue(null);

      // Should not throw
      await authService.forgotPassword('nonexistent@example.com');

      expect(mockedRepo.createPasswordResetToken).not.toHaveBeenCalled();
    });

    it('should store a SHA-256 hash of the token, not the raw token', async () => {
      mockedRepo.findByEmail.mockResolvedValue(userRow);
      mockedRepo.createPasswordResetToken.mockResolvedValue();

      await authService.forgotPassword('test@example.com');

      const storedHash = mockedRepo.createPasswordResetToken.mock.calls[0][1];
      // SHA-256 hex is 64 characters
      expect(storedHash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should set expiry to approximately 1 hour from now', async () => {
      mockedRepo.findByEmail.mockResolvedValue(userRow);
      mockedRepo.createPasswordResetToken.mockResolvedValue();

      const before = Date.now();
      await authService.forgotPassword('test@example.com');
      const after = Date.now();

      const expiresAt = mockedRepo.createPasswordResetToken.mock.calls[0][2] as Date;
      const oneHourMs = 60 * 60 * 1000;
      expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + oneHourMs - 1000);
      expect(expiresAt.getTime()).toBeLessThanOrEqual(after + oneHourMs + 1000);
    });
  });

  describe('resetPassword', () => {
    it('should reset the password when token is valid', async () => {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      const resetRow = {
        id: 'reset-uuid-1',
        user_id: 'user-uuid-1',
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 3600000),
        used_at: null,
      };

      mockedRepo.findValidResetToken.mockResolvedValue(resetRow);
      mockedRepo.updatePassword.mockResolvedValue();
      mockedRepo.markResetTokenUsed.mockResolvedValue();

      await authService.resetPassword(rawToken, 'newpassword123');

      // Should hash the token before lookup
      expect(mockedRepo.findValidResetToken).toHaveBeenCalledWith(tokenHash);
      // Should update password with a bcrypt hash
      expect(mockedRepo.updatePassword).toHaveBeenCalledWith('user-uuid-1', expect.any(String));
      const newHash = mockedRepo.updatePassword.mock.calls[0][1];
      expect(await bcrypt.compare('newpassword123', newHash)).toBe(true);
      // Should mark the token as used
      expect(mockedRepo.markResetTokenUsed).toHaveBeenCalledWith('reset-uuid-1');
    });

    it('should throw badRequest when token is invalid or expired', async () => {
      mockedRepo.findValidResetToken.mockResolvedValue(null);

      await expect(
        authService.resetPassword('invalid-token', 'newpassword')
      ).rejects.toThrow('Invalid or expired reset token');

      await expect(
        authService.resetPassword('invalid-token', 'newpassword')
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('changePassword', () => {
    it('should change password when current password is correct', async () => {
      const currentHash = await bcrypt.hash('oldpassword', 12);
      mockedRepo.findById.mockResolvedValue({ ...userRow, password_hash: currentHash });
      mockedRepo.updatePassword.mockResolvedValue();

      await authService.changePassword('user-uuid-1', 'oldpassword', 'newpassword');

      expect(mockedRepo.findById).toHaveBeenCalledWith('user-uuid-1');
      expect(mockedRepo.updatePassword).toHaveBeenCalledWith('user-uuid-1', expect.any(String));
      const newHash = mockedRepo.updatePassword.mock.calls[0][1];
      expect(await bcrypt.compare('newpassword', newHash)).toBe(true);
    });

    it('should throw notFound when user does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(
        authService.changePassword('nonexistent', 'old', 'new')
      ).rejects.toThrow('User not found');

      await expect(
        authService.changePassword('nonexistent', 'old', 'new')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw badRequest for OAuth accounts without password', async () => {
      mockedRepo.findById.mockResolvedValue({
        ...userRow,
        password_hash: '' as any,
        oauth_provider: 'google',
      });

      await expect(
        authService.changePassword('user-uuid-1', 'old', 'new')
      ).rejects.toThrow('OAuth accounts cannot change password');

      await expect(
        authService.changePassword('user-uuid-1', 'old', 'new')
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw unauthorized when current password is wrong', async () => {
      const currentHash = await bcrypt.hash('correctpassword', 12);
      mockedRepo.findById.mockResolvedValue({ ...userRow, password_hash: currentHash });

      await expect(
        authService.changePassword('user-uuid-1', 'wrongpassword', 'newpassword')
      ).rejects.toThrow('Current password is incorrect');

      await expect(
        authService.changePassword('user-uuid-1', 'wrongpassword', 'newpassword')
      ).rejects.toMatchObject({ statusCode: 401 });
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
