import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { revisionRepository } from '../../modules/revision/repository/revision.repository';
import { problemRepository } from '../../modules/problem/repository/problem.repository';
import { submissionRepository } from '../../modules/sync/repository/submission.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/revision/repository/revision.repository');
jest.mock('../../modules/problem/repository/problem.repository');
jest.mock('../../modules/sync/repository/submission.repository');
jest.mock('../../config/redis', () => ({
  redis: {
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  },
}));

// Set NVIDIA_API_KEY so AI endpoints don't throw 503
const envModule = require('../../config/env');
const originalApiKey = envModule.env.ai?.apiKey;
beforeAll(() => { if (envModule.env.ai) envModule.env.ai.apiKey = 'test-api-key'; });
afterAll(() => { if (envModule.env.ai) envModule.env.ai.apiKey = originalApiKey; });
jest.mock('../../modules/ai/service/ai.service', () => ({
  generateHints: jest.fn().mockResolvedValue({ hint: 'Consider using a stack data structure for matching brackets.' }),
  generateExplanation: jest.fn().mockResolvedValue({ explanation: 'Valid Parentheses uses a stack to match opening and closing brackets...' }),
  reviewCode: jest.fn().mockResolvedValue({ review: 'Your solution handles edge cases well. Consider early return for empty strings.' }),
  generateRevisionNotes: jest.fn().mockResolvedValue({
    keyTakeaway: 'Use stack to match brackets in LIFO order',
    approach: 'Push opening brackets, pop and match closing brackets',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  }),
}));

