import { z } from 'zod';

export const createRevisionSchema = z.object({
  problemId: z.string().uuid(),
  keyTakeaway: z.string().min(1).max(5000),
  approach: z.string().max(5000).optional(),
  timeComplexity: z.string().max(50).optional(),
  spaceComplexity: z.string().max(50).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  difficultyRating: z.enum(['easy', 'medium', 'hard']).optional(),
  intuition: z.string().max(5000).optional(),
  pointsToRemember: z.array(z.string().max(500)).max(5).optional(),
  aiGenerated: z.boolean().optional(),
});

export const generateAISchema = z.object({
  problemId: z.string().uuid(),
});

export const listRevisionsSchema = z.object({
  tag: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
});

export const quizSchema = z.object({
  count: z.coerce.number().min(1).max(50).optional(),
});
