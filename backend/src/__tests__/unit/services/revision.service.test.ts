import { revisionService } from '../../../modules/revision/service/revision.service';
import { revisionRepository } from '../../../modules/revision/repository/revision.repository';
import { submissionRepository } from '../../../modules/sync/repository/submission.repository';
import { query, queryOne } from '../../../config/database';
import { redis } from '../../../config/redis';

jest.mock('../../../modules/revision/repository/revision.repository');
jest.mock('../../../modules/sync/repository/submission.repository');
jest.mock('../../../modules/ai/service/ai.service', () => ({
  generateRevisionNotes: jest.fn(),
  generateHints: jest.fn(),
  generateExplanation: jest.fn(),
  reviewCode: jest.fn(),
}));
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));
jest.mock('../../../config/redis', () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
    scanIterator: jest.fn().mockReturnValue((async function* () {})()),
  },
  connectRedis: jest.fn(),
}));
jest.mock('../../../config/env', () => ({
  env: {
    ai: { apiKey: 'test-api-key', baseUrl: 'http://test', model: 'test-model' },
    jwt: { secret: 'test-secret' },
  },
}));

const mockedRevisionRepo = revisionRepository as jest.Mocked<typeof revisionRepository>;
const mockedSubmissionRepo = submissionRepository as jest.Mocked<typeof submissionRepository>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedRedis = redis as jest.Mocked<typeof redis>;

// Import AI mocks after jest.mock
import { generateRevisionNotes, generateHints, generateExplanation, reviewCode } from '../../../modules/ai/service/ai.service';
const mockedGenerateRevisionNotes = generateRevisionNotes as jest.MockedFunction<typeof generateRevisionNotes>;
const mockedGenerateHints = generateHints as jest.MockedFunction<typeof generateHints>;
const mockedGenerateExplanation = generateExplanation as jest.MockedFunction<typeof generateExplanation>;
const mockedReviewCode = reviewCode as jest.MockedFunction<typeof reviewCode>;

