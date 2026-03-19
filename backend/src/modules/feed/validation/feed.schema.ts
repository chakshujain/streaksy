import { z } from 'zod';

export const feedCommentSchema = z.object({
  content: z.string().min(1).max(500),
});
