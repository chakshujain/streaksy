import { Router } from 'express';
import passport from 'passport';
import { authController, avatarUpload } from '../controller/auth.controller';
import { validate } from '../../../middleware/validate';
import { authenticate } from '../../../middleware/auth';
import {
  signupSchema, loginSchema, connectLeetcodeSchema,
  forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, changePasswordSchema, updateProfileSchema,
} from '../validation/auth.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { env } from '../../../config/env';
import { authService } from '../service/auth.service';

const router = Router();

// Public routes
router.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(authController.resetPassword));
router.post('/verify-email', validate(verifyEmailSchema), asyncHandler(authController.verifyEmail));

// Authenticated routes
router.post(
  '/connect-leetcode',
  authenticate,
  validate(connectLeetcodeSchema),
  asyncHandler(authController.connectLeetcode)
);
router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(authController.changePassword));
router.post('/resend-verification', authenticate, asyncHandler(authController.resendVerification));
router.get('/profile', authenticate, asyncHandler(authController.getProfile));
router.put('/profile', authenticate, validate(updateProfileSchema), asyncHandler(authController.updateProfile));
router.post('/avatar', authenticate, avatarUpload.single('avatar'), asyncHandler(authController.uploadAvatar));
router.get('/export', authenticate, asyncHandler(authController.exportData));
router.get('/user/:userId', authenticate, asyncHandler(authController.getPublicProfile));

// Google OAuth
router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${env.frontendUrl}/auth/login?error=google_failed` }),
  (req, res) => {
    const user = req.user as any;
    const token = authService.generateToken(user.id, user.email);
    res.redirect(`${env.frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, displayName: user.display_name }))}`);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { session: false, scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${env.frontendUrl}/auth/login?error=github_failed` }),
  (req, res) => {
    const user = req.user as any;
    const token = authService.generateToken(user.id, user.email);
    res.redirect(`${env.frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, displayName: user.display_name }))}`);
  }
);

export default router;
