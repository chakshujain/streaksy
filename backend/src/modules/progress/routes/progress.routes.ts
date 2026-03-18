import { Router } from 'express';
import { progressController } from '../controller/progress.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(progressController.getUserProgress as any));
router.get('/sheet/:sheetSlug', asyncHandler(progressController.getSheetProgress as any));

export default router;
