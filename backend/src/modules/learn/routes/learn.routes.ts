import { Router } from 'express';
import { learnController } from '../controller/learn.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { askAISchema } from '../validation/learn.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/ask-ai', validate(askAISchema), asyncHandler(learnController.askAI as any));

export default router;
