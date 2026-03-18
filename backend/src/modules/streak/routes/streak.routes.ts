import { Router } from 'express';
import { streakController } from '../controller/streak.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);
router.get('/', asyncHandler(streakController.getStreak as any));

export default router;
