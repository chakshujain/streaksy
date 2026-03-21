import { Router } from 'express';
import { progressController } from '../controller/progress.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { validate } from '../../../middleware/validate';
import { z } from 'zod';

const updateStatusSchema = z.object({
  problemId: z.string().uuid(),
  status: z.enum(['not_started', 'attempted', 'solved']),
});

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(progressController.getUserProgress as any));
router.get('/sheet/:sheetSlug', asyncHandler(progressController.getSheetProgress as any));
router.put('/status', validate(updateStatusSchema), asyncHandler(progressController.updateStatus as any));

export default router;
