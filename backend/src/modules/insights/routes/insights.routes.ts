import { Router } from 'express';
import { insightsController } from '../controller/insights.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/overview', asyncHandler(insightsController.getOverview as any));
router.get('/weekly', asyncHandler(insightsController.getWeekly as any));
router.get('/tags', asyncHandler(insightsController.getTags as any));
router.get('/difficulty-trend', asyncHandler(insightsController.getDifficultyTrend as any));

export default router;
