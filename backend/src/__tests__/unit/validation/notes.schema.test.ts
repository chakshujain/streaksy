import { createNoteSchema, updateNoteSchema } from '../../../modules/notes/validation/notes.schema';

describe('notes validation schemas', () => {
  describe('createNoteSchema', () => {
    it('should accept valid personal note', () => {
      const result = createNoteSchema.safeParse({
        problemId: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Use hash map approach',
        visibility: 'personal',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid group note', () => {
      const result = createNoteSchema.safeParse({
        problemId: '550e8400-e29b-41d4-a716-446655440000',
        content: 'DP solution',
        visibility: 'group',
        groupId: '550e8400-e29b-41d4-a716-446655440001',
      });
      expect(result.success).toBe(true);
    });

    it('should default visibility to personal', () => {
      const result = createNoteSchema.safeParse({
        problemId: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Some notes',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.visibility).toBe('personal');
      }
    });

    it('should reject invalid visibility', () => {
      const result = createNoteSchema.safeParse({
        problemId: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Notes',
        visibility: 'public',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid problemId', () => {
      const result = createNoteSchema.safeParse({
        problemId: 'not-a-uuid',
        content: 'Notes',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty content', () => {
      const result = createNoteSchema.safeParse({
        problemId: '550e8400-e29b-41d4-a716-446655440000',
        content: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject content exceeding 10000 chars', () => {
      const result = createNoteSchema.safeParse({
        problemId: '550e8400-e29b-41d4-a716-446655440000',
        content: 'x'.repeat(10001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateNoteSchema', () => {
    it('should accept valid update', () => {
      const result = updateNoteSchema.safeParse({ content: 'Updated content' });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const result = updateNoteSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });
  });
});
