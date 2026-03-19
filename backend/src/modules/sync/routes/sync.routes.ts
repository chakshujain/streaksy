import { Router } from 'express';
import { syncController } from '../controller/sync.controller';
import { submissionController } from '../controller/submission.controller';
import { validate } from '../../../middleware/validate';
import { syncLeetcodeSchema } from '../validation/sync.schema';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

// Sync endpoint — extension sends JWT
router.post(
  '/leetcode',
  authenticate,
  validate(syncLeetcodeSchema),
  asyncHandler(syncController.syncLeetcode)
);

// Submission history endpoints
router.get('/submissions', authenticate, asyncHandler(submissionController.getMySubmissions));
router.get('/submissions/stats', authenticate, asyncHandler(submissionController.getStats));
router.get('/submissions/:problemId', authenticate, asyncHandler(submissionController.getForProblem));

export default router;
