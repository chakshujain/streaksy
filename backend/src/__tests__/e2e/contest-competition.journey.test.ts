import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { contestRepository } from '../../modules/contest/repository/contest.repository';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/contest/repository/contest.repository');
jest.mock('../../modules/group/repository/group.repository');
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedContestRepo = contestRepository as jest.Mocked<typeof contestRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Contest & Competition', () => {
  const userA = { id: 'user-contest-a', email: 'contesta@test.com', name: 'ContestAlice' };
  const userB = { id: 'user-contest-b', email: 'contestb@test.com', name: 'ContestBob' };
  const tokenA = generateTestToken(userA.id, userA.email);
  const tokenB = generateTestToken(userB.id, userB.email);

  const groupId = 'group-contest';
  const contestId = 'contest-1';

  // Use valid UUIDs for problem IDs (required by validation schema)
  const prob1 = '10000000-0000-4000-a000-000000000001';
  const prob2 = '10000000-0000-4000-a000-000000000002';
  const prob3 = '10000000-0000-4000-a000-000000000003';

  const mockContest = {
    id: contestId,
    group_id: groupId,
    title: 'Weekly DSA Challenge',
    description: 'Solve 3 problems in 2 hours',
    starts_at: new Date('2026-03-20T14:00:00Z'),
    ends_at: new Date('2026-03-25T16:00:00Z'),
    created_by: userA.id,
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Create a contest within a group', () => {
    it('should create a new contest', async () => {
      mockedGroupRepo.getMember.mockResolvedValue({
        group_id: groupId, user_id: userA.id, role: 'admin',
      } as any);
      mockedContestRepo.create.mockResolvedValue(mockContest);
      mockedContestRepo.addProblem.mockResolvedValue();

      const res = await request(app)
        .post(`/api/groups/${groupId}/contests`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          title: 'Weekly DSA Challenge',
          description: 'Solve 3 problems in 2 hours',
          startsAt: '2026-03-22T14:00:00Z',
          endsAt: '2026-03-22T16:00:00Z',
          problemIds: [prob1, prob2, prob3],
        });

      expect(res.status).toBe(201);
      expect(res.body.contest.title).toBe('Weekly DSA Challenge');
    });

    it('should reject contest with missing title', async () => {
      const res = await request(app)
        .post(`/api/groups/${groupId}/contests`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          startsAt: '2026-03-22T14:00:00Z',
          endsAt: '2026-03-22T16:00:00Z',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 2: View group contests', () => {
    it('should list all contests for the group', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.getForGroup.mockResolvedValue([mockContest]);

      const res = await request(app)
        .get(`/api/groups/${groupId}/contests`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.contests).toHaveLength(1);
      expect(res.body.contests[0].title).toBe('Weekly DSA Challenge');
    });

    it('should deny access to non-group members', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);
      const outsiderToken = generateTestToken('outsider', 'outsider@test.com');

      const res = await request(app)
        .get(`/api/groups/${groupId}/contests`)
        .set('Authorization', `Bearer ${outsiderToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Step 3: View contest details with problems', () => {
    it('should get contest details including problems and standings', async () => {
      mockedContestRepo.findById.mockResolvedValue(mockContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.getProblems.mockResolvedValue([
        { problem_id: prob1, position: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'easy' },
        { problem_id: prob2, position: 2, title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium' },
        { problem_id: prob3, position: 3, title: '3Sum', slug: '3sum', difficulty: 'medium' },
      ]);
      mockedContestRepo.getStandings.mockResolvedValue([]);

      const res = await request(app)
        .get(`/api/contests/${contestId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.contest.title).toBe('Weekly DSA Challenge');
      // getDetails returns { ...contest, problems, standings } merged into contest
      expect(res.body.contest.problems).toHaveLength(3);
      expect(res.body.contest.standings).toHaveLength(0);
    });
  });

  describe('Step 4: Submit solutions to the contest', () => {
    it('Alice should submit a solution for problem 1', async () => {
      mockedContestRepo.findById.mockResolvedValue(mockContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.submit.mockResolvedValue({
        id: 'sub-1', contest_id: contestId, user_id: userA.id,
        problem_id: prob1, submitted_at: new Date(),
      });

      const res = await request(app)
        .post(`/api/contests/${contestId}/submit`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ problemId: prob1 });

      expect(res.status).toBe(201);
    });

    it('Bob should submit a solution', async () => {
      mockedContestRepo.findById.mockResolvedValue(mockContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.submit.mockResolvedValue({
        id: 'sub-2', contest_id: contestId, user_id: userB.id,
        problem_id: prob1, submitted_at: new Date(),
      });

      const res = await request(app)
        .post(`/api/contests/${contestId}/submit`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ problemId: prob1 });

      expect(res.status).toBe(201);
    });
  });

  describe('Step 5: Check contest standings', () => {
    it('should show contest standings with Bob leading', async () => {
      mockedContestRepo.findById.mockResolvedValue(mockContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.getProblems.mockResolvedValue([]);
      mockedContestRepo.getStandings.mockResolvedValue([
        { user_id: userB.id, display_name: userB.name, solved_count: 2, last_submission: new Date() },
        { user_id: userA.id, display_name: userA.name, solved_count: 1, last_submission: new Date() },
      ]);

      const res = await request(app)
        .get(`/api/contests/${contestId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.contest.standings).toHaveLength(2);
      expect(res.body.contest.standings[0].display_name).toBe(userB.name);
      expect(res.body.contest.standings[0].solved_count).toBe(2);
    });
  });

  describe('Step 6: Verify contest access control', () => {
    it('should deny submission from non-group member', async () => {
      mockedContestRepo.findById.mockResolvedValue(mockContest);
      mockedGroupRepo.isMember.mockResolvedValue(false);

      const outsiderToken = generateTestToken('outsider', 'out@test.com');

      const res = await request(app)
        .post(`/api/contests/${contestId}/submit`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .send({ problemId: prob1 });

      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent contest', async () => {
      mockedContestRepo.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/contests/nonexistent')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(404);
    });
  });
});
