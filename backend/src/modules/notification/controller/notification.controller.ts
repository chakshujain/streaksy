import { Request, Response } from 'express';
import { notificationService } from '../service/notification.service';
import { AuthRequest } from '../../../common/types';

export const notificationController = {
  async list(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
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
};
