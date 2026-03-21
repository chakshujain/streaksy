import { z } from 'zod';

export const rateSchema = z.object({
  problemId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
});

export const reportCompanySchema = z.object({
  companyTagId: z.string().uuid(),
});
