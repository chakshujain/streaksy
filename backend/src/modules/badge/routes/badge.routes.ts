import { Router } from 'express';
import { badgeController } from '../controller/badge.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(badgeController.list));
router.get('/mine', asyncHandler(badgeController.getUserBadges));

export default router;
