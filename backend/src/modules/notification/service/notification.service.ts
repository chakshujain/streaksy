import { notificationRepository } from '../repository/notification.repository';

export const notificationService = {
  async notify(userId: string, type: string, title: string, body?: string, data?: Record<string, unknown>) {
    const notification = await notificationRepository.create(userId, type, title, body, data);
    // Push via WebSocket (dynamic import to avoid circular dependency)
    import('../../../config/socket').then(m => m.pushNotification(userId, { type, title, body })).catch(() => {});
    return notification;
  },

  async getForUser(userId: string, limit?: number, offset?: number) {
    return notificationRepository.getForUser(userId, limit, offset);
  },

  async getUnreadCount(userId: string) {
    return notificationRepository.getUnreadCount(userId);
  },

  async markRead(id: string, userId: string) {
    return notificationRepository.markRead(id, userId);
  },

  async markAllRead(userId: string) {
    return notificationRepository.markAllRead(userId);
  },
};
