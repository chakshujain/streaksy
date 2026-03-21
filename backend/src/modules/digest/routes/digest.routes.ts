import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { digestController } from '../controller/digest.controller';
import { digestPrefsSchema } from '../validation/digest.schema';
import { AppError } from '../../../common/errors/AppError';

// Admin-only middleware: only allow requests with a matching admin secret header
function requireAdminSecret(req: Request, _res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers['x-admin-secret'] !== secret) {
    throw AppError.forbidden('Admin access required');
  }
  next();
}

const router = Router();
router.use(authenticate);

router.get('/preferences', asyncHandler(digestController.getPreferences));
router.put('/preferences', validate(digestPrefsSchema), asyncHandler(digestController.updatePreferences));
router.post('/trigger/morning', requireAdminSecret, asyncHandler(digestController.triggerMorning));
router.post('/trigger/evening', requireAdminSecret, asyncHandler(digestController.triggerEvening));
router.post('/trigger/weekly', requireAdminSecret, asyncHandler(digestController.triggerWeekly));
router.post('/preview', asyncHandler(digestController.preview));

export default router;
