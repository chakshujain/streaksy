process.env.NVIDIA_API_KEY = 'test-key';

import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { insightsRepository } from '../../modules/insights/repository/insights.repository';
import { query } from '../../config/database';

jest.mock('../../modules/insights/repository/insights.repository');
jest.mock('../../modules/ai/service/ai.service', () => ({
  generateDashboardInsight: jest.fn().mockResolvedValue({
    tip: 'Focus on graph problems — you have solved only 2 out of 15. Try starting with BFS/DFS basics.',
    weakAreas: ['graph', 'dynamic-programming'],
    recommendation: 'Spend 30 minutes daily on graph traversal problems.',
  }),
  generateRevisionNotes: jest.fn(),
  generateHints: jest.fn(),
  generateExplanation: jest.fn(),
  reviewCode: jest.fn(),
  answerLessonQuestion: jest.fn(),
  generateDailyBrief: jest.fn(),
}));
jest.mock('../../common/utils/aiRateLimit', () => ({
  checkAIRateLimit: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../common/utils/cache', () => ({
  cached: jest.fn((_key: string, _ttl: number, fn: () => Promise<unknown>) => fn()),
  invalidate: jest.fn(),
}));
const mockedInsightsRepo = insightsRepository as jest.Mocked<typeof insightsRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;

describe('E2E Journey: Insights & Analytics', () => {
  const userId = '40000000-0000-4000-a000-000000000001';
  const email = 'analyst@test.com';
  const token = generateTestToken(userId, email);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: View overall stats overview', () => {
    it('should return solve stats grouped by difficulty', async () => {
      mockedInsightsRepo.getOverview.mockResolvedValue({
        total_solved: '45',
        easy_count: '20',
        medium_count: '18',
        hard_count: '7',
      } as any);
      mockedInsightsRepo.getStreak.mockResolvedValue({
        current_streak: 12,
        longest_streak: 30,
      } as any);
      mockedInsightsRepo.getActiveDays.mockResolvedValue(60);

      const res = await request(app)
        .get('/api/insights/overview')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.totalSolved).toBe(45);
      expect(res.body.solveRateByDifficulty.easy.count).toBe(20);
      expect(res.body.solveRateByDifficulty.medium.count).toBe(18);
      expect(res.body.solveRateByDifficulty.hard.count).toBe(7);
      expect(res.body.currentStreak).toBe(12);
      expect(res.body.longestStreak).toBe(30);
      expect(res.body.totalActiveDays).toBe(60);
    });

    it('should handle user with zero problems solved', async () => {
      mockedInsightsRepo.getOverview.mockResolvedValue({
        total_solved: '0',
        easy_count: '0',
        medium_count: '0',
        hard_count: '0',
      } as any);
      mockedInsightsRepo.getStreak.mockResolvedValue({
        current_streak: 0,
        longest_streak: 0,
      } as any);
      mockedInsightsRepo.getActiveDays.mockResolvedValue(0);

      const res = await request(app)
        .get('/api/insights/overview')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.totalSolved).toBe(0);
      expect(res.body.solveRateByDifficulty.easy.percentage).toBe(0);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/insights/overview');
      expect(res.status).toBe(401);
    });
  });

  describe('Step 2: View weekly activity trends', () => {
    it('should return weekly solve counts for the last 12 weeks', async () => {
      const weeklyData = [
        { week_start: '2026-01-06', count: '5' },
        { week_start: '2026-01-13', count: '8' },
        { week_start: '2026-01-20', count: '3' },
        { week_start: '2026-01-27', count: '12' },
      ];
      mockedInsightsRepo.getWeekly.mockResolvedValue(weeklyData as any);

      const res = await request(app)
        .get('/api/insights/weekly')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.weeks).toBeDefined();
      expect(res.body.weeks).toHaveLength(4);
      expect(res.body.weeks[0].weekStart).toBe('2026-01-06');
      expect(res.body.weeks[0].count).toBe(5);
    });
  });

  describe('Step 3: View tag-level statistics', () => {
    it('should return solve stats per tag', async () => {
      const tagData = [
        { tag_name: 'array', solved_count: '15', total_count: '20' },
        { tag_name: 'hash-table', solved_count: '10', total_count: '15' },
        { tag_name: 'graph', solved_count: '2', total_count: '15' },
        { tag_name: 'dynamic-programming', solved_count: '5', total_count: '25' },
      ];
      mockedInsightsRepo.getTagStats.mockResolvedValue(tagData as any);

      const res = await request(app)
        .get('/api/insights/tags')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tags).toBeDefined();
      expect(res.body.tags).toHaveLength(4);
      expect(res.body.tags[0].tagName).toBe('array');
      expect(res.body.tags[0].solvedCount).toBe(15);
      expect(res.body.tags[0].totalCount).toBe(20);
    });
  });

  describe('Step 4: View difficulty trend over 6 months', () => {
    it('should return monthly difficulty breakdown', async () => {
      const trendData = [
        { month: '2025-10', easy: '3', medium: '2', hard: '1' },
        { month: '2025-11', easy: '5', medium: '4', hard: '2' },
        { month: '2025-12', easy: '4', medium: '6', hard: '1' },
        { month: '2026-01', easy: '6', medium: '5', hard: '3' },
        { month: '2026-02', easy: '3', medium: '4', hard: '2' },
        { month: '2026-03', easy: '5', medium: '3', hard: '1' },
      ];
      mockedInsightsRepo.getDifficultyTrend.mockResolvedValue(trendData as any);

      const res = await request(app)
        .get('/api/insights/difficulty-trend')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.trend).toBeDefined();
      expect(res.body.trend).toHaveLength(6);
      expect(res.body.trend[0].month).toBe('2025-10');
      expect(res.body.trend[0].easy).toBe(3);
      expect(res.body.trend[0].medium).toBe(2);
      expect(res.body.trend[0].hard).toBe(1);
    });
  });

  describe('Step 5: Get AI coaching tips', () => {
    it('should return personalized AI coaching advice', async () => {
      // Overview calls
      mockedInsightsRepo.getOverview.mockResolvedValue({
        total_solved: '45', easy_count: '20', medium_count: '18', hard_count: '7',
      } as any);
      mockedInsightsRepo.getStreak.mockResolvedValue({
        current_streak: 12, longest_streak: 30,
      } as any);
      mockedInsightsRepo.getActiveDays.mockResolvedValue(60);

      // Tag stats for weak area detection
      mockedInsightsRepo.getTagStats.mockResolvedValue([
        { tag_name: 'array', solved_count: '15', total_count: '20' },
        { tag_name: 'graph', solved_count: '2', total_count: '15' },
        { tag_name: 'dp', solved_count: '3', total_count: '25' },
      ] as any);

      // Active roadmaps count
      mockedQuery.mockResolvedValue([{ count: '2' }]);

      const res = await request(app)
        .post('/api/insights/ai-coach')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tip).toBeDefined();
    });

    it('should require authentication for AI coach', async () => {
      const res = await request(app).post('/api/insights/ai-coach');
      expect(res.status).toBe(401);
    });
  });
});
