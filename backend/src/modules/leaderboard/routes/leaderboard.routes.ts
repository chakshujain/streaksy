import { Router } from 'express';
import { leaderboardController } from '../controller/leaderboard.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);
router.get('/group/:groupId', asyncHandler(leaderboardController.getGroupLeaderboard as any));

export default router;
