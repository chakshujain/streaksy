import { z } from 'zod';

export const syncLeetcodeSchema = z.object({
  userId: z.string().uuid(),
  problemSlug: z.string().min(1),
  status: z.enum(['solved', 'attempted']),
});
