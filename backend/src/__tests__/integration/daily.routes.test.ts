import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { query } from '../../config/database';

// Daily service uses `query` from database directly (no dedicated repository)
// The database module is already mocked by setup.ts

const mockedQuery = query as jest.MockedFunction<typeof query>;

describe('Daily Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockDailyProblem = {
    id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    url: 'https://leetcode.com/problems/two-sum/',
    youtube_url: null,
    sheet_name: 'Blind 75',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/daily', () => {
    it('should return daily problems', async () => {
      // First call: group problems, second call: popular problems
      mockedQuery.mockResolvedValueOnce([mockDailyProblem])
        .mockResolvedValueOnce([]);

      const res = await request(app)
        .get('/api/daily')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toBeDefined();
      expect(res.body.date).toBeDefined();
    });

    it('should return empty problems when none available', async () => {
      mockedQuery.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

      const res = await request(app)
        .get('/api/daily')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(0);
      expect(res.body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should support custom count parameter', async () => {
      mockedQuery.mockResolvedValueOnce([mockDailyProblem]).mockResolvedValueOnce([]);

      const res = await request(app)
        .get('/api/daily?count=2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toBeDefined();
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/daily');
      expect(res.status).toBe(401);
    });
  });
});