describe('revisionService', () => {
  const mockRevision = {
    id: 'rev-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    key_takeaway: 'Use hash map for O(1) lookup',
    approach: 'Two pointer',
    time_complexity: 'O(n)',
    space_complexity: 'O(n)',
    tags: ['hash-map', 'two-pointer'],
    difficulty_rating: 'medium',
    intuition: 'Think about complement',
    points_to_remember: ['Check edge cases'],
    ai_generated: false,
    last_revised_at: null,
    revision_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
    problem_title: 'Two Sum',
    problem_slug: 'two-sum',
    problem_difficulty: 'easy',
  };

  const mockProblem = { id: 'prob-1', title: 'Two Sum', difficulty: 'easy' };

  const mockSubmission = {
    id: 'sub-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    status: 'Accepted',
    language: 'python',
    code: 'def twoSum(nums, target): pass',
    runtime_ms: 50,
    runtime_percentile: 80,
    memory_kb: 14000,
    memory_percentile: 70,
    time_spent_seconds: 300,
    leetcode_submission_id: 'lc-1',
    submitted_at: new Date(),
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockedRedis.incr as jest.Mock).mockResolvedValue(1);
  });

  describe('createOrUpdate', () => {
    it('should delegate to repository', async () => {
      mockedRevisionRepo.createOrUpdate.mockResolvedValue(mockRevision);

      const data = { keyTakeaway: 'Use hash map for O(1) lookup', approach: 'Two pointer' };
      const result = await revisionService.createOrUpdate('user-1', 'prob-1', data);

      expect(mockedRevisionRepo.createOrUpdate).toHaveBeenCalledWith('user-1', 'prob-1', data);
      expect(result).toEqual(mockRevision);
    });
  });

  describe('generateAI', () => {
    it('should generate AI notes when all conditions are met', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([{ name: 'hash-map' }]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([mockSubmission]);
      const aiNotes = { keyTakeaway: 'AI generated insight', approach: 'Hash map' };
      mockedGenerateRevisionNotes.mockResolvedValue(aiNotes as any);

      const result = await revisionService.generateAI('user-1', 'prob-1');

      expect(mockedQueryOne).toHaveBeenCalled();
      expect(mockedSubmissionRepo.getForProblem).toHaveBeenCalledWith('user-1', 'prob-1');
      expect(mockedGenerateRevisionNotes).toHaveBeenCalledWith(
        'Two Sum', 'easy', 'def twoSum(nums, target): pass', 'python', ['hash-map']
      );
      expect(result).toEqual(aiNotes);
    });

    it('should throw 503 when API key is not configured', async () => {
      // Override env for this test
      const envModule = require('../../../config/env');
      const originalKey = envModule.env.ai.apiKey;
      envModule.env.ai.apiKey = '';

      await expect(revisionService.generateAI('user-1', 'prob-1')).rejects.toMatchObject({
        statusCode: 503,
      });

      envModule.env.ai.apiKey = originalKey;
    });

    it('should throw notFound when problem does not exist', async () => {
      mockedQueryOne.mockResolvedValue(null);

      await expect(revisionService.generateAI('user-1', 'prob-1')).rejects.toThrow('Problem not found');
    });

    it('should throw badRequest when no accepted submission exists', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([]);

      await expect(revisionService.generateAI('user-1', 'prob-1')).rejects.toThrow(
        'No accepted submission with code found'
      );
    });

    it('should throw badRequest when accepted submission has no code', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        { ...mockSubmission, code: null },
      ]);

      await expect(revisionService.generateAI('user-1', 'prob-1')).rejects.toThrow(
        'No accepted submission with code found'
      );
    });

    it('should throw 502 when AI service returns null', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([mockSubmission]);
      mockedGenerateRevisionNotes.mockResolvedValue(null as any);

      await expect(revisionService.generateAI('user-1', 'prob-1')).rejects.toMatchObject({
        statusCode: 502,
      });
    });

    it('should throw 429 when rate limit is exceeded', async () => {
      (mockedRedis.incr as jest.Mock).mockResolvedValue(21);

      await expect(revisionService.generateAI('user-1', 'prob-1')).rejects.toThrow(
        'AI generation limit reached'
      );
      await expect(revisionService.generateAI('user-1', 'prob-1')).rejects.toMatchObject({
        statusCode: 429,
      });
    });
  });

  describe('getRevisionCards', () => {
    it('should return revision cards for a user', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([mockRevision]);

      const result = await revisionService.getRevisionCards('user-1');

      expect(mockedRevisionRepo.getForUser).toHaveBeenCalledWith('user-1', undefined);
      expect(result).toEqual([mockRevision]);
    });

    it('should pass filters to repository', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([]);
      const filters = { tag: 'hash-map', difficulty: 'easy', limit: 20, offset: 10 };

      await revisionService.getRevisionCards('user-1', filters);

      expect(mockedRevisionRepo.getForUser).toHaveBeenCalledWith('user-1', filters);
    });
  });

  describe('getRevisionQuiz', () => {
    it('should return random revision notes for quiz', async () => {
      mockedRevisionRepo.getRandomForRevision.mockResolvedValue([mockRevision]);

      const result = await revisionService.getRevisionQuiz('user-1', 5);

      expect(mockedRevisionRepo.getRandomForRevision).toHaveBeenCalledWith('user-1', 5);
      expect(result).toEqual([mockRevision]);
    });

    it('should default to 10 questions', async () => {
      mockedRevisionRepo.getRandomForRevision.mockResolvedValue([]);

      await revisionService.getRevisionQuiz('user-1');

      expect(mockedRevisionRepo.getRandomForRevision).toHaveBeenCalledWith('user-1', 10);
    });
  });

  describe('getByProblem', () => {
    it('should return revision note for a specific problem', async () => {
      mockedRevisionRepo.getByProblem.mockResolvedValue(mockRevision);

      const result = await revisionService.getByProblem('user-1', 'prob-1');

      expect(mockedRevisionRepo.getByProblem).toHaveBeenCalledWith('user-1', 'prob-1');
      expect(result).toEqual(mockRevision);
    });

    it('should return null when no revision exists', async () => {
      mockedRevisionRepo.getByProblem.mockResolvedValue(null);

      const result = await revisionService.getByProblem('user-1', 'prob-1');

      expect(result).toBeNull();
    });
  });

  describe('markRevised', () => {
    it('should mark a revision note as revised', async () => {
      mockedRevisionRepo.findById.mockResolvedValue(mockRevision);
      mockedRevisionRepo.markRevised.mockResolvedValue();

      await revisionService.markRevised('rev-1', 'user-1');

      expect(mockedRevisionRepo.findById).toHaveBeenCalledWith('rev-1');
      expect(mockedRevisionRepo.markRevised).toHaveBeenCalledWith('rev-1', 'user-1');
    });

    it('should throw notFound when revision note does not exist', async () => {
      mockedRevisionRepo.findById.mockResolvedValue(null);

      await expect(revisionService.markRevised('nonexistent', 'user-1')).rejects.toThrow(
        'Revision note not found'
      );
    });

    it('should throw forbidden when revision note belongs to another user', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({ ...mockRevision, user_id: 'other-user' });

      await expect(revisionService.markRevised('rev-1', 'user-1')).rejects.toThrow(
        'Not your revision note'
      );
      await expect(revisionService.markRevised('rev-1', 'user-1')).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('delete', () => {
    it('should delete a revision note', async () => {
      mockedRevisionRepo.findById.mockResolvedValue(mockRevision);
      mockedRevisionRepo.delete.mockResolvedValue();

      await revisionService.delete('rev-1', 'user-1');

      expect(mockedRevisionRepo.delete).toHaveBeenCalledWith('rev-1', 'user-1');
    });

    it('should throw notFound when revision note does not exist', async () => {
      mockedRevisionRepo.findById.mockResolvedValue(null);

      await expect(revisionService.delete('nonexistent', 'user-1')).rejects.toThrow(
        'Revision note not found'
      );
    });

    it('should throw forbidden when revision note belongs to another user', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({ ...mockRevision, user_id: 'other-user' });

      await expect(revisionService.delete('rev-1', 'user-1')).rejects.toThrow(
        'Not your revision note'
      );
    });
  });

  describe('getHints', () => {
    it('should generate hints for a problem', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([{ name: 'array' }]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([mockSubmission]);
      const hints = { hints: ['Think about complement', 'Use a hash map'] };
      mockedGenerateHints.mockResolvedValue(hints as any);

      const result = await revisionService.getHints('user-1', 'prob-1');

      expect(mockedGenerateHints).toHaveBeenCalledWith(
        'Two Sum', 'easy', ['array'],
        mockSubmission.code, mockSubmission.language
      );
      expect(result).toEqual(hints);
    });

    it('should throw notFound when problem does not exist', async () => {
      mockedQueryOne.mockResolvedValue(null);

      await expect(revisionService.getHints('user-1', 'prob-1')).rejects.toThrow('Problem not found');
    });

    it('should work without any submissions (no code context)', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([]);
      mockedGenerateHints.mockResolvedValue({ hints: ['Hint 1'] } as any);

      const result = await revisionService.getHints('user-1', 'prob-1');

      expect(mockedGenerateHints).toHaveBeenCalledWith(
        'Two Sum', 'easy', [], undefined, undefined
      );
      expect(result).toEqual({ hints: ['Hint 1'] });
    });

    it('should throw 502 when AI service returns null', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([]);
      mockedGenerateHints.mockResolvedValue(null as any);

      await expect(revisionService.getHints('user-1', 'prob-1')).rejects.toMatchObject({
        statusCode: 502,
      });
    });
  });

  describe('getExplanation', () => {
    it('should generate explanation for a problem', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([{ name: 'array' }]);
      const explanation = { explanation: 'This problem uses hash map...' };
      mockedGenerateExplanation.mockResolvedValue(explanation as any);

      const result = await revisionService.getExplanation('user-1', 'prob-1');

      expect(mockedGenerateExplanation).toHaveBeenCalledWith('Two Sum', 'easy', ['array']);
      expect(result).toEqual(explanation);
    });

    it('should throw notFound when problem does not exist', async () => {
      mockedQueryOne.mockResolvedValue(null);

      await expect(revisionService.getExplanation('user-1', 'prob-1')).rejects.toThrow('Problem not found');
    });

    it('should throw 502 when AI service returns null', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedGenerateExplanation.mockResolvedValue(null as any);

      await expect(revisionService.getExplanation('user-1', 'prob-1')).rejects.toMatchObject({
        statusCode: 502,
      });
    });
  });

  describe('getCodeReview', () => {
    it('should generate code review for a solved problem', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([{ name: 'array' }]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([mockSubmission]);
      const review = { review: 'Good solution, consider edge cases...' };
      mockedReviewCode.mockResolvedValue(review as any);

      const result = await revisionService.getCodeReview('user-1', 'prob-1');

      expect(mockedReviewCode).toHaveBeenCalledWith(
        'Two Sum', 'easy', mockSubmission.code, mockSubmission.language, ['array']
      );
      expect(result).toEqual(review);
    });

    it('should throw notFound when problem does not exist', async () => {
      mockedQueryOne.mockResolvedValue(null);

      await expect(revisionService.getCodeReview('user-1', 'prob-1')).rejects.toThrow('Problem not found');
    });

    it('should throw badRequest when no accepted submission exists', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([
        { ...mockSubmission, status: 'Wrong Answer' },
      ]);

      await expect(revisionService.getCodeReview('user-1', 'prob-1')).rejects.toThrow(
        'No accepted submission with code found'
      );
    });

    it('should throw 502 when AI service returns null', async () => {
      mockedQueryOne.mockResolvedValue(mockProblem);
      mockedQuery.mockResolvedValue([]);
      mockedSubmissionRepo.getForProblem.mockResolvedValue([mockSubmission]);
      mockedReviewCode.mockResolvedValue(null as any);

      await expect(revisionService.getCodeReview('user-1', 'prob-1')).rejects.toMatchObject({
        statusCode: 502,
      });
    });
  });

  describe('_checkRateLimit', () => {
    it('should set expiry on first request of the day', async () => {
      (mockedRedis.incr as jest.Mock).mockResolvedValue(1);

      await revisionService._checkRateLimit('user-1');

      expect(mockedRedis.expire).toHaveBeenCalled();
    });

    it('should not set expiry on subsequent requests', async () => {
      (mockedRedis.incr as jest.Mock).mockResolvedValue(5);

      await revisionService._checkRateLimit('user-1');

      expect(mockedRedis.expire).not.toHaveBeenCalled();
    });

    it('should throw 429 when limit exceeded (> 20)', async () => {
      (mockedRedis.incr as jest.Mock).mockResolvedValue(21);

      await expect(revisionService._checkRateLimit('user-1')).rejects.toThrow(
        'AI generation limit reached'
      );
    });

    it('should allow exactly 20 requests', async () => {
      (mockedRedis.incr as jest.Mock).mockResolvedValue(20);

      await expect(revisionService._checkRateLimit('user-1')).resolves.not.toThrow();
    });
  });
});
