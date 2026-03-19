import { notificationRepository } from '../repository/notification.repository';

export const notificationService = {
  async notify(userId: string, type: string, title: string, body?: string, data?: Record<string, unknown>) {
    return notificationRepository.create(userId, type, title, body, data);
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
