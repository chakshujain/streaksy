import { Router } from 'express';
import { inviteController } from '../controller/invite.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

// Public endpoints — no auth required (for invite preview pages)
router.get('/group/:code', asyncHandler(inviteController.resolveGroup));
router.get('/room/:code', asyncHandler(inviteController.resolveRoom));

// Authenticated endpoints — join via invite
router.post('/group/:code/join', authenticate, asyncHandler(inviteController.joinGroup));
router.post('/room/:code/join', authenticate, asyncHandler(inviteController.joinRoom));

export default router;
