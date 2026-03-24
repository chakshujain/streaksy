import { createRevisionSchema, generateAISchema, listRevisionsSchema, quizSchema } from '../../../modules/revision/validation/revision.schema';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('revision validation schemas', () => {
  describe('createRevisionSchema', () => {
    it('should accept valid revision with required fields only', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'Use two pointers to solve in O(n)',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid revision with all fields', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'Two pointer approach',
        approach: 'Sort first then use two pointers',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        tags: ['two-pointers', 'sorting'],
        difficultyRating: 'medium',
        intuition: 'After sorting, duplicates are adjacent',
        pointsToRemember: ['Edge case: empty array', 'Handle duplicates'],
        aiGenerated: false,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing problemId', () => {
      const result = createRevisionSchema.safeParse({
        keyTakeaway: 'Some takeaway',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing keyTakeaway', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid problemId', () => {
      const result = createRevisionSchema.safeParse({
        problemId: 'not-a-uuid',
        keyTakeaway: 'Takeaway',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty keyTakeaway', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject keyTakeaway exceeding 5000 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'x'.repeat(5001),
      });
      expect(result.success).toBe(false);
    });

    it('should accept keyTakeaway at exactly 5000 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'x'.repeat(5000),
      });
      expect(result.success).toBe(true);
    });

    it('should reject approach exceeding 5000 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        approach: 'x'.repeat(5001),
      });
      expect(result.success).toBe(false);
    });

    it('should reject timeComplexity exceeding 50 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        timeComplexity: 'x'.repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it('should reject spaceComplexity exceeding 50 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        spaceComplexity: 'x'.repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it('should reject tags with more than 10 items', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
      });
      expect(result.success).toBe(false);
    });

    it('should accept tags with exactly 10 items', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        tags: Array.from({ length: 10 }, (_, i) => `tag${i}`),
      });
      expect(result.success).toBe(true);
    });

    it('should reject tag exceeding 50 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        tags: ['x'.repeat(51)],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid difficultyRating enum', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        difficultyRating: 'extreme',
      });
      expect(result.success).toBe(false);
    });

    it('should accept all valid difficultyRating values', () => {
      for (const d of ['easy', 'medium', 'hard']) {
        const result = createRevisionSchema.safeParse({
          problemId: validUUID,
          keyTakeaway: 'OK',
          difficultyRating: d,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should reject intuition exceeding 5000 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        intuition: 'x'.repeat(5001),
      });
      expect(result.success).toBe(false);
    });

    it('should reject pointsToRemember with more than 5 items', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        pointsToRemember: ['a', 'b', 'c', 'd', 'e', 'f'],
      });
      expect(result.success).toBe(false);
    });

    it('should reject pointsToRemember item exceeding 500 chars', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        pointsToRemember: ['x'.repeat(501)],
      });
      expect(result.success).toBe(false);
    });

    it('should accept pointsToRemember at limits', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        pointsToRemember: Array.from({ length: 5 }, () => 'x'.repeat(500)),
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-boolean aiGenerated', () => {
      const result = createRevisionSchema.safeParse({
        problemId: validUUID,
        keyTakeaway: 'OK',
        aiGenerated: 'true',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('generateAISchema', () => {
    it('should accept valid UUID', () => {
      const result = generateAISchema.safeParse({ problemId: validUUID });
      expect(result.success).toBe(true);
    });

    it('should reject missing problemId', () => {
      const result = generateAISchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid problemId', () => {
      const result = generateAISchema.safeParse({ problemId: 'abc' });
      expect(result.success).toBe(false);
    });
  });

  describe('listRevisionsSchema', () => {
    it('should accept empty object (all optional)', () => {
      const result = listRevisionsSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should accept valid filters', () => {
      const result = listRevisionsSchema.safeParse({
        tag: 'dp',
        difficulty: 'hard',
        limit: '50',
        offset: '0',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid difficulty enum', () => {
      const result = listRevisionsSchema.safeParse({ difficulty: 'insane' });
      expect(result.success).toBe(false);
    });

    it('should reject limit below 1', () => {
      const result = listRevisionsSchema.safeParse({ limit: '0' });
      expect(result.success).toBe(false);
    });

    it('should reject limit above 100', () => {
      const result = listRevisionsSchema.safeParse({ limit: '101' });
      expect(result.success).toBe(false);
    });

    it('should reject negative offset', () => {
      const result = listRevisionsSchema.safeParse({ offset: '-1' });
      expect(result.success).toBe(false);
    });
  });

  describe('quizSchema', () => {
    it('should accept empty object', () => {
      const result = quizSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should accept valid count', () => {
      const result = quizSchema.safeParse({ count: '10' });
      expect(result.success).toBe(true);
    });

    it('should reject count below 1', () => {
      const result = quizSchema.safeParse({ count: '0' });
      expect(result.success).toBe(false);
    });

    it('should reject count above 50', () => {
      const result = quizSchema.safeParse({ count: '51' });
      expect(result.success).toBe(false);
    });
  });
});
