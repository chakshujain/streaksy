import { Router } from 'express';
import { notificationController } from '../controller/notification.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

// Public route (no auth needed for VAPID key)
router.get('/push/vapid-key', asyncHandler(notificationController.getVapidKey));

router.use(authenticate);

router.get('/', asyncHandler(notificationController.list));
router.get('/unread-count', asyncHandler(notificationController.unreadCount));
router.patch('/:id/read', asyncHandler(notificationController.markRead));
router.patch('/read-all', asyncHandler(notificationController.markAllRead));

// Push subscription management
router.post('/push/subscribe', asyncHandler(notificationController.subscribePush));
router.post('/push/unsubscribe', asyncHandler(notificationController.unsubscribePush));

// Notification preferences
router.get('/preferences', asyncHandler(notificationController.getPreferences));
router.put('/preferences', asyncHandler(notificationController.updatePreferences));

export default router;
