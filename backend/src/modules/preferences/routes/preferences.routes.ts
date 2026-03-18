import { Router } from 'express';
import { preferencesController } from '../controller/preferences.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { updatePreferencesSchema } from '../validation/preferences.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(preferencesController.get as any));
router.put('/', validate(updatePreferencesSchema), asyncHandler(preferencesController.update as any));

export default router;
