import { createGroupSchema, joinGroupSchema } from '../../../modules/group/validation/group.schema';

describe('group validation schemas', () => {
  describe('createGroupSchema', () => {
    it('should accept valid group data', () => {
      const result = createGroupSchema.safeParse({
        name: 'My Study Group',
        description: 'A great group',
      });
      expect(result.success).toBe(true);
    });

    it('should accept group without description', () => {
      const result = createGroupSchema.safeParse({
        name: 'My Study Group',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = createGroupSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject name exceeding 255 chars', () => {
      const result = createGroupSchema.safeParse({ name: 'x'.repeat(256) });
      expect(result.success).toBe(false);
    });

    it('should reject description exceeding 1000 chars', () => {
      const result = createGroupSchema.safeParse({
        name: 'Group',
        description: 'x'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('joinGroupSchema', () => {
    it('should accept valid invite code', () => {
      const result = joinGroupSchema.safeParse({ inviteCode: 'abc123def456' });
      expect(result.success).toBe(true);
    });

    it('should reject empty invite code', () => {
      const result = joinGroupSchema.safeParse({ inviteCode: '' });
      expect(result.success).toBe(false);
    });

    it('should reject missing invite code', () => {
      const result = joinGroupSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
