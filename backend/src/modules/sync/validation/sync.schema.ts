import { z } from 'zod';

export const syncLeetcodeSchema = z.object({
  problemSlug: z.string().min(1),
  status: z.enum(['solved', 'attempted']),
  // New fields from enhanced extension
  language: z.string().max(30).optional(),
  code: z.string().max(50000).optional(),
  runtimeMs: z.number().int().nonnegative().optional(),
  runtimePercentile: z.number().min(0).max(100).optional(),
  memoryKb: z.number().int().nonnegative().optional(),
  memoryPercentile: z.number().min(0).max(100).optional(),
  timeSpentSeconds: z.number().int().nonnegative().optional(),
  leetcodeSubmissionId: z.string().max(50).optional(),
});
