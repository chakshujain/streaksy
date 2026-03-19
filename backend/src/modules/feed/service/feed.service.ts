import { feedRepository } from '../repository/feed.repository';
import { logger } from '../../../config/logger';

export const feedService = {
  /** Post a feed event (fire-and-forget from other services) */
  async postEvent(userId: string, eventType: string, title: string, description?: string, metadata?: Record<string, unknown>) {
    try {
      return await feedRepository.createEvent(userId, eventType, title, description, metadata);
    } catch (err) {
      logger.error({ err, userId, eventType }, 'Failed to create feed event');
    }
  },

  async getFeed(currentUserId: string, limit?: number, offset?: number) {
    return feedRepository.getFeed(currentUserId, limit, offset);
  },

  async getUserFeed(userId: string, currentUserId: string, limit?: number, offset?: number) {
    return feedRepository.getUserFeed(userId, currentUserId, limit, offset);
  },

  async toggleLike(eventId: string, userId: string) {
    const liked = await feedRepository.toggleLike(eventId, userId);
    const count = await feedRepository.getLikeCount(eventId);
    return { liked, count };
  },

  async addComment(eventId: string, userId: string, content: string) {
    return feedRepository.addComment(eventId, userId, content);
  },

  async getComments(eventId: string) {
    return feedRepository.getComments(eventId);
  },

  async deleteComment(commentId: string, userId: string) {
    return feedRepository.deleteComment(commentId, userId);
  },
};
