process.env.NVIDIA_API_KEY = 'test-key';

import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { query } from '../../config/database';

jest.mock('../../modules/ai/service/ai.service', () => ({
  generateDailyBrief: jest.fn().mockResolvedValue({
    brief: 'Today you have a great mix of problems! Start with the easy Two Sum to warm up, then tackle the medium-level problems to build momentum.',
    tips: ['Focus on hash map patterns today', 'Take breaks between problems'],
  }),
  generateRevisionNotes: jest.fn(),
  generateHints: jest.fn(),
  generateExplanation: jest.fn(),
  reviewCode: jest.fn(),
  answerLessonQuestion: jest.fn(),
  generateDashboardInsight: jest.fn(),
}));
jest.mock('../../common/utils/aiRateLimit', () => ({
  checkAIRateLimit: jest.fn().mockResolvedValue(undefined),
}));
const mockedQuery = query as jest.MockedFunction<typeof query>;

describe('E2E Journey: Daily Recommendations', () => {
  const userId = '30000000-0000-4000-a000-000000000001';
  const email = 'daily@test.com';
  const token = generateTestToken(userId, email);

  const mockProblems = [
    { id: 'p1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', url: 'https://leetcode.com/problems/two-sum/', youtube_url: null, sheet_name: 'Blind 75' },
    { id: 'p2', title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium', url: 'https://leetcode.com/problems/add-two-numbers/', youtube_url: null, sheet_name: 'Blind 75' },
    { id: 'p3', title: 'Longest Substring', slug: 'longest-substring', difficulty: 'medium', url: 'https://leetcode.com/problems/longest-substring/', youtube_url: null, sheet_name: 'NeetCode 150' },
    { id: 'p4', title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'hard', url: 'https://leetcode.com/problems/median-of-two/', youtube_url: null, sheet_name: 'NeetCode 150' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Get daily problem recommendations', () => {
    it('should return personalized daily problems', async () => {
      // First query: group problems (return empty to trigger fallback)
      mockedQuery.mockResolvedValueOnce([]);
      // Second query: popular sheet problems
      mockedQuery.mockResolvedValueOnce(mockProblems);

      const res = await request(app)
        .get('/api/daily')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toBeDefined();
      expect(res.body.date).toBeDefined();
    });

    it('should return problems from group sheets when available', async () => {
      mockedQuery.mockResolvedValueOnce(mockProblems);

      const res = await request(app)
        .get('/api/daily')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toBeDefined();
    });

    it('should support custom count parameter', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      mockedQuery.mockResolvedValueOnce(mockProblems);

      const res = await request(app)
        .get('/api/daily?count=2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array when no problems available', async () => {
      mockedQuery.mockResolvedValueOnce([]);
      mockedQuery.mockResolvedValueOnce([]);

      const res = await request(app)
        .get('/api/daily')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(0);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/daily');

      expect(res.status).toBe(401);
    });
  });

  describe('Step 2: Get AI daily brief', () => {
    it('should generate an AI brief based on daily problems', async () => {
      // getDailyProblems queries (called internally)
      mockedQuery.mockResolvedValueOnce([]);
      mockedQuery.mockResolvedValueOnce(mockProblems);
      // Tags queries for each problem
      mockedQuery.mockResolvedValueOnce([{ name: 'array' }, { name: 'hash-table' }]);
      mockedQuery.mockResolvedValueOnce([{ name: 'linked-list' }]);
      mockedQuery.mockResolvedValueOnce([{ name: 'string' }, { name: 'sliding-window' }]);
      mockedQuery.mockResolvedValueOnce([{ name: 'binary-search' }]);

      const res = await request(app)
        .post('/api/daily/ai-brief')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.brief).toBeDefined();
    });

    it('should require authentication for AI brief', async () => {
      const res = await request(app).post('/api/daily/ai-brief');

      expect(res.status).toBe(401);
    });
  });
});
