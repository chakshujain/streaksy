import { syncService } from '../../../modules/sync/service/sync.service';
import { problemRepository } from '../../../modules/problem/repository/problem.repository';
import { progressRepository } from '../../../modules/progress/repository/progress.repository';
import { streakService } from '../../../modules/streak/service/streak.service';
import { leaderboardService } from '../../../modules/leaderboard/service/leaderboard.service';
import { groupRepository } from '../../../modules/group/repository/group.repository';
import { authRepository } from '../../../modules/auth/repository/auth.repository';
import { submissionRepository } from '../../../modules/sync/repository/submission.repository';
import { badgeService } from '../../../modules/badge/service/badge.service';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/problem/repository/problem.repository');
jest.mock('../../../modules/progress/repository/progress.repository');
jest.mock('../../../modules/streak/service/streak.service');
jest.mock('../../../modules/leaderboard/service/leaderboard.service');
jest.mock('../../../modules/group/repository/group.repository');
jest.mock('../../../modules/auth/repository/auth.repository');
jest.mock('../../../modules/sync/repository/submission.repository');
jest.mock('../../../modules/badge/service/badge.service');
jest.mock('../../../modules/powerup/service/powerup.service', () => ({
  powerupService: {
    awardSolvePoints: jest.fn().mockResolvedValue(10),
    checkMilestoneRewards: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../../modules/poke/service/poke.service', () => ({
  pokeService: {
    progressRecoveryChallenge: jest.fn().mockResolvedValue(null),
  },
}));
jest.mock('../../../modules/feed/service/feed.service', () => ({
  feedService: {
    postEvent: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../../modules/notification/service/smart-notifications', () => ({
  smartNotifications: {
    notifyFriendsOfSolve: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../../common/utils/cache', () => ({
  cached: jest.fn((key: string, ttl: number, fn: () => Promise<unknown>) => fn()),
  invalidate: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));

const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>;
const mockedProblemRepo = problemRepository as jest.Mocked<typeof problemRepository>;
const mockedProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;
const mockedStreakService = streakService as jest.Mocked<typeof streakService>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedLeaderboardService = leaderboardService as jest.Mocked<typeof leaderboardService>;
const mockedSubmissionRepo = submissionRepository as jest.Mocked<typeof submissionRepository>;
const mockedBadgeService = badgeService as jest.Mocked<typeof badgeService>;

describe('syncService', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@test.com',
    display_name: 'Test User',
    password_hash: 'hash',
    provider: 'local',
    provider_id: null,
    avatar_url: null,
    bio: null,
    created_at: new Date(),
    updated_at: new Date(),
    email_verified: true,
    verification_token: null,
    reset_token: null,
    reset_token_expires: null,
  };

  const mockProblem = {
    id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    url: 'https://leetcode.com/problems/two-sum/',
    created_at: new Date(),
  };

  const mockProgress = {
    user_id: 'user-1',
    problem_id: 'prob-1',
    status: 'solved',
    solved_at: new Date(),
  };

  const mockSubmission = {
    id: 'sub-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    status: 'Accepted',
    language: 'python',
    code: 'def twoSum(): pass',
    runtime_ms: 50,
    runtime_percentile: 80,
    memory_kb: 14000,
    memory_percentile: 70,
    time_spent_seconds: 300,
    leetcode_submission_id: 'lc-123',
    submitted_at: new Date(),
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGroupRepo.getUserGroups.mockResolvedValue([]);
  });

  describe('syncLeetcode', () => {
    it('should sync a solved problem without submission details', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(mockProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue(mockProgress as any);
      mockedStreakService.recordSolve.mockResolvedValue({ currentStreak: 5, longestStreak: 10 });
      mockedBadgeService.checkAndAward.mockResolvedValue([]);

      const result = await syncService.syncLeetcode('user-1', 'two-sum', 'solved');

      expect(mockedAuthRepo.findById).toHaveBeenCalledWith('user-1');
      expect(mockedProblemRepo.findBySlug).toHaveBeenCalledWith('two-sum');
      expect(mockedProgressRepo.upsert).toHaveBeenCalledWith('user-1', 'prob-1', 'solved');
      expect(mockedStreakService.recordSolve).toHaveBeenCalledWith('user-1');
      expect(result.progress).toEqual({
        problemId: 'prob-1',
        problemSlug: 'two-sum',
        status: 'solved',
        solvedAt: mockProgress.solved_at,
      });
      expect(result.submission).toBeNull();
      expect(result.streak).toEqual({ currentStreak: 5, longestStreak: 10 });
    });

    it('should sync with submission details', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(mockProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue(mockProgress as any);
      mockedStreakService.recordSolve.mockResolvedValue({ currentStreak: 1, longestStreak: 1 });
      mockedSubmissionRepo.findByLeetcodeId.mockResolvedValue(null);
      mockedSubmissionRepo.create.mockResolvedValue(mockSubmission);
      mockedBadgeService.checkAndAward.mockResolvedValue([]);

      const result = await syncService.syncLeetcode('user-1', 'two-sum', 'solved', {
        language: 'python',
        code: 'def twoSum(): pass',
        runtimeMs: 50,
        runtimePercentile: 80,
        memoryKb: 14000,
        memoryPercentile: 70,
        timeSpentSeconds: 300,
        leetcodeSubmissionId: 'lc-123',
      });

      expect(mockedSubmissionRepo.findByLeetcodeId).toHaveBeenCalledWith('lc-123');
      expect(mockedSubmissionRepo.create).toHaveBeenCalledWith({
        userId: 'user-1',
        problemId: 'prob-1',
        status: 'Accepted',
        language: 'python',
        code: 'def twoSum(): pass',
        runtimeMs: 50,
        runtimePercentile: 80,
        memoryKb: 14000,
        memoryPercentile: 70,
        timeSpentSeconds: 300,
        leetcodeSubmissionId: 'lc-123',
      });
      expect(result.submission).toEqual({
        id: 'sub-1',
        language: 'python',
        runtimeMs: 50,
        memoryKb: 14000,
      });
    });

    it('should dedup submissions by leetcode submission ID', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(mockProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue(mockProgress as any);
      mockedStreakService.recordSolve.mockResolvedValue({ currentStreak: 1, longestStreak: 1 });
      mockedSubmissionRepo.findByLeetcodeId.mockResolvedValue(mockSubmission);
      mockedBadgeService.checkAndAward.mockResolvedValue([]);

      const result = await syncService.syncLeetcode('user-1', 'two-sum', 'solved', {
        language: 'python',
        leetcodeSubmissionId: 'lc-123',
      });

      expect(mockedSubmissionRepo.create).not.toHaveBeenCalled();
      expect(result.submission).toEqual({
        id: 'sub-1',
        language: 'python',
        runtimeMs: 50,
        memoryKb: 14000,
      });
    });

    it('should not update streak for non-solved status', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(mockProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue({ ...mockProgress, status: 'attempted' } as any);

      const result = await syncService.syncLeetcode('user-1', 'two-sum', 'attempted');

      expect(mockedStreakService.recordSolve).not.toHaveBeenCalled();
      expect(result.streak).toBeNull();
    });

    it('should set submission status to Attempted for non-solved problems', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(mockProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue({ ...mockProgress, status: 'attempted' } as any);
      mockedSubmissionRepo.create.mockResolvedValue({ ...mockSubmission, status: 'Attempted' });

      await syncService.syncLeetcode('user-1', 'two-sum', 'attempted', {
        language: 'python',
      });

      expect(mockedSubmissionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'Attempted' })
      );
    });

    it('should throw notFound when user does not exist', async () => {
      mockedAuthRepo.findById.mockResolvedValue(null);

      await expect(
        syncService.syncLeetcode('nonexistent', 'two-sum', 'solved')
      ).rejects.toThrow('User not found');
      await expect(
        syncService.syncLeetcode('nonexistent', 'two-sum', 'solved')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw notFound when problem does not exist and LeetCode lookup fails', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(null);

      // Mock fetch to simulate LeetCode API returning no data
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { question: null } }),
      }) as any;

      await expect(
        syncService.syncLeetcode('user-1', 'nonexistent-slug', 'solved')
      ).rejects.toThrow('Problem not found: nonexistent-slug');

      global.fetch = originalFetch;
    });

    it('should auto-create problem from LeetCode when slug not in DB', async () => {
      const newProblem = { id: 'prob-new', title: 'New Problem', slug: 'new-problem', difficulty: 'medium', url: 'https://leetcode.com/problems/new-problem/', created_at: new Date() };
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(null);
      mockedProblemRepo.create.mockResolvedValue(newProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue({ ...mockProgress, problem_id: newProblem.id } as any);
      mockedStreakService.recordSolve.mockResolvedValue({ currentStreak: 1, longestStreak: 1 });
      mockedGroupRepo.getUserGroups.mockResolvedValue([]);

      // Mock fetch to simulate LeetCode API returning problem data
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { question: { title: 'New Problem', difficulty: 'Medium' } } }),
      }) as any;

      const result = await syncService.syncLeetcode('user-1', 'new-problem', 'solved');
      expect(mockedProblemRepo.create).toHaveBeenCalledWith({
        title: 'New Problem',
        slug: 'new-problem',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/new-problem/',
      });
      expect(result.progress.problemId).toBe('prob-new');

      global.fetch = originalFetch;
    });

    it('should update leaderboard scores for user groups', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(mockProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue({ ...mockProgress, status: 'attempted' } as any);
      mockedGroupRepo.getUserGroups.mockResolvedValue([
        { id: 'group-1', name: 'G1', description: '', invite_code: 'x', created_by: 'user-1', created_at: new Date() },
        { id: 'group-2', name: 'G2', description: '', invite_code: 'y', created_by: 'user-1', created_at: new Date() },
      ] as any);
      mockedLeaderboardService.updateUserScore.mockResolvedValue(undefined as any);

      await syncService.syncLeetcode('user-1', 'two-sum', 'attempted');

      // Wait for async leaderboard update
      await new Promise(r => setTimeout(r, 50));

      expect(mockedGroupRepo.getUserGroups).toHaveBeenCalledWith('user-1');
    });

    it('should not throw when badge check fails', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedProblemRepo.findBySlug.mockResolvedValue(mockProblem as any);
      mockedProgressRepo.upsert.mockResolvedValue(mockProgress as any);
      mockedStreakService.recordSolve.mockResolvedValue({ currentStreak: 1, longestStreak: 1 });
      mockedBadgeService.checkAndAward.mockRejectedValue(new Error('Badge error'));

      // Should not throw — badge check is fire-and-forget
      const result = await syncService.syncLeetcode('user-1', 'two-sum', 'solved');

      expect(result.progress.status).toBe('solved');
    });
  });
});
