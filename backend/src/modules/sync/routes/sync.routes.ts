import { Router } from 'express';
import { syncController } from '../controller/sync.controller';
import { validate } from '../../../middleware/validate';
import { syncLeetcodeSchema } from '../validation/sync.schema';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

// Sync endpoint is authenticated — the extension sends the JWT
router.post(
  '/leetcode',
  authenticate,
  validate(syncLeetcodeSchema),
  asyncHandler(syncController.syncLeetcode)
);

export default router;
