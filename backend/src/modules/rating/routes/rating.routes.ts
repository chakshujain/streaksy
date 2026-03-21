import { Router } from 'express';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { ratingController } from '../controller/rating.controller';
import { rateSchema, reportCompanySchema } from '../validation/rating.schema';

const router = Router();
router.use(authenticate);

router.post('/', validate(rateSchema), asyncHandler(ratingController.rate));
router.get('/companies', asyncHandler(ratingController.listCompanyTags));
router.get('/:problemId', asyncHandler(ratingController.getStats));
router.get('/:problemId/mine', asyncHandler(ratingController.getUserRating));
router.get('/:problemId/companies', asyncHandler(ratingController.getCompanyTags));
router.post('/:problemId/companies', validate(reportCompanySchema), asyncHandler(ratingController.reportCompanyTag));

export default router;