const mockedRevisionRepo = revisionRepository as jest.Mocked<typeof revisionRepository>;
const mockedProblemRepo = problemRepository as jest.Mocked<typeof problemRepository>;
const mockedSubmissionRepo = submissionRepository as jest.Mocked<typeof submissionRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: AI-Assisted Learning', () => {
  const userId = 'user-ai';
  const email = 'ai@test.com';
  const token = generateTestToken(userId, email);
  const problemId = '10000000-0000-4000-a000-000000000099';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Request AI hints for a problem', () => {
    it('should get AI-generated hints', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Valid Parentheses', difficulty: 'easy', slug: 'valid-parentheses' });
      mockedQuery.mockResolvedValue([]); // tags
      mockedSubmissionRepo.getForProblem.mockResolvedValue([]); // no submissions

      const res = await request(app)
        .post('/api/revisions/hints')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.hints).toBeDefined();
    });
  });

  describe('Step 2: Request AI explanation', () => {
    it('should get AI-generated explanation', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Valid Parentheses', difficulty: 'easy', slug: 'valid-parentheses' });
      mockedQuery.mockResolvedValue([]); // tags

      const res = await request(app)
        .post('/api/revisions/explain')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.explanation).toBeDefined();
    });
  });

  describe('Step 3: Request AI code review', () => {
    it('should get AI code review feedback', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Valid Parentheses', difficulty: 'easy', slug: 'valid-parentheses' });
      mockedQuery.mockResolvedValue([]); // tags
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        { id: 'sub-1', user_id: userId, problem_id: problemId, status: 'Accepted', language: 'python', code: 'def isValid(s): ...', runtime_ms: 30, runtime_percentile: null, memory_kb: null, memory_percentile: null, time_spent_seconds: null, leetcode_submission_id: null, submitted_at: new Date(), created_at: new Date() },
      ]);

      const res = await request(app)
        .post('/api/revisions/review')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.review).toBeDefined();
    });
  });

  describe('Step 4: Generate AI revision notes', () => {
    it('should generate AI revision notes for the problem', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Valid Parentheses', difficulty: 'easy', slug: 'valid-parentheses' });
      mockedQuery.mockResolvedValue([]); // tags
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        { id: 'sub-1', user_id: userId, problem_id: problemId, status: 'Accepted', language: 'python', code: 'def isValid(s): ...', runtime_ms: 30, runtime_percentile: null, memory_kb: null, memory_percentile: null, time_spent_seconds: null, leetcode_submission_id: null, submitted_at: new Date(), created_at: new Date() },
      ]);

      const res = await request(app)
        .post('/api/revisions/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.notes).toBeDefined();
    });
  });

  describe('Step 5: Create manual revision notes alongside AI notes', () => {
    it('should create manual revision notes', async () => {
      mockedRevisionRepo.createOrUpdate.mockResolvedValue({
        id: 'rev-manual-1', user_id: userId, problem_id: problemId,
        key_takeaway: 'Stack-based bracket matching with HashMap for pairs',
        approach: 'Use a map: ) -> (, ] -> [, } -> {. Push opens, match closes.',
        time_complexity: 'O(n)', space_complexity: 'O(n)',
        tags: ['stack', 'string'],
        difficulty_rating: 'easy',
        intuition: 'Think of brackets as doors - each closing door must match the most recent opening',
        points_to_remember: ['Check empty stack before popping', 'Handle leftover opens at end'],
        ai_generated: false, last_revised_at: null, revision_count: 0,
        created_at: new Date(), updated_at: new Date(),
      });

      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemId,
          keyTakeaway: 'Stack-based bracket matching with HashMap for pairs',
          approach: 'Use a map: ) -> (, ] -> [, } -> {. Push opens, match closes.',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          tags: ['stack', 'string'],
          difficultyRating: 'easy',
          intuition: 'Think of brackets as doors - each closing door must match the most recent opening',
          pointsToRemember: ['Check empty stack before popping', 'Handle leftover opens at end'],
        });

      expect(res.status).toBe(201);
      expect(res.body.note.ai_generated).toBe(false);
      expect(res.body.note.tags).toContain('stack');
    });
  });

  describe('Step 6: Filter revisions by tag and difficulty', () => {
    it('should filter revisions by tag', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([
        {
          id: 'rev-1', user_id: userId, problem_id: problemId,
          key_takeaway: 'Stack bracket matching', approach: null,
          time_complexity: 'O(n)', space_complexity: 'O(n)',
          tags: ['stack', 'string'], difficulty_rating: 'easy',
          intuition: null, points_to_remember: null,
          ai_generated: false, last_revised_at: null, revision_count: 0,
          created_at: new Date(), updated_at: new Date(),
          problem_title: 'Valid Parentheses', problem_slug: 'valid-parentheses', problem_difficulty: 'easy',
        },
      ]);

      const res = await request(app)
        .get('/api/revisions?tag=stack')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(1);
    });

    it('should filter revisions by difficulty', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/revisions?difficulty=hard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(0);
    });
  });

  describe('Step 7: Revision quiz flow', () => {
    it('should get quiz cards for revision', async () => {
      mockedRevisionRepo.getRandomForRevision.mockResolvedValue([
        {
          id: 'rev-1', user_id: userId, problem_id: problemId,
          key_takeaway: 'Stack bracket matching', approach: 'Push/pop',
          time_complexity: 'O(n)', space_complexity: 'O(n)',
          tags: ['stack'], difficulty_rating: 'easy', intuition: null,
          points_to_remember: null, ai_generated: false,
          last_revised_at: null, revision_count: 0,
          created_at: new Date(), updated_at: new Date(),
          problem_title: 'Valid Parentheses', problem_slug: 'valid-parentheses', problem_difficulty: 'easy',
        },
      ]);

      const res = await request(app)
        .get('/api/revisions/quiz?count=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.cards).toHaveLength(1);
    });

    it('should mark a revision as revised after quiz', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({
        id: 'rev-1', user_id: userId, problem_id: problemId,
        key_takeaway: 'Stack', approach: null,
        time_complexity: null, space_complexity: null,
        tags: [], difficulty_rating: null, intuition: null,
        points_to_remember: null, ai_generated: false,
        last_revised_at: null, revision_count: 0,
        created_at: new Date(), updated_at: new Date(),
      });
      mockedRevisionRepo.markRevised.mockResolvedValue();

      const res = await request(app)
        .patch('/api/revisions/rev-1/revised')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRevisionRepo.markRevised).toHaveBeenCalledWith('rev-1', userId);
    });
  });

  describe('Step 8: Delete a revision', () => {
    it('should delete own revision notes', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({
        id: 'rev-1', user_id: userId, problem_id: problemId,
        key_takeaway: 'Stack', approach: null,
        time_complexity: null, space_complexity: null,
        tags: [], difficulty_rating: null, intuition: null,
        points_to_remember: null, ai_generated: false,
        last_revised_at: null, revision_count: 0,
        created_at: new Date(), updated_at: new Date(),
      });
      mockedRevisionRepo.delete.mockResolvedValue();

      const res = await request(app)
        .delete('/api/revisions/rev-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('should not delete another user revision', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({
        id: 'rev-other', user_id: 'other-user', problem_id: problemId,
        key_takeaway: 'Other', approach: null,
        time_complexity: null, space_complexity: null,
        tags: [], difficulty_rating: null, intuition: null,
        points_to_remember: null, ai_generated: false,
        last_revised_at: null, revision_count: 0,
        created_at: new Date(), updated_at: new Date(),
      });

      const res = await request(app)
        .delete('/api/revisions/rev-other')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
