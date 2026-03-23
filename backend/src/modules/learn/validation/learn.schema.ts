import { z } from 'zod';

export const askAISchema = z.object({
  topic: z.string().min(1).max(100),
  lesson: z.string().min(1).max(200),
  question: z.string().min(3).max(500),
});
