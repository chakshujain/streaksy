import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import { validate } from '../../../middleware/validate';
import { authenticate } from '../../../middleware/auth';
import { signupSchema, loginSchema, connectLeetcodeSchema } from '../validation/auth.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post(
  '/connect-leetcode',
  authenticate,
  validate(connectLeetcodeSchema),
  asyncHandler(authController.connectLeetcode)
);

export default router;
