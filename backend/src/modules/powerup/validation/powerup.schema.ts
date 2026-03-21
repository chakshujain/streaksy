import { z } from 'zod';

export const purchaseSchema = z.object({
  type: z.enum(['streak_freeze', 'double_xp', 'streak_shield']),
});
