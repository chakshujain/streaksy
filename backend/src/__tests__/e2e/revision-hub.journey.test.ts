// Set AI key before env module loads so AI endpoints don't return 503
process.env.NVIDIA_API_KEY = 'test-key';

import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { revisionRepository } from '../../modules/revision/repository/revision.repository';
import { submissionRepository } from '../../modules/sync/repository/submission.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/revision/repository/revision.repository');
jest.mock('../../modules/sync/repository/submission.repository');
jest.mock('../../modules/ai/service/ai.service', () => ({
  generateRevisionNotes: jest.fn().mockResolvedValue({
    keyTakeaway: 'Use a hash map for O(1) lookups',
    approach: 'Two-pass hash table',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    intuition: 'Store complements in a map as you iterate',
    pointsToRemember: ['Check for duplicate indices', 'Handle edge cases'],
  }),
  generateHints: jest.fn().mockResolvedValue({
    hints: ['Think about what data structure gives O(1) lookup', 'Consider storing complements'],
  }),
  generateExplanation: jest.fn().mockResolvedValue({
    explanation: 'The two-sum problem can be solved efficiently using a hash map...',
  }),
  reviewCode: jest.fn().mockResolvedValue({
    review: 'Good solution! Consider using early return for edge cases.',
  }),
  answerLessonQuestion: jest.fn(),
  generateDailyBrief: jest.fn(),
  generateDashboardInsight: jest.fn(),
}));
jest.mock('../../common/utils/aiRateLimit', () => ({
  checkAIRateLimit: jest.fn().mockResolvedValue(undefined),
}));

