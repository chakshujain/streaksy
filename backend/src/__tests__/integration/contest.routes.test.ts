import request from 'supertest';
import app from '../../app';
import { contestService } from '../../modules/contest/service/contest.service';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/contest/service/contest.service');
const mockedService = contestService as jest.Mocked<typeof contestService>;

describe('Contest Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockContest = {
    id: 'contest-1',
    group_id: 'group-1',
    title: 'Weekly Sprint',
    description: 'Solve 5 problems',
    created_by: 'user-1',
    starts_at: new Date('2025-01-15T10:00:00Z'),
    ends_at: new Date('2025-01-15T12:00:00Z'),
    created_at: new Date(),
    problems: [] as { problem_id: string; title: string; slug: string; difficulty: string; position: number }[],
    standings: [] as { user_id: string; display_name: string; solved_count: number; last_submission: Date }[],
  };

  const mockSubmission = {
    id: 'sub-1',
    contest_id: 'contest-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    submitted_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/groups/:id/contests', () => {
    const validBody = {
      title: 'Weekly Sprint',
      startsAt: '2025-01-15T10:00:00Z',
      endsAt: '2025-01-15T12:00:00Z',
    };

    it('should create a contest', async () => {
      mockedService.create.mockResolvedValue(mockContest);

      const res = await request(app)
        .post('/api/groups/group-1/contests')
        .set('Authorization', `Bearer ${token}`)
        .send(validBody);

      expect(res.status).toBe(201);
      expect(res.body.contest.title).toBe('Weekly Sprint');
    });

    it('should return 400 for missing title', async () => {
      const res = await request(app)
        .post('/api/groups/group-1/contests')
        .set('Authorization', `Bearer ${token}`)
        .send({ startsAt: '2025-01-15T10:00:00Z', endsAt: '2025-01-15T12:00:00Z' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing dates', async () => {
      const res = await request(app)
        .post('/api/groups/group-1/contests')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Sprint' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid datetime format', async () => {
      const res = await request(app)
        .post('/api/groups/group-1/contests')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Sprint', startsAt: 'not-a-date', endsAt: 'not-a-date' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/groups/group-1/contests')
        .send(validBody);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/groups/:id/contests', () => {
    it('should return contests for a group', async () => {
      mockedService.getForGroup.mockResolvedValue([mockContest]);

      const res = await request(app)
        .get('/api/groups/group-1/contests')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.contests).toHaveLength(1);
      expect(res.body.contests[0].title).toBe('Weekly Sprint');
    });

    it('should return empty list when no contests', async () => {
      mockedService.getForGroup.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/groups/group-1/contests')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.contests).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/groups/group-1/contests');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/contests/:id', () => {
    it('should return contest details', async () => {
      mockedService.getDetails.mockResolvedValue(mockContest);

      const res = await request(app)
        .get('/api/contests/contest-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.contest.title).toBe('Weekly Sprint');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/contests/contest-1');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/contests/:id/submit', () => {
    it('should submit to a contest', async () => {
      mockedService.submit.mockResolvedValue(mockSubmission);

      const res = await request(app)
        .post('/api/contests/contest-1/submit')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' });

      expect(res.status).toBe(201);
      expect(res.body.submission).toBeDefined();
    });

    it('should return 400 for missing problemId', async () => {
      const res = await request(app)
        .post('/api/contests/contest-1/submit')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 for non-uuid problemId', async () => {
      const res = await request(app)
        .post('/api/contests/contest-1/submit')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: 'not-a-uuid' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/contests/contest-1/submit')
        .send({ problemId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' });

      expect(res.status).toBe(401);
    });
  });
});
