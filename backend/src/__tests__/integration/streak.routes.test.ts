import request from 'supertest';
import app from '../../app';
import { streakRepository } from '../../modules/streak/repository/streak.repository';
import { redis } from '../../config/redis';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/streak/repository/streak.repository');
jest.mock('../../config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
  connectRedis: jest.fn(),
}));

const mockedRepo = streakRepository as jest.Mocked<typeof streakRepository>;
const mockedRedis = redis as jest.Mocked<typeof redis>;

describe('Streak Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/streaks', () => {
    it('should return streak from cache', async () => {
      mockedRedis.get.mockResolvedValue(
        JSON.stringify({ currentStreak: 5, longestStreak: 10 })
      );

      const res = await request(app)
        .get('/api/streaks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.streak.currentStreak).toBe(5);
      expect(res.body.streak.longestStreak).toBe(10);
    });

    it('should return streak from DB when cache miss', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockedRedis.get.mockResolvedValue(null);
      mockedRedis.set.mockResolvedValue(null as any);
      mockedRepo.get.mockResolvedValue({
        user_id: 'user-1',
        current_streak: 3,
        longest_streak: 7,
        last_solve_date: today,
      });

      const res = await request(app)
        .get('/api/streaks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.streak.currentStreak).toBe(3);
    });

    it('should return zero streak for new user', async () => {
      mockedRedis.get.mockResolvedValue(null);
      mockedRepo.get.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/streaks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.streak.currentStreak).toBe(0);
      expect(res.body.streak.longestStreak).toBe(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/streaks');
      expect(res.status).toBe(401);
    });
  });
});
