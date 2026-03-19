import { Router } from 'express';
import { contestController } from '../controller/contest.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createContestSchema, submitContestSchema } from '../validation/contest.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

// Group-scoped contest routes
router.post('/:id/contests', validate(createContestSchema), asyncHandler(contestController.create));
router.get('/:id/contests', asyncHandler(contestController.getForGroup));

// Contest-scoped routes
router.get('/:id', asyncHandler(contestController.getDetails));
router.post('/:id/submit', validate(submitContestSchema), asyncHandler(contestController.submit));

export default router;
