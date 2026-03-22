import {
  generateRevisionNotes,
  generateHints,
  generateExplanation,
  reviewCode,
} from '../../../modules/ai/service/ai.service';
import { env } from '../../../config/env';

// Mock env
jest.mock('../../../config/env', () => ({
  env: {
    ai: {
      apiKey: 'test-api-key',
      baseUrl: 'https://ai.example.com/v1',
      model: 'test-model',
    },
    frontendUrl: 'http://localhost:3000',
  },
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateRevisionNotes', () => {
    const validResponse = {
      keyTakeaway: 'Use a hash map for O(1) lookups',
      approach: 'Hash Map',
      intuition: 'Store complements as you iterate',
      pointsToRemember: ['Handle duplicates', 'Return indices not values', 'Single pass'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    };

    it('should return revision notes on valid AI response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(validResponse) } }],
        }),
      });

      const result = await generateRevisionNotes('Two Sum', 'easy', 'const x = 1;', 'javascript', ['array', 'hash-table']);

      expect(result).toEqual(validResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should return null when API key is not configured', async () => {
      const originalKey = env.ai.apiKey;
      (env as any).ai.apiKey = '';

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();

      (env as any).ai.apiKey = originalKey;
    });

    it('should return null when API returns non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      });

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
    });

    it('should return null when AI returns empty content', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: '' } }] }),
      });

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
    });

    it('should return null when AI returns incomplete data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({ keyTakeaway: 'x' }) } }],
        }),
      });

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
    });

    it('should strip thinking tags from response', async () => {
      const contentWithThinking = `<think>Let me analyze...</think>${JSON.stringify(validResponse)}`;
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: contentWithThinking } }],
        }),
      });

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toEqual(validResponse);
    });

    it('should handle JSON wrapped in code fences', async () => {
      const fencedContent = '```json\n' + JSON.stringify(validResponse) + '\n```';
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: fencedContent } }],
        }),
      });

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toEqual(validResponse);
    });

    it('should return null on fetch error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
    });

    it('should limit pointsToRemember to 5 items', async () => {
      const manyPoints = {
        ...validResponse,
        pointsToRemember: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(manyPoints) } }],
        }),
      });

      const result = await generateRevisionNotes('Two Sum', 'easy', 'code', 'js', []);

      expect(result!.pointsToRemember).toHaveLength(5);
    });
  });

  describe('generateHints', () => {
    const validHints = {
      hints: [
        { level: 1, hint: 'Consider using a data structure for fast lookups' },
        { level: 2, hint: 'A hash map can store complements' },
        { level: 3, hint: 'Iterate once, checking if complement exists' },
      ],
    };

    it('should return hints on valid AI response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(validHints) } }],
        }),
      });

      const result = await generateHints('Two Sum', 'easy', ['array']);

      expect(result).toHaveLength(3);
      expect(result![0].level).toBe(1);
      expect(result![2].level).toBe(3);
    });

    it('should tailor hints when user code is provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(validHints) } }],
        }),
      });

      await generateHints('Two Sum', 'easy', ['array'], 'for(int i=0;', 'java');

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.messages[1].content).toContain('current code');
    });

    it('should return null when API returns empty hints array', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({ hints: [] }) } }],
        }),
      });

      const result = await generateHints('Two Sum', 'easy', []);

      expect(result).toBeNull();
    });

    it('should return null on API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limited'),
      });

      const result = await generateHints('Two Sum', 'easy', []);

      expect(result).toBeNull();
    });

    it('should return null on fetch exception', async () => {
      mockFetch.mockRejectedValue(new Error('Timeout'));

      const result = await generateHints('Two Sum', 'easy', []);

      expect(result).toBeNull();
    });

    it('should limit hints to 3', async () => {
      const manyHints = {
        hints: [
          { level: 1, hint: 'h1' },
          { level: 2, hint: 'h2' },
          { level: 3, hint: 'h3' },
          { level: 4, hint: 'h4' },
        ],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(manyHints) } }],
        }),
      });

      const result = await generateHints('Two Sum', 'easy', []);

      expect(result).toHaveLength(3);
    });
  });

  describe('generateExplanation', () => {
    const validExplanation = {
      overview: 'A classic problem about finding two numbers that sum to a target.',
      approaches: [
        {
          name: 'Brute Force',
          description: 'Check all pairs.',
          timeComplexity: 'O(n^2)',
          spaceComplexity: 'O(1)',
          pros: ['Simple'],
          cons: ['Slow'],
        },
      ],
      bestApproach: 'Hash Map approach for O(n) time',
      commonMistakes: ['Forgetting to check for duplicate indices'],
      relatedPatterns: ['Two Pointers'],
    };

    it('should return explanation on valid AI response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(validExplanation) } }],
        }),
      });

      const result = await generateExplanation('Two Sum', 'easy', ['array']);

      expect(result).toEqual(validExplanation);
    });

    it('should return null when approaches array is empty', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({ overview: 'test', approaches: [] }) } }],
        }),
      });

      const result = await generateExplanation('Two Sum', 'easy', []);

      expect(result).toBeNull();
    });

    it('should return null on API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Error'),
      });

      const result = await generateExplanation('Two Sum', 'easy', []);

      expect(result).toBeNull();
    });

    it('should return null on fetch exception', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await generateExplanation('Two Sum', 'easy', []);

      expect(result).toBeNull();
    });

    it('should limit approaches to 4', async () => {
      const manyApproaches = {
        ...validExplanation,
        approaches: Array(6).fill(validExplanation.approaches[0]),
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(manyApproaches) } }],
        }),
      });

      const result = await generateExplanation('Two Sum', 'easy', []);

      expect(result!.approaches).toHaveLength(4);
    });
  });

  describe('reviewCode', () => {
    const validReview = {
      rating: 8,
      summary: 'Clean solution using hash map.',
      strengths: ['Efficient O(n) time', 'Readable code'],
      issues: [
        {
          severity: 'suggestion' as const,
          description: 'Variable naming could be better',
          fix: 'Use descriptive names',
        },
      ],
      optimizedApproach: null,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    };

    it('should return code review on valid AI response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(validReview) } }],
        }),
      });

      const result = await reviewCode('Two Sum', 'easy', 'const x = 1;', 'javascript', ['array']);

      expect(result!.rating).toBe(8);
      expect(result!.summary).toBe('Clean solution using hash map.');
    });

    it('should clamp rating to 1-10', async () => {
      const badRating = { ...validReview, rating: 15 };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(badRating) } }],
        }),
      });

      const result = await reviewCode('Two Sum', 'easy', 'code', 'js', []);

      expect(result!.rating).toBe(10);
    });

    it('should clamp rating minimum to 1', async () => {
      const lowRating = { ...validReview, rating: -5 };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(lowRating) } }],
        }),
      });

      const result = await reviewCode('Two Sum', 'easy', 'code', 'js', []);

      expect(result!.rating).toBe(1);
    });

    it('should return null when summary is missing', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({ rating: 5 }) } }],
        }),
      });

      const result = await reviewCode('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
    });

    it('should default invalid severity to suggestion', async () => {
      const badSeverity = {
        ...validReview,
        issues: [{ severity: 'invalid', description: 'test', fix: 'test' }],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(badSeverity) } }],
        }),
      });

      const result = await reviewCode('Two Sum', 'easy', 'code', 'js', []);

      expect(result!.issues[0].severity).toBe('suggestion');
    });

    it('should return null on API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Error'),
      });

      const result = await reviewCode('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
    });

    it('should return null on fetch exception', async () => {
      mockFetch.mockRejectedValue(new Error('Network'));

      const result = await reviewCode('Two Sum', 'easy', 'code', 'js', []);

      expect(result).toBeNull();
    });

    it('should limit issues to 8', async () => {
      const manyIssues = {
        ...validReview,
        issues: Array(12).fill(validReview.issues[0]),
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(manyIssues) } }],
        }),
      });

      const result = await reviewCode('Two Sum', 'easy', 'code', 'js', []);

      expect(result!.issues).toHaveLength(8);
    });
  });
});
