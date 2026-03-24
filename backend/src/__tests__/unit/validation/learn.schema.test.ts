import { askAISchema } from '../../../modules/learn/validation/learn.schema';

describe('learn validation schemas', () => {
  describe('askAISchema', () => {
    it('should accept valid data', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'SQL Joins',
        question: 'What is the difference between INNER and LEFT join?',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing topic', () => {
      const result = askAISchema.safeParse({
        lesson: 'SQL Joins',
        question: 'What is a join?',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing lesson', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        question: 'What is a join?',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing question', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'SQL Joins',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty topic', () => {
      const result = askAISchema.safeParse({
        topic: '',
        lesson: 'SQL Joins',
        question: 'What is a join?',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty lesson', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: '',
        question: 'What is a join?',
      });
      expect(result.success).toBe(false);
    });

    it('should reject question shorter than 3 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'SQL Joins',
        question: 'Hi',
      });
      expect(result.success).toBe(false);
    });

    it('should accept question at exactly 3 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'SQL Joins',
        question: 'Why',
      });
      expect(result.success).toBe(true);
    });

    it('should reject topic exceeding 100 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'x'.repeat(101),
        lesson: 'SQL Joins',
        question: 'What is this?',
      });
      expect(result.success).toBe(false);
    });

    it('should accept topic at exactly 100 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'x'.repeat(100),
        lesson: 'SQL Joins',
        question: 'What is this?',
      });
      expect(result.success).toBe(true);
    });

    it('should reject lesson exceeding 200 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'x'.repeat(201),
        question: 'What is this?',
      });
      expect(result.success).toBe(false);
    });

    it('should accept lesson at exactly 200 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'x'.repeat(200),
        question: 'What is this?',
      });
      expect(result.success).toBe(true);
    });

    it('should reject question exceeding 500 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'SQL Joins',
        question: 'x'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('should accept question at exactly 500 chars', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'SQL Joins',
        question: 'x'.repeat(500),
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-string topic', () => {
      const result = askAISchema.safeParse({
        topic: 123,
        lesson: 'SQL Joins',
        question: 'What is this?',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-string lesson', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: true,
        question: 'What is this?',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-string question', () => {
      const result = askAISchema.safeParse({
        topic: 'databases',
        lesson: 'SQL Joins',
        question: 42,
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty object', () => {
      const result = askAISchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
