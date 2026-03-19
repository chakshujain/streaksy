import { z } from 'zod';

export const createContestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  problemIds: z.array(z.string().uuid()).optional(),
});

export const submitContestSchema = z.object({
  problemId: z.string().uuid(),
});
