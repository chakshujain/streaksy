import { Request, Response } from 'express';
import { notificationService } from '../service/notification.service';
import { pushService } from '../service/push.service';
import { notificationHub } from '../service/notification-hub';
import { AuthRequest } from '../../../common/types';
import { parseLimit, parseOffset } from '../../../common/utils/params';

export const notificationController = {
  async list(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const limit = parseLimit(req, 20);
    const offset = parseOffset(req);
    const notifications = await notificationService.getForUser(user!.userId, limit, offset);
    res.json({ notifications });
  },

  async unreadCount(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const count = await notificationService.getUnreadCount(user!.userId);
    res.json({ count });
  },

  async markRead(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await notificationService.markRead(id, user!.userId);
    res.json({ message: 'Marked as read' });
  },

  async markAllRead(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    await notificationService.markAllRead(user!.userId);
    res.json({ message: 'All marked as read' });
  },

  // Push subscription management
  async subscribePush(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { subscription } = req.body;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      res.status(400).json({ error: 'Invalid push subscription' });
      return;
    }
    await pushService.subscribe(user!.userId, subscription, req.headers['user-agent']);
    res.json({ message: 'Push subscription saved' });
  },

  async unsubscribePush(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { endpoint } = req.body;
    if (!endpoint) {
      res.status(400).json({ error: 'Endpoint required' });
      return;
    }
    await pushService.unsubscribe(user!.userId, endpoint);
    res.json({ message: 'Push subscription removed' });
  },

  async getVapidKey(_req: Request, res: Response) {
    res.json({ publicKey: pushService.getPublicKey() });
  },

  // Notification preferences
  async getPreferences(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const prefs = await notificationHub.getPreferences(user!.userId);
    res.json({ preferences: prefs });
  },

  async updatePreferences(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    await notificationHub.updatePreferences(user!.userId, req.body);
    res.json({ message: 'Preferences updated' });
  },
};
