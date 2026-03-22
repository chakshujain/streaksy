import request from 'supertest';
import app from '../../app';
import { generateTestToken, mockUserRow } from '../helpers';
import { authRepository } from '../../modules/auth/repository/auth.repository';
import { submissionRepository } from '../../modules/sync/repository/submission.repository';
import { problemRepository } from '../../modules/problem/repository/problem.repository';
import { progressRepository } from '../../modules/progress/repository/progress.repository';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { streakRepository } from '../../modules/streak/repository/streak.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/auth/repository/auth.repository');
jest.mock('../../modules/sync/repository/submission.repository');
jest.mock('../../modules/problem/repository/problem.repository');
jest.mock('../../modules/progress/repository/progress.repository');
jest.mock('../../modules/group/repository/group.repository');
jest.mock('../../modules/streak/repository/streak.repository');
jest.mock('../../config/redis', () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
  },
}));
jest.mock('../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, basePoints: 10, streakBonus: 5, multipliers: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>;
const mockedSubmissionRepo = submissionRepository as jest.Mocked<typeof submissionRepository>;
const mockedProblemRepo = problemRepository as jest.Mocked<typeof problemRepository>;
const mockedProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedStreakRepo = streakRepository as jest.Mocked<typeof streakRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: LeetCode Sync & Submissions', () => {
  const userId = 'user-sync';
  const email = 'sync@test.com';
  const token = generateTestToken(userId, email);

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mocks for sync service side effects
    mockedGroupRepo.getUserGroups.mockResolvedValue([]);
    mockedStreakRepo.get.mockResolvedValue(null);
    mockedStreakRepo.upsert.mockResolvedValue();
    // query is used by smart-notifications and other side-effect services
    mockedQuery.mockResolvedValue([]);
  });

  describe('Step 1: Connect LeetCode account', () => {
    it('should connect LeetCode username', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUserRow({ id: userId, email }));
      mockedAuthRepo.connectLeetcode.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/connect-leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ leetcodeUsername: 'sync_user_lc' });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 2: Sync a solved problem from LeetCode', () => {
    it('should sync a solved problem with submission details', async () => {
      // syncService calls authRepository.findById first
      mockedAuthRepo.findById.mockResolvedValue(mockUserRow({ id: userId, email }));
      mockedProblemRepo.findBySlug.mockResolvedValue({
        id: 'prob-twosum', title: 'Two Sum', slug: 'two-sum',
        difficulty: 'easy', url: 'https://leetcode.com/problems/two-sum/',
        youtube_url: null, video_title: null, created_at: new Date(),
      });
      mockedSubmissionRepo.findByLeetcodeId.mockResolvedValue(null);
      mockedSubmissionRepo.create.mockResolvedValue({
        id: 'sub-1', user_id: userId, problem_id: 'prob-twosum',
        status: 'solved', language: 'python', code: 'def twoSum(nums, target): ...',
        runtime_ms: 45, runtime_percentile: 85.5,
        memory_kb: 14200, memory_percentile: 72.3,
        time_spent_seconds: 900, leetcode_submission_id: 'lc-sub-123',
        submitted_at: new Date(), created_at: new Date(),
      });
      mockedProgressRepo.upsert.mockResolvedValue({
        user_id: userId, problem_id: 'prob-twosum',
        status: 'solved', solved_at: new Date(), updated_at: new Date(),
      });
      mockedProgressRepo.getSolvedCountToday.mockResolvedValue(1);
      mockedQueryOne.mockResolvedValue({ current_streak: 1, longest_streak: 1, last_solve_date: '2026-03-22' });

      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemSlug: 'two-sum',
          status: 'solved',
          language: 'python',
          code: 'def twoSum(nums, target): ...',
          runtimeMs: 45,
          runtimePercentile: 85.5,
          memoryKb: 14200,
          memoryPercentile: 72.3,
          timeSpentSeconds: 900,
          leetcodeSubmissionId: 'lc-sub-123',
        });

      expect(res.status).toBe(200);
    });

    it('should handle duplicate submission gracefully', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUserRow({ id: userId, email }));
      mockedProblemRepo.findBySlug.mockResolvedValue({
        id: 'prob-twosum', title: 'Two Sum', slug: 'two-sum',
        difficulty: 'easy', url: 'https://leetcode.com/problems/two-sum/',
        youtube_url: null, video_title: null, created_at: new Date(),
      });
      mockedSubmissionRepo.findByLeetcodeId.mockResolvedValue({
        id: 'sub-existing', user_id: userId, problem_id: 'prob-twosum',
        status: 'solved', language: 'python', code: null,
        runtime_ms: 45, runtime_percentile: null,
        memory_kb: null, memory_percentile: null,
        time_spent_seconds: null, leetcode_submission_id: 'lc-sub-123',
        submitted_at: new Date(), created_at: new Date(),
      });

      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemSlug: 'two-sum',
          status: 'solved',
          leetcodeSubmissionId: 'lc-sub-123',
        });

      expect(res.status).toBe(200);
    });

    it('should sync an attempted problem', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUserRow({ id: userId, email }));
      mockedProblemRepo.findBySlug.mockResolvedValue({
        id: 'prob-3sum', title: '3Sum', slug: '3sum',
        difficulty: 'medium', url: 'https://leetcode.com/problems/3sum/',
        youtube_url: null, video_title: null, created_at: new Date(),
      });
      mockedSubmissionRepo.findByLeetcodeId.mockResolvedValue(null);
      mockedSubmissionRepo.create.mockResolvedValue({
        id: 'sub-2', user_id: userId, problem_id: 'prob-3sum',
        status: 'attempted', language: 'javascript', code: null,
        runtime_ms: null, runtime_percentile: null,
        memory_kb: null, memory_percentile: null,
        time_spent_seconds: 600, leetcode_submission_id: null,
        submitted_at: new Date(), created_at: new Date(),
      });
      mockedProgressRepo.upsert.mockResolvedValue({
        user_id: userId, problem_id: 'prob-3sum',
        status: 'attempted', solved_at: null, updated_at: new Date(),
      });
      mockedProgressRepo.getSolvedCountToday.mockResolvedValue(1);

      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemSlug: '3sum',
          status: 'attempted',
          language: 'javascript',
          timeSpentSeconds: 600,
        });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 3: View submissions', () => {
    it('should list user submissions with pagination', async () => {
      mockedSubmissionRepo.getForUser.mockResolvedValue([
        {
          id: 'sub-1', user_id: userId, problem_id: 'prob-twosum',
          status: 'solved', language: 'python', code: null,
          runtime_ms: 45, runtime_percentile: 85.5,
          memory_kb: 14200, memory_percentile: 72.3,
          time_spent_seconds: 900, leetcode_submission_id: 'lc-sub-123',
          submitted_at: new Date(), created_at: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/sync/submissions?limit=10&offset=0')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.submissions).toHaveLength(1);
      expect(res.body.submissions[0].language).toBe('python');
    });

    it('should get submissions for a specific problem', async () => {
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        {
          id: 'sub-1', user_id: userId, problem_id: 'prob-twosum',
          status: 'solved', language: 'python', code: 'def twoSum(nums, target): ...',
          runtime_ms: 45, runtime_percentile: 85.5,
          memory_kb: 14200, memory_percentile: 72.3,
          time_spent_seconds: 900, leetcode_submission_id: 'lc-sub-123',
          submitted_at: new Date(), created_at: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/sync/submissions/prob-twosum')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.submissions).toHaveLength(1);
      expect(res.body.submissions[0].code).toContain('twoSum');
    });
  });

  describe('Step 4: View submission statistics', () => {
    it('should return aggregated submission stats', async () => {
      mockedSubmissionRepo.getStats.mockResolvedValue({
        totalSubmissions: 15,
        acceptedSubmissions: 12,
        avgRuntime: 52.3,
        avgMemory: 15400,
        languages: [
          { language: 'python', count: 8 },
          { language: 'javascript', count: 4 },
          { language: 'java', count: 3 },
        ],
        avgTimeSpent: 720,
      });

      const res = await request(app)
        .get('/api/sync/submissions/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.stats.totalSubmissions).toBe(15);
      expect(res.body.stats.acceptedSubmissions).toBe(12);
      expect(res.body.stats.languages).toHaveLength(3);
    });
  });

  describe('Step 5: View peer solutions', () => {
    it('should get peer solutions from group members', async () => {
      mockedGroupRepo.getUserGroups.mockResolvedValue([]);
      mockedSubmissionRepo.getPeerSolutions.mockResolvedValue([
        {
          user_id: 'peer-user-1', display_name: 'Peer One',
          language: 'python', code: 'class Solution: ...',
          runtime_ms: 38, memory_kb: 13500,
        },
        {
          user_id: 'peer-user-2', display_name: 'Peer Two',
          language: 'java', code: 'class Solution { ... }',
          runtime_ms: 2, memory_kb: 42000,
        },
      ]);

      const res = await request(app)
        .get('/api/sync/peer-solutions/prob-twosum')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.solutions).toHaveLength(2);
    });
  });

  describe('Step 6: Validate sync input', () => {
    it('should reject sync without problem slug', async () => {
      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'solved' });

      expect(res.status).toBe(400);
    });

    it('should reject sync with invalid status', async () => {
      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemSlug: 'two-sum', status: 'invalid' });

      expect(res.status).toBe(400);
    });
  });
});
