import request from 'supertest';
import app from '../../app';
import { generateTestToken, mockUserRow } from '../helpers';
import { authRepository } from '../../modules/auth/repository/auth.repository';
import { preferencesRepository } from '../../modules/preferences/repository/preferences.repository';
import { streakRepository } from '../../modules/streak/repository/streak.repository';
import { progressRepository } from '../../modules/progress/repository/progress.repository';
import { revisionRepository } from '../../modules/revision/repository/revision.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/auth/repository/auth.repository');
jest.mock('../../modules/preferences/repository/preferences.repository');
jest.mock('../../modules/streak/repository/streak.repository');
jest.mock('../../modules/progress/repository/progress.repository');
jest.mock('../../modules/revision/repository/revision.repository');
jest.mock('../../config/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>;
const mockedPrefsRepo = preferencesRepository as jest.Mocked<typeof preferencesRepository>;
const mockedStreakRepo = streakRepository as jest.Mocked<typeof streakRepository>;
const mockedProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;
const mockedRevisionRepo = revisionRepository as jest.Mocked<typeof revisionRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Profile & Account Management', () => {
  const userId = 'user-profile';
  const email = 'profile@test.com';
  const token = generateTestToken(userId, email);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: View and update profile', () => {
    it('should retrieve the user profile', async () => {
      mockedAuthRepo.findById.mockResolvedValue(
        mockUserRow({
          id: userId,
          email,
          display_name: 'Profile User',
          bio: null,
          location: null,
          github_url: null,
          linkedin_url: null,
          avatar_url: null,
        })
      );

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.displayName).toBe('Profile User');
    });

    it('should update profile with bio, location, and social links', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUserRow({ id: userId, email }));
      mockedAuthRepo.updateProfile.mockResolvedValue(
        mockUserRow({
          id: userId,
          email,
          display_name: 'Updated Name',
          bio: 'Full-stack dev who loves DSA',
          location: 'San Francisco, CA',
          github_url: 'https://github.com/profileuser',
          linkedin_url: 'https://linkedin.com/in/profileuser',
        })
      );

      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          displayName: 'Updated Name',
          bio: 'Full-stack dev who loves DSA',
          location: 'San Francisco, CA',
          githubUrl: 'https://github.com/profileuser',
          linkedinUrl: 'https://linkedin.com/in/profileuser',
        });

      expect(res.status).toBe(200);
      expect(res.body.user.displayName).toBe('Updated Name');
      expect(res.body.user.bio).toBe('Full-stack dev who loves DSA');
    });

    it('should reject profile update with invalid data', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          displayName: '', // too short
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 2: Connect LeetCode account', () => {
    it('should connect a LeetCode username', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUserRow({ id: userId, email }));
      mockedAuthRepo.connectLeetcode.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/connect-leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ leetcodeUsername: 'leetcode_pro' });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 3: Change password', () => {
    it('should change the password successfully', async () => {
      mockedAuthRepo.findById.mockResolvedValue(
        mockUserRow({ id: userId, email, email_verified: true })
      );
      mockedAuthRepo.updatePassword.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'OldPass123!', newPassword: 'NewSecure456!' });

      expect(res.status).toBe(200);
    });

    it('should reject weak new password', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'OldPass123!', newPassword: 'short' });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 4: Password reset flow', () => {
    it('should send a forgot password email', async () => {
      mockedAuthRepo.findByEmail.mockResolvedValue(
        mockUserRow({ id: userId, email, email_verified: true })
      );
      mockedAuthRepo.createPasswordResetToken.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email });

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
    });

    it('should reset password with valid token', async () => {
      mockedAuthRepo.findValidResetToken.mockResolvedValue(
        mockUserRow({ id: userId, email })
      );
      mockedAuthRepo.updatePassword.mockResolvedValue();
      mockedAuthRepo.markResetTokenUsed.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'valid-reset-token', password: 'BrandNew789!' });

      expect(res.status).toBe(200);
    });

    it('should reject reset with invalid token', async () => {
      mockedAuthRepo.findValidResetToken.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'invalid-token', password: 'BrandNew789!' });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 5: View public user profile', () => {
    it('should retrieve another user public profile', async () => {
      const otherUserId = 'other-user-id';
      mockedAuthRepo.findById.mockResolvedValue(
        mockUserRow({
          id: otherUserId,
          email: 'other@test.com',
          display_name: 'Other User',
          bio: 'Loves coding',
          avatar_url: 'https://example.com/avatar.jpg',
        })
      );
      mockedQuery.mockResolvedValue([]); // badges, activity, etc.

      const res = await request(app)
        .get(`/api/auth/user/${otherUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.displayName).toBe('Other User');
    });
  });

  describe('Step 6: Configure user preferences', () => {
    it('should set dark theme with custom accent', async () => {
      mockedPrefsRepo.upsert.mockResolvedValue({
        user_id: userId,
        theme: 'dark',
        accent_color: '#8b5cf6',
        dashboard_layout: 'default',
        show_streak_animation: true,
        show_heatmap: true,
        weekly_goal: 7,
        updated_at: new Date(),
      });

      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ theme: 'dark', accent_color: '#8b5cf6', weekly_goal: 7 });

      expect(res.status).toBe(200);
      expect(res.body.preferences.theme).toBe('dark');
      expect(res.body.preferences.accent_color).toBe('#8b5cf6');
      expect(res.body.preferences.weekly_goal).toBe(7);
    });

    it('should reject invalid accent color format', async () => {
      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ accent_color: 'not-a-hex' });

      expect(res.status).toBe(400);
    });

    it('should toggle heatmap and streak animation off', async () => {
      mockedPrefsRepo.upsert.mockResolvedValue({
        user_id: userId,
        theme: 'dark',
        accent_color: '#8b5cf6',
        dashboard_layout: 'default',
        show_streak_animation: false,
        show_heatmap: false,
        weekly_goal: 7,
        updated_at: new Date(),
      });

      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ show_streak_animation: false, show_heatmap: false });

      expect(res.status).toBe(200);
      expect(res.body.preferences.show_streak_animation).toBe(false);
      expect(res.body.preferences.show_heatmap).toBe(false);
    });
  });

  describe('Step 7: Export user data', () => {
    it('should export complete user data as JSON', async () => {
      mockedAuthRepo.findById.mockResolvedValue(
        mockUserRow({ id: userId, email, display_name: 'Profile User' })
      );
      mockedStreakRepo.get.mockResolvedValue({
        user_id: userId,
        current_streak: 5,
        longest_streak: 12,
        last_solve_date: '2026-03-22',
      });
      mockedProgressRepo.getUserProgress.mockResolvedValue([
        { user_id: userId, problem_id: 'prob-1', status: 'solved', solved_at: new Date(), updated_at: new Date() },
      ]);
      mockedQuery.mockResolvedValue([]); // submissions
      mockedRevisionRepo.getForUser.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/auth/export')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.profile).toBeDefined();
      expect(res.body.streak).toBeDefined();
      expect(res.body.progress).toBeDefined();
    });
  });

  describe('Step 8: Unauthenticated access denied', () => {
    it('should deny profile access without token', async () => {
      const res = await request(app).get('/api/auth/profile');

      expect(res.status).toBe(401);
    });

    it('should deny preference updates without token', async () => {
      const res = await request(app)
        .put('/api/preferences')
        .send({ theme: 'dark' });

      expect(res.status).toBe(401);
    });

    it('should deny data export without token', async () => {
      const res = await request(app).get('/api/auth/export');

      expect(res.status).toBe(401);
    });
  });
});
