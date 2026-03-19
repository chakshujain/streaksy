import { z } from 'zod';

export const pokeSchema = z.object({
  toUserId: z.string().uuid(),
  groupId: z.string().uuid().optional(),
  message: z.string().max(500).optional(),
});
