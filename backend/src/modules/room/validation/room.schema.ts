import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  problemId: z.string().uuid().optional(),
  problemIds: z.array(z.string().uuid()).optional(),
  sheetId: z.string().uuid().optional(),
  scheduledAt: z.string().optional(),
  mode: z.enum(['single', 'multi']).optional(),
  timeLimitMinutes: z.number().int().min(5).max(120).optional(),
});

export const joinRoomSchema = z.object({
  code: z.string().min(1).max(8),
});

export const solveRoomSchema = z.object({
  code: z.string().max(50000).optional(),
  language: z.string().max(30).optional(),
  runtimeMs: z.number().int().nonnegative().optional(),
  memoryKb: z.number().int().nonnegative().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});
