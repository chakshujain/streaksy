import { Router } from 'express';
import { notificationController } from '../controller/notification.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(notificationController.list));
router.get('/unread-count', asyncHandler(notificationController.unreadCount));
router.patch('/:id/read', asyncHandler(notificationController.markRead));
router.patch('/read-all', asyncHandler(notificationController.markAllRead));

export default router;
