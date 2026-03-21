import { syncLeetcodeSchema } from '../../../modules/sync/validation/sync.schema';

describe('sync validation schemas', () => {
  describe('syncLeetcodeSchema', () => {
    it('should accept valid solved sync', () => {
      const result = syncLeetcodeSchema.safeParse({
        problemSlug: 'two-sum',
        status: 'solved',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid attempted sync', () => {
      const result = syncLeetcodeSchema.safeParse({
        problemSlug: 'three-sum',
        status: 'attempted',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const result = syncLeetcodeSchema.safeParse({
        problemSlug: 'two-sum',
        status: 'not_started',
      });
      expect(result.success).toBe(false);
    });

    it('should accept extra fields (userId is ignored, comes from JWT)', () => {
      const result = syncLeetcodeSchema.safeParse({
        userId: 'not-a-uuid',
        problemSlug: 'two-sum',
        status: 'solved',
      });
      // userId is no longer in the schema — extra fields are stripped by Zod
      expect(result.success).toBe(true);
    });

    it('should reject empty problemSlug', () => {
      const result = syncLeetcodeSchema.safeParse({
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
