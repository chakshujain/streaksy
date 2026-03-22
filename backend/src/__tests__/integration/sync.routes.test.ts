import request from 'supertest';
import app from '../../app';
import { syncService } from '../../modules/sync/service/sync.service';
import { submissionRepository } from '../../modules/sync/repository/submission.repository';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/sync/service/sync.service');
jest.mock('../../modules/sync/repository/submission.repository');
jest.mock('../../modules/group/repository/group.repository');
const mockedSyncService = syncService as jest.Mocked<typeof syncService>;
const mockedSubRepo = submissionRepository as jest.Mocked<typeof submissionRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('Sync Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockSyncResult = {
    progress: {
      problemId: 'prob-1',
      problemSlug: 'two-sum',
      status: 'solved' as const,
      solvedAt: new Date(),
    },
    submission: {
      id: 'sub-1',
      language: 'javascript',
      runtimeMs: 50,
      memoryKb: 40000,
    },
    streak: {
      currentStreak: 5,
      longestStreak: 10,
    },
  };

  const mockSubmission = {
    id: 'sub-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    status: 'Accepted',
    language: 'javascript',
    code: 'function twoSum() {}' as string | null,
    runtime_ms: 50 as number | null,
    runtime_percentile: 85.5 as number | null,
    memory_kb: 40000 as number | null,
    memory_percentile: 70.2 as number | null,
    time_spent_seconds: 300 as number | null,
    leetcode_submission_id: null as string | null,
    submitted_at: new Date(),
    created_at: new Date(),
  };

  const mockStats = {
    totalSubmissions: 50,
    acceptedSubmissions: 30,
    avgRuntime: 45 as number | null,
    avgMemory: 38000 as number | null,
    avgTimeSpent: 250 as number | null,
    languages: [
      { language: 'javascript', count: 20 },
      { language: 'python', count: 10 },
    ],
  };

  const mockPeerSolution = {
    id: 'sub-2',
    user_id: 'user-2',
    display_name: 'User Two',
    code: 'def two_sum(): pass',
    language: 'python',
    runtime_ms: 40,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/sync/leetcode', () => {
    const validBody = {
      problemSlug: 'two-sum',
      status: 'solved',
    };

    it('should sync a leetcode submission', async () => {
      mockedSyncService.syncLeetcode.mockResolvedValue(mockSyncResult);

      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send(validBody);

      expect(res.status).toBe(200);
      expect(res.body.progress).toBeDefined();
    });

    it('should sync with optional fields', async () => {
      mockedSyncService.syncLeetcode.mockResolvedValue(mockSyncResult);

      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...validBody,
          language: 'javascript',
          code: 'function twoSum() {}',
          runtimeMs: 50,
          runtimePercentile: 85.5,
          memoryKb: 40000,
          memoryPercentile: 70.2,
          timeSpentSeconds: 300,
        });

      expect(res.status).toBe(200);
    });

    it('should return 400 for missing problemSlug', async () => {
      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'solved' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing status', async () => {
      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemSlug: 'two-sum' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid status value', async () => {
      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemSlug: 'two-sum', status: 'invalid' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for empty problemSlug', async () => {
      const res = await request(app)
        .post('/api/sync/leetcode')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemSlug: '', status: 'solved' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/sync/leetcode')
        .send(validBody);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/sync/submissions', () => {
    it('should return user submissions', async () => {
      mockedSubRepo.getForUser.mockResolvedValue([mockSubmission]);

      const res = await request(app)
        .get('/api/sync/submissions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.submissions).toHaveLength(1);
    });

    it('should return empty list when no submissions', async () => {
      mockedSubRepo.getForUser.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/sync/submissions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.submissions).toHaveLength(0);
    });

    it('should support pagination params', async () => {
      mockedSubRepo.getForUser.mockResolvedValue([]);

      await request(app)
        .get('/api/sync/submissions?limit=5&offset=10')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedSubRepo.getForUser).toHaveBeenCalledWith('user-1', 5, 10);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/sync/submissions');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/sync/submissions/stats', () => {
    it('should return submission stats', async () => {
      mockedSubRepo.getStats.mockResolvedValue(mockStats);

      const res = await request(app)
        .get('/api/sync/submissions/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.stats.totalSubmissions).toBe(50);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/sync/submissions/stats');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/sync/submissions/:problemId', () => {
    it('should return submissions for a problem', async () => {
      mockedSubRepo.getForProblem.mockResolvedValue([mockSubmission]);

      const res = await request(app)
        .get('/api/sync/submissions/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.submissions).toHaveLength(1);
    });

    it('should return empty list for problem with no submissions', async () => {
      mockedSubRepo.getForProblem.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/sync/submissions/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.submissions).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/sync/submissions/prob-1');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/sync/peer-solutions/:problemId', () => {
    it('should return peer solutions', async () => {
      mockedGroupRepo.getUserGroups.mockResolvedValue([{
        id: 'group-1',
        name: 'Test Group',
        description: null,
        invite_code: 'abc123',
        created_by: 'user-1',
        created_at: new Date(),
        plan: null,
        objective: null,
        target_date: null,
      }]);
      mockedSubRepo.getPeerSolutions.mockResolvedValue([mockPeerSolution]);

      const res = await request(app)
        .get('/api/sync/peer-solutions/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.solutions).toHaveLength(1);
    });

    it('should return empty list when no peer solutions', async () => {
      mockedGroupRepo.getUserGroups.mockResolvedValue([] as any[]);
      mockedSubRepo.getPeerSolutions.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/sync/peer-solutions/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.solutions).toHaveLength(0);
    });

    it('should pass user group IDs to repository', async () => {
      mockedGroupRepo.getUserGroups.mockResolvedValue([
        { id: 'group-1', name: 'Group 1', description: null, invite_code: 'abc', created_by: 'user-1', created_at: new Date(), plan: null, objective: null, target_date: null },
        { id: 'group-2', name: 'Group 2', description: null, invite_code: 'def', created_by: 'user-1', created_at: new Date(), plan: null, objective: null, target_date: null },
      ]);
      mockedSubRepo.getPeerSolutions.mockResolvedValue([]);

      await request(app)
        .get('/api/sync/peer-solutions/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedSubRepo.getPeerSolutions).toHaveBeenCalledWith(
        'prob-1',
        'user-1',
        10,
        ['group-1', 'group-2']
      );
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/sync/peer-solutions/prob-1');
      expect(res.status).toBe(401);
    });
  });
});
