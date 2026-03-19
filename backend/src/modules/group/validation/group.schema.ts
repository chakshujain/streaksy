import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().min(1),
});

export const updatePlanSchema = z.object({
  plan: z.string().max(2000).optional(),
  objective: z.string().max(255).optional(),
  targetDate: z.string().optional(),
});

export const assignSheetSchema = z.object({
  sheetId: z.string().uuid(),
});
