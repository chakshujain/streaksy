import { Router } from 'express';
import { activityController } from '../controller/activity.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/:id/activity', asyncHandler(activityController.getGroupActivity));

export default router;
