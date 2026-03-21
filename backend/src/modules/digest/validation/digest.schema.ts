import { z } from 'zod';

export const digestPrefsSchema = z.object({
  digest_enabled: z.boolean().optional(),
  digest_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  digest_frequency: z.enum(['daily', 'weekly', 'off']).optional(),
  evening_reminder: z.boolean().optional(),
  weekly_report: z.boolean().optional(),
});
