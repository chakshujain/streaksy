import { Router } from 'express';
import { dailyController } from '../controller/daily.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(dailyController.getDailyProblems));

export default router;
