import { z } from 'zod';

export const createNoteSchema = z.object({
  problemId: z.string().uuid(),
  content: z.string().min(1).max(10000),
  visibility: z.enum(['personal', 'group']).default('personal'),
  groupId: z.string().uuid().optional(),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1).max(10000),
});
