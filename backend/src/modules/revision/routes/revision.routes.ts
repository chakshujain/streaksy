import { Router } from 'express';
import { revisionController } from '../controller/revision.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createRevisionSchema, generateAISchema } from '../validation/revision.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(revisionController.list));
router.get('/quiz', asyncHandler(revisionController.quiz));
router.get('/:problemId', asyncHandler(revisionController.getByProblem));
router.post('/', validate(createRevisionSchema), asyncHandler(revisionController.createOrUpdate));
router.post('/generate', validate(generateAISchema), asyncHandler(revisionController.generateAI));
router.post('/hints', validate(generateAISchema), asyncHandler(revisionController.getHints));
router.post('/explain', validate(generateAISchema), asyncHandler(revisionController.getExplanation));
router.post('/review', validate(generateAISchema), asyncHandler(revisionController.getCodeReview));
router.patch('/:id/revised', asyncHandler(revisionController.markRevised));
router.delete('/:id', asyncHandler(revisionController.delete));

export default router;
