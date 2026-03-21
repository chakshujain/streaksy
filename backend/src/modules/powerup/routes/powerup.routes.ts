import { Router } from 'express';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { powerupController } from '../controller/powerup.controller';
import { purchaseSchema } from '../validation/powerup.schema';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(powerupController.getInventory));
router.get('/log', asyncHandler(powerupController.getLog));
router.get('/costs', asyncHandler(powerupController.getCosts));
router.post('/purchase', validate(purchaseSchema), asyncHandler(powerupController.purchase));
router.post('/freeze', asyncHandler(powerupController.useFreeze));

export default router;
