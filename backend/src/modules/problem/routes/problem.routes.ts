import { Router } from 'express';
import { problemController } from '../controller/problem.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(problemController.list));
router.get('/sheets', asyncHandler(problemController.getSheets));
router.get('/sheets/:slug', asyncHandler(problemController.getSheetProblems));
router.get('/search', asyncHandler(problemController.search as any));
router.get('/:slug', asyncHandler(problemController.getBySlug));

export default router;
