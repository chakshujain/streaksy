import { Router } from 'express';
import { prepController } from '../controller/prep.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/', asyncHandler(prepController.create));
router.get('/active', asyncHandler(prepController.getActive));
router.get('/share/:code', asyncHandler(prepController.getByShareCode));
router.get('/:id', asyncHandler(prepController.getById));
router.put('/:id/progress', asyncHandler(prepController.updateProgress));
router.get('/:id/progress', asyncHandler(prepController.getProgress));
router.post('/:id/link-group', asyncHandler(prepController.linkGroup));
router.get('/:id/leaderboard', asyncHandler(prepController.getLeaderboard));

export default router;
