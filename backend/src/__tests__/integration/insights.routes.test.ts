import request from 'supertest';
import app from '../../app';
import { insightsRepository } from '../../modules/insights/repository/insights.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/insights/repository/insights.repository');
const mockedRepo = insightsRepository as jest.Mocked<typeof insightsRepository>;

describe('Insights Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/insights/overview', () => {
    it('should return overview data', async () => {
      mockedRepo.getOverview.mockResolvedValue({
        total_solved: 30,
        easy_count: 15,
        medium_count: 10,
        hard_count: 5,
      });
      mockedRepo.getStreak.mockResolvedValue({ current_streak: 5, longest_streak: 12 });
      mockedRepo.getActiveDays.mockResolvedValue(20);

      const res = await request(app)
        .get('/api/insights/overview')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.totalSolved).toBe(30);
      expect(res.body.currentStreak).toBe(5);
      expect(res.body.solveRateByDifficulty.easy.count).toBe(15);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/insights/overview');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/insights/weekly', () => {
    it('should return weekly data', async () => {
      mockedRepo.getWeekly.mockResolvedValue([
        { week_start: '2024-01-01', count: 5 },
      ]);

      const res = await request(app)
        .get('/api/insights/weekly')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.weeks).toHaveLength(1);
    });
  });

  describe('GET /api/insights/tags', () => {
    it('should return tag statistics', async () => {
      mockedRepo.getTagStats.mockResolvedValue([
        { tag_name: 'Array', solved_count: 10, total_count: 20 },
      ]);

      const res = await request(app)
        .get('/api/insights/tags')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tags).toHaveLength(1);
      expect(res.body.tags[0].tagName).toBe('Array');
    });
  });

  describe('GET /api/insights/difficulty-trend', () => {
    it('should return difficulty trend', async () => {
      mockedRepo.getDifficultyTrend.mockResolvedValue([
        { month: '2024-01', easy: 5, medium: 3, hard: 1 },
      ]);

      const res = await request(app)
        .get('/api/insights/difficulty-trend')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.trend).toHaveLength(1);
    });
  });
});
