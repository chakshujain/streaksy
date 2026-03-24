import { feedCommentSchema, feedPostSchema } from '../../../modules/feed/validation/feed.schema';

describe('feed validation schemas', () => {
  describe('feedCommentSchema', () => {
    it('should accept valid comment', () => {
      const result = feedCommentSchema.safeParse({ content: 'Great job!' });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 1 char', () => {
      const result = feedCommentSchema.safeParse({ content: 'x' });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 500 chars', () => {
      const result = feedCommentSchema.safeParse({ content: 'x'.repeat(500) });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const result = feedCommentSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('should reject content exceeding 500 chars', () => {
      const result = feedCommentSchema.safeParse({ content: 'x'.repeat(501) });
      expect(result.success).toBe(false);
    });

    it('should reject missing content', () => {
      const result = feedCommentSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject non-string content', () => {
      const result = feedCommentSchema.safeParse({ content: 123 });
      expect(result.success).toBe(false);
    });
  });

  describe('feedPostSchema', () => {
    it('should accept valid post', () => {
      const result = feedPostSchema.safeParse({ content: 'Just solved my first hard problem!' });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 1 char', () => {
      const result = feedPostSchema.safeParse({ content: 'a' });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 500 chars', () => {
      const result = feedPostSchema.safeParse({ content: 'a'.repeat(500) });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const result = feedPostSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('should reject content exceeding 500 chars', () => {
      const result = feedPostSchema.safeParse({ content: 'a'.repeat(501) });
      expect(result.success).toBe(false);
    });

    it('should reject missing content', () => {
      const result = feedPostSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject non-string content', () => {
      const result = feedPostSchema.safeParse({ content: true });
      expect(result.success).toBe(false);
    });
  });
});