const mockedRevisionRepo = revisionRepository as jest.Mocked<typeof revisionRepository>;
const mockedSubmissionRepo = submissionRepository as jest.Mocked<typeof submissionRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Revision Hub', () => {
  const userId = '20000000-0000-4000-a000-000000000001';
  const email = 'reviser@test.com';
  const token = generateTestToken(userId, email);
  const problemId = '10000000-0000-4000-b000-000000000001';

  const mockRevision = {
    id: 'rev-001',
    user_id: userId,
    problem_id: problemId,
    key_takeaway: 'Use hash map for O(1) lookups',
    approach: 'Two-pass hash table',
    time_complexity: 'O(n)',
    space_complexity: 'O(n)',
    tags: ['array', 'hash-table'],
    difficulty_rating: 'easy',
    intuition: 'Store complements in a map',
    points_to_remember: ['Check duplicates', 'Edge cases'],
    ai_generated: false,
    revision_count: 0,
    last_revised_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    problem_title: 'Two Sum',
    problem_difficulty: 'easy',
    problem_slug: 'two-sum',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Create a revision note manually', () => {
    it('should create a new revision note for a problem', async () => {
      mockedRevisionRepo.createOrUpdate.mockResolvedValue(mockRevision);

      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemId,
          keyTakeaway: 'Use hash map for O(1) lookups',
          approach: 'Two-pass hash table',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          tags: ['array', 'hash-table'],
          difficultyRating: 'easy',
        });

      expect(res.status).toBe(201);
      expect(res.body.note).toBeDefined();
      expect(mockedRevisionRepo.createOrUpdate).toHaveBeenCalledWith(
        userId,
        problemId,
        expect.objectContaining({ keyTakeaway: 'Use hash map for O(1) lookups' }),
      );
    });

    it('should reject revision without required fields', async () => {
      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 2: Browse revision cards', () => {
    it('should list all revision cards for the user', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([mockRevision]);

      const res = await request(app)
        .get('/api/revisions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(1);
      expect(res.body.notes[0].problem_title).toBe('Two Sum');
    });

    it('should filter revision cards by difficulty', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([mockRevision]);

      const res = await request(app)
        .get('/api/revisions?difficulty=easy')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRevisionRepo.getForUser).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ difficulty: 'easy' }),
      );
    });

    it('should filter revision cards by tag', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([mockRevision]);

      const res = await request(app)
        .get('/api/revisions?tag=array')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRevisionRepo.getForUser).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ tag: 'array' }),
      );
    });
  });

  describe('Step 3: Get revision for a specific problem', () => {
    it('should return revision note for a specific problem', async () => {
      mockedRevisionRepo.getByProblem.mockResolvedValue(mockRevision);

      const res = await request(app)
        .get(`/api/revisions/${problemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.note.key_takeaway).toBe('Use hash map for O(1) lookups');
    });

    it('should return null when no revision exists for a problem', async () => {
      mockedRevisionRepo.getByProblem.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/revisions/00000000-0000-4000-a000-000000000099')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.note).toBeNull();
    });
  });

  describe('Step 4: Take a revision quiz', () => {
    it('should return random revision cards for quiz mode', async () => {
      const quizCards = [
        { ...mockRevision, id: 'rev-001' },
        { ...mockRevision, id: 'rev-002', problem_title: 'Valid Parentheses', problem_slug: 'valid-parentheses' },
        { ...mockRevision, id: 'rev-003', problem_title: 'Merge Two Lists', problem_slug: 'merge-two-lists' },
      ];
      mockedRevisionRepo.getRandomForRevision.mockResolvedValue(quizCards);

      const res = await request(app)
        .get('/api/revisions/quiz?count=3')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.cards).toHaveLength(3);
    });

    it('should default to 10 cards when no count specified', async () => {
      mockedRevisionRepo.getRandomForRevision.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/revisions/quiz')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRevisionRepo.getRandomForRevision).toHaveBeenCalledWith(userId, 10);
    });
  });

  describe('Step 5: Generate AI revision notes', () => {
    it('should generate AI-powered revision notes for a solved problem', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Two Sum', difficulty: 'easy' });
      mockedQuery.mockResolvedValue([{ name: 'array' }, { name: 'hash-table' }]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        {
          id: 'sub-1', user_id: userId, problem_id: problemId,
          status: 'Accepted', language: 'python3', code: 'def twoSum(nums, target): ...',
          runtime: '40ms', memory: '14MB', runtime_percentile: 90, memory_percentile: 85,
          submitted_at: new Date(), created_at: new Date(),
        },
      ] as any);

      const res = await request(app)
        .post('/api/revisions/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.notes).toBeDefined();
      expect(res.body.notes.keyTakeaway).toBe('Use a hash map for O(1) lookups');
    });

    it('should reject AI generation when no accepted submission exists', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Two Sum', difficulty: 'easy' });
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        { id: 'sub-1', status: 'Wrong Answer', code: null } as any,
      ]);

      const res = await request(app)
        .post('/api/revisions/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 6: Get AI hints for a problem', () => {
    it('should return progressive hints', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Two Sum', difficulty: 'easy' });
      mockedQuery.mockResolvedValue([{ name: 'array' }]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([]);

      const res = await request(app)
        .post('/api/revisions/hints')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.hints).toBeDefined();
    });
  });

  describe('Step 7: Get AI explanation', () => {
    it('should return a detailed explanation', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Two Sum', difficulty: 'easy' });
      mockedQuery.mockResolvedValue([{ name: 'array' }]);

      const res = await request(app)
        .post('/api/revisions/explain')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.explanation).toBeDefined();
    });
  });

  describe('Step 8: Get AI code review', () => {
    it('should review the users accepted submission', async () => {
      mockedQueryOne.mockResolvedValue({ id: problemId, title: 'Two Sum', difficulty: 'easy' });
      mockedQuery.mockResolvedValue([{ name: 'array' }]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        {
          id: 'sub-1', user_id: userId, problem_id: problemId,
          status: 'Accepted', language: 'python3', code: 'def twoSum(nums, target): ...',
          runtime: '40ms', memory: '14MB', runtime_percentile: 90, memory_percentile: 85,
          submitted_at: new Date(), created_at: new Date(),
        },
      ] as any);

      const res = await request(app)
        .post('/api/revisions/review')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId });

      expect(res.status).toBe(200);
      expect(res.body.review).toBeDefined();
    });
  });

  describe('Step 9: Mark a revision as revised', () => {
    it('should update the revision timestamp and count', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({ ...mockRevision, user_id: userId } as any);
      mockedRevisionRepo.markRevised.mockResolvedValue();

      const res = await request(app)
        .patch('/api/revisions/rev-001/revised')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRevisionRepo.markRevised).toHaveBeenCalledWith('rev-001', userId);
    });

    it('should deny marking revision owned by another user', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({ ...mockRevision, user_id: 'other-user' } as any);

      const res = await request(app)
        .patch('/api/revisions/rev-001/revised')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 404 for non-existent revision', async () => {
      mockedRevisionRepo.findById.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/revisions/nonexistent/revised')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Step 10: Delete a revision note', () => {
    it('should delete the revision note', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({ ...mockRevision, user_id: userId } as any);
      mockedRevisionRepo.delete.mockResolvedValue();

      const res = await request(app)
        .delete('/api/revisions/rev-001')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRevisionRepo.delete).toHaveBeenCalledWith('rev-001', userId);
    });

    it('should deny deleting revision owned by another user', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({ ...mockRevision, user_id: 'other-user' } as any);

      const res = await request(app)
        .delete('/api/revisions/rev-001')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
