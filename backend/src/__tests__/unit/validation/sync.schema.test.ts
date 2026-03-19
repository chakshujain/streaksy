import { syncLeetcodeSchema } from '../../../modules/sync/validation/sync.schema';

describe('sync validation schemas', () => {
  describe('syncLeetcodeSchema', () => {
    it('should accept valid solved sync', () => {
      const result = syncLeetcodeSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        problemSlug: 'two-sum',
        status: 'solved',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid attempted sync', () => {
      const result = syncLeetcodeSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        problemSlug: 'three-sum',
        status: 'attempted',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const result = syncLeetcodeSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        problemSlug: 'two-sum',
        status: 'not_started',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid userId', () => {
      const result = syncLeetcodeSchema.safeParse({
        userId: 'not-a-uuid',
        problemSlug: 'two-sum',
        status: 'solved',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty problemSlug', () => {
      const result = syncLeetcodeSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        problemSlug: '',
        status: 'solved',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = syncLeetcodeSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
