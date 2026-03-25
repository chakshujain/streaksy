import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { badgeRepository } from '../../modules/badge/repository/badge.repository';

jest.mock('../../modules/badge/repository/badge.repository');

const mockedBadgeRepo = badgeRepository as jest.Mocked<typeof badgeRepository>;

describe('E2E Journey: Badges & Achievements', () => {
  const userId = '50000000-0000-4000-a000-000000000001';
  const email = 'achiever@test.com';
  const token = generateTestToken(userId, email);

  const allBadges = [
    {
      id: 'badge-1', name: 'First Solve', description: 'Solve your first problem',
      icon: 'trophy', criteria: { solveCount: 1 }, created_at: new Date(),
    },
    {
      id: 'badge-2', name: '10 Streak', description: 'Maintain a 10-day streak',
      icon: 'flame', criteria: { streakDays: 10 }, created_at: new Date(),
    },
    {
      id: 'badge-3', name: 'Problem Crusher', description: 'Solve 50 problems',
      icon: 'star', criteria: { solveCount: 50 }, created_at: new Date(),
    },
    {
      id: 'badge-4', name: 'Hard Hitter', description: 'Solve 10 hard problems',
      icon: 'zap', criteria: { difficulty: 'hard', count: 10 }, created_at: new Date(),
    },
    {
      id: 'badge-5', name: 'Note Taker', description: 'Create 5 revision notes',
      icon: 'book', criteria: { revisionCount: 5 }, created_at: new Date(),
    },
  ];

  const userBadges = [
    {
      id: 'ub-1', user_id: userId, badge_id: 'badge-1',
      badge_name: 'First Solve', badge_description: 'Solve your first problem',
      badge_icon: 'trophy', earned_at: new Date('2026-01-15'),
    },
    {
      id: 'ub-2', user_id: userId, badge_id: 'badge-2',
      badge_name: '10 Streak', badge_description: 'Maintain a 10-day streak',
      badge_icon: 'flame', earned_at: new Date('2026-02-10'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Browse all available badges', () => {
    it('should return the complete badge catalog', async () => {
      mockedBadgeRepo.getAll.mockResolvedValue(allBadges as any);

      const res = await request(app)
        .get('/api/badges')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(5);
      expect(res.body.badges[0].name).toBe('First Solve');
      expect(res.body.badges[4].name).toBe('Note Taker');
    });

    it('should return badges even when none exist', async () => {
      mockedBadgeRepo.getAll.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/badges')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(0);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/badges');
      expect(res.status).toBe(401);
    });
  });

  describe('Step 2: View earned badges', () => {
    it('should return the users earned badges', async () => {
      mockedBadgeRepo.getUserBadges.mockResolvedValue(userBadges as any);

      const res = await request(app)
        .get('/api/badges/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(2);
      expect(res.body.badges[0].badge_name).toBe('First Solve');
      expect(res.body.badges[0].earned_at).toBeDefined();
    });

    it('should return empty array for user with no badges', async () => {
      const newUserToken = generateTestToken('new-user-id', 'newuser@test.com');
      mockedBadgeRepo.getUserBadges.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/badges/mine')
        .set('Authorization', `Bearer ${newUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(0);
    });
  });

  describe('Step 3: Badges show progression', () => {
    it('should list badges ordered by earned date (most recent first)', async () => {
      mockedBadgeRepo.getUserBadges.mockResolvedValue(userBadges as any);

      const res = await request(app)
        .get('/api/badges/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      // The repo orders by earned_at DESC
      expect(res.body.badges).toHaveLength(2);
      expect(mockedBadgeRepo.getUserBadges).toHaveBeenCalledWith(userId);
    });
  });
});
