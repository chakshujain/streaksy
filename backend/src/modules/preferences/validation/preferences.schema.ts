import { z } from 'zod';

export const updatePreferencesSchema = z.object({
  theme: z.string().max(20).optional(),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional(),
  dashboard_layout: z.string().max(20).optional(),
  show_streak_animation: z.boolean().optional(),
  show_heatmap: z.boolean().optional(),
  weekly_goal: z.number().int().min(1).max(100).optional(),
});
