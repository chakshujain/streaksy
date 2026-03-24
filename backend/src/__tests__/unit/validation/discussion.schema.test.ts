import { createCommentSchema, updateCommentSchema } from '../../../modules/discussion/validation/discussion.schema';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('discussion validation schemas', () => {
  describe('createCommentSchema', () => {
    it('should accept valid comment without parentId', () => {
      const result = createCommentSchema.safeParse({ content: 'This is a great approach!' });
      expect(result.success).toBe(true);
    });

    it('should accept valid comment with parentId', () => {
      const result = createCommentSchema.safeParse({
        content: 'I agree with this',
        parentId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 1 char', () => {
      const result = createCommentSchema.safeParse({ content: 'x' });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 5000 chars', () => {
      const result = createCommentSchema.safeParse({ content: 'x'.repeat(5000) });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const result = createCommentSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('should reject content exceeding 5000 chars', () => {
      const result = createCommentSchema.safeParse({ content: 'x'.repeat(5001) });
      expect(result.success).toBe(false);
    });

    it('should reject missing content', () => {
      const result = createCommentSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid parentId', () => {
      const result = createCommentSchema.safeParse({
        content: 'Reply',
        parentId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-string content', () => {
      const result = createCommentSchema.safeParse({ content: 42 });
      expect(result.success).toBe(false);
    });

    it('should reject non-string parentId', () => {
      const result = createCommentSchema.safeParse({ content: 'OK', parentId: 123 });
      expect(result.success).toBe(false);
    });
  });

  describe('updateCommentSchema', () => {
    it('should accept valid update', () => {
      const result = updateCommentSchema.safeParse({ content: 'Updated comment' });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 1 char', () => {
      const result = updateCommentSchema.safeParse({ content: 'x' });
      expect(result.success).toBe(true);
    });

    it('should accept content at exactly 5000 chars', () => {
      const result = updateCommentSchema.safeParse({ content: 'x'.repeat(5000) });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const result = updateCommentSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('should reject content exceeding 5000 chars', () => {
      const result = updateCommentSchema.safeParse({ content: 'x'.repeat(5001) });
      expect(result.success).toBe(false);
    });

    it('should reject missing content', () => {
      const result = updateCommentSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
