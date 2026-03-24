import { createRoomSchema, joinRoomSchema, solveRoomSchema, sendMessageSchema } from '../../../modules/room/validation/room.schema';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('room validation schemas', () => {
  describe('createRoomSchema', () => {
    it('should accept valid room with only name', () => {
      const result = createRoomSchema.safeParse({ name: 'My Room' });
      expect(result.success).toBe(true);
    });

    it('should accept valid room with all fields', () => {
      const result = createRoomSchema.safeParse({
        name: 'Contest Room',
        problemId: validUUID,
        problemIds: [validUUID, '660e8400-e29b-41d4-a716-446655440001'],
        sheetId: validUUID,
        scheduledAt: '2026-04-01T10:00:00Z',
        mode: 'multi',
        timeLimitMinutes: 60,
        recurrence: 'weekly',
        meetLink: 'https://meet.google.com/abc-defg-hij',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = createRoomSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject name exceeding 100 chars', () => {
      const result = createRoomSchema.safeParse({ name: 'x'.repeat(101) });
      expect(result.success).toBe(false);
    });

    it('should accept name at exactly 100 chars', () => {
      const result = createRoomSchema.safeParse({ name: 'x'.repeat(100) });
      expect(result.success).toBe(true);
    });

    it('should reject missing name', () => {
      const result = createRoomSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid problemId', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', problemId: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid in problemIds array', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', problemIds: ['bad-id'] });
      expect(result.success).toBe(false);
    });

    it('should reject non-uuid sheetId', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', sheetId: '123' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid mode enum', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', mode: 'practice' });
      expect(result.success).toBe(false);
    });

    it('should accept mode single', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', mode: 'single' });
      expect(result.success).toBe(true);
    });

    it('should reject timeLimitMinutes below 5', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', timeLimitMinutes: 4 });
      expect(result.success).toBe(false);
    });

    it('should reject timeLimitMinutes above 120', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', timeLimitMinutes: 121 });
      expect(result.success).toBe(false);
    });

    it('should reject non-integer timeLimitMinutes', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', timeLimitMinutes: 10.5 });
      expect(result.success).toBe(false);
    });

    it('should reject string timeLimitMinutes', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', timeLimitMinutes: '30' });
      expect(result.success).toBe(false);
    });

    it('should accept timeLimitMinutes at boundaries', () => {
      expect(createRoomSchema.safeParse({ name: 'R', timeLimitMinutes: 5 }).success).toBe(true);
      expect(createRoomSchema.safeParse({ name: 'R', timeLimitMinutes: 120 }).success).toBe(true);
    });

    it('should reject invalid recurrence enum', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', recurrence: 'yearly' });
      expect(result.success).toBe(false);
    });

    it('should accept all valid recurrence values', () => {
      for (const r of ['daily', 'weekdays', 'weekends', 'weekly', 'monthly']) {
        expect(createRoomSchema.safeParse({ name: 'R', recurrence: r }).success).toBe(true);
      }
    });

    it('should reject invalid meetLink URL', () => {
      const result = createRoomSchema.safeParse({ name: 'Room', meetLink: 'not-a-url' });
      expect(result.success).toBe(false);
    });

    it('should reject meetLink exceeding 500 chars', () => {
      const result = createRoomSchema.safeParse({
        name: 'Room',
        meetLink: 'https://example.com/' + 'a'.repeat(500),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('joinRoomSchema', () => {
    it('should accept valid code', () => {
      const result = joinRoomSchema.safeParse({ code: 'ABC123' });
      expect(result.success).toBe(true);
    });

    it('should accept code at 1 char', () => {
      const result = joinRoomSchema.safeParse({ code: 'A' });
      expect(result.success).toBe(true);
    });

    it('should accept code at 8 chars', () => {
      const result = joinRoomSchema.safeParse({ code: 'ABCDEFGH' });
      expect(result.success).toBe(true);
    });

    it('should reject empty code', () => {
      const result = joinRoomSchema.safeParse({ code: '' });
      expect(result.success).toBe(false);
    });

    it('should reject code exceeding 8 chars', () => {
      const result = joinRoomSchema.safeParse({ code: 'ABCDEFGHI' });
      expect(result.success).toBe(false);
    });

    it('should reject missing code', () => {
      const result = joinRoomSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject non-string code', () => {
      const result = joinRoomSchema.safeParse({ code: 12345 });
      expect(result.success).toBe(false);
    });
  });

  describe('solveRoomSchema', () => {
    it('should accept valid solve data', () => {
      const result = solveRoomSchema.safeParse({
        code: 'console.log("hello")',
        language: 'javascript',
        runtimeMs: 50,
        memoryKb: 1024,
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty object (all optional)', () => {
      const result = solveRoomSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should reject code exceeding 50000 chars', () => {
      const result = solveRoomSchema.safeParse({ code: 'x'.repeat(50001) });
      expect(result.success).toBe(false);
    });

    it('should accept code at exactly 50000 chars', () => {
      const result = solveRoomSchema.safeParse({ code: 'x'.repeat(50000) });
      expect(result.success).toBe(true);
    });

    it('should reject language exceeding 30 chars', () => {
      const result = solveRoomSchema.safeParse({ language: 'a'.repeat(31) });
      expect(result.success).toBe(false);
    });

    it('should reject negative runtimeMs', () => {
      const result = solveRoomSchema.safeParse({ runtimeMs: -1 });
      expect(result.success).toBe(false);
    });

    it('should accept zero runtimeMs', () => {
      const result = solveRoomSchema.safeParse({ runtimeMs: 0 });
      expect(result.success).toBe(true);
    });

    it('should reject non-integer runtimeMs', () => {
      const result = solveRoomSchema.safeParse({ runtimeMs: 1.5 });
      expect(result.success).toBe(false);
    });

    it('should reject negative memoryKb', () => {
      const result = solveRoomSchema.safeParse({ memoryKb: -10 });
      expect(result.success).toBe(false);
    });

    it('should reject string runtimeMs', () => {
      const result = solveRoomSchema.safeParse({ runtimeMs: '50' });
      expect(result.success).toBe(false);
    });
  });

  describe('sendMessageSchema', () => {
    it('should accept valid message', () => {
      const result = sendMessageSchema.safeParse({ content: 'Hello!' });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const result = sendMessageSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('should reject content exceeding 2000 chars', () => {
      const result = sendMessageSchema.safeParse({ content: 'x'.repeat(2001) });
      expect(result.success).toBe(false);
    });

    it('should accept content at exactly 2000 chars', () => {
      const result = sendMessageSchema.safeParse({ content: 'x'.repeat(2000) });
      expect(result.success).toBe(true);
    });

    it('should reject missing content', () => {
      const result = sendMessageSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
