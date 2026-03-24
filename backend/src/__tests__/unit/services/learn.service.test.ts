import { learnService } from '../../../modules/learn/service/learn.service';
import { answerLessonQuestion, LessonAnswer } from '../../../modules/ai/service/ai.service';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/ai/service/ai.service', () => ({
  answerLessonQuestion: jest.fn(),
}));

jest.mock('../../../common/utils/aiRateLimit', () => ({
  checkAIRateLimit: jest.fn(),
}));

jest.mock('../../../config/env', () => ({
  env: { ai: { apiKey: 'test-key' } },
}));

const mockedAnswerLessonQuestion = answerLessonQuestion as jest.MockedFunction<typeof answerLessonQuestion>;
const mockedCheckAIRateLimit = checkAIRateLimit as jest.MockedFunction<typeof checkAIRateLimit>;

const mockAnswer: LessonAnswer = {
  answer: 'A B-tree is a self-balancing tree data structure.',
  codeExample: null,
  relatedConcepts: ['Binary Search Tree', 'Indexing'],
};

describe('learnService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('askAI', () => {
    const userId = 'user-1';
    const topic = 'databases';
    const lesson = 'indexing';
    const question = 'What is a B-tree?';

    it('should return answer successfully', async () => {
      mockedCheckAIRateLimit.mockResolvedValue(undefined);
      mockedAnswerLessonQuestion.mockResolvedValue(mockAnswer);

      const result = await learnService.askAI(userId, topic, lesson, question);

      expect(result).toEqual(mockAnswer);
    });

    it('should throw 503 when no API key is configured', async () => {
      // Temporarily override env to have no API key
      const envModule = require('../../../config/env');
      const originalKey = envModule.env.ai.apiKey;
      envModule.env.ai.apiKey = '';

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toThrow(AppError);

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toMatchObject({ statusCode: 503 });

      // Restore
      envModule.env.ai.apiKey = originalKey;
    });

    it('should throw when rate limit is exceeded', async () => {
      mockedCheckAIRateLimit.mockRejectedValue(new AppError(429, 'Rate limit exceeded'));

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toThrow(AppError);

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toMatchObject({ statusCode: 429 });

      expect(mockedAnswerLessonQuestion).not.toHaveBeenCalled();
    });

    it('should throw 502 when AI returns null', async () => {
      mockedCheckAIRateLimit.mockResolvedValue(undefined);
      mockedAnswerLessonQuestion.mockResolvedValue(null);

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toThrow(AppError);

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toMatchObject({ statusCode: 502 });
    });

    it('should pass correct arguments to answerLessonQuestion', async () => {
      mockedCheckAIRateLimit.mockResolvedValue(undefined);
      mockedAnswerLessonQuestion.mockResolvedValue(mockAnswer);

      await learnService.askAI(userId, topic, lesson, question);

      expect(mockedCheckAIRateLimit).toHaveBeenCalledWith(userId);
      expect(mockedAnswerLessonQuestion).toHaveBeenCalledWith(topic, lesson, question);
    });

    it('should check rate limit before calling AI service', async () => {
      const callOrder: string[] = [];
      mockedCheckAIRateLimit.mockImplementation(async () => { callOrder.push('rateLimit'); });
      mockedAnswerLessonQuestion.mockImplementation(async () => { callOrder.push('ai'); return mockAnswer; });

      await learnService.askAI(userId, topic, lesson, question);

      expect(callOrder).toEqual(['rateLimit', 'ai']);
    });

    it('should not call answerLessonQuestion when rate limit rejects', async () => {
      mockedCheckAIRateLimit.mockRejectedValue(new AppError(429, 'Rate limit exceeded'));

      await expect(learnService.askAI(userId, topic, lesson, question)).rejects.toThrow();

      expect(mockedAnswerLessonQuestion).not.toHaveBeenCalled();
    });

    it('should throw 503 with descriptive message when API key is missing', async () => {
      const envModule = require('../../../config/env');
      const originalKey = envModule.env.ai.apiKey;
      envModule.env.ai.apiKey = '';

      try {
        await learnService.askAI(userId, topic, lesson, question);
        fail('Should have thrown');
      } catch (err: any) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(503);
        expect(err.message).toContain('not available');
      }

      envModule.env.ai.apiKey = originalKey;
    });

    it('should throw 502 when AI returns undefined', async () => {
      mockedCheckAIRateLimit.mockResolvedValue(undefined);
      mockedAnswerLessonQuestion.mockResolvedValue(undefined as any);

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toMatchObject({ statusCode: 502 });
    });

    it('should propagate unexpected errors from answerLessonQuestion', async () => {
      mockedCheckAIRateLimit.mockResolvedValue(undefined);
      mockedAnswerLessonQuestion.mockRejectedValue(new Error('Network error'));

      await expect(learnService.askAI(userId, topic, lesson, question))
        .rejects.toThrow('Network error');
    });

    it('should work with different topic and lesson combinations', async () => {
      const designAnswer: LessonAnswer = {
        answer: 'Singleton ensures a class has only one instance.',
        codeExample: 'class Singleton { ... }',
        relatedConcepts: ['Factory', 'Builder'],
      };
      mockedCheckAIRateLimit.mockResolvedValue(undefined);
      mockedAnswerLessonQuestion.mockResolvedValue(designAnswer);

      const result = await learnService.askAI('user-2', 'design-patterns', 'singleton', 'What is singleton?');

      expect(result).toEqual(designAnswer);
      expect(mockedCheckAIRateLimit).toHaveBeenCalledWith('user-2');
      expect(mockedAnswerLessonQuestion).toHaveBeenCalledWith('design-patterns', 'singleton', 'What is singleton?');
    });

    it('should not call rate limit check when API key is missing', async () => {
      const envModule = require('../../../config/env');
      const originalKey = envModule.env.ai.apiKey;
      envModule.env.ai.apiKey = '';

      await expect(learnService.askAI(userId, topic, lesson, question)).rejects.toThrow();

      expect(mockedCheckAIRateLimit).not.toHaveBeenCalled();
      expect(mockedAnswerLessonQuestion).not.toHaveBeenCalled();

      envModule.env.ai.apiKey = originalKey;
    });

    it('should return answer with code example when provided', async () => {
      const answerWithCode: LessonAnswer = {
        answer: 'A B-tree index speeds up queries.',
        codeExample: 'CREATE INDEX idx ON table(col);',
        relatedConcepts: ['Hash Index'],
      };
      mockedCheckAIRateLimit.mockResolvedValue(undefined);
      mockedAnswerLessonQuestion.mockResolvedValue(answerWithCode);

      const result = await learnService.askAI(userId, topic, lesson, question);

      expect(result.codeExample).toBe('CREATE INDEX idx ON table(col);');
      expect(result.relatedConcepts).toEqual(['Hash Index']);
    });
  });
});
