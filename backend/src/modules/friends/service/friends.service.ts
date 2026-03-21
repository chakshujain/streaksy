import { friendsRepository } from '../repository/friends.repository';
import { AppError } from '../../../common/errors/AppError';

export const friendsService = {
  async sendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw AppError.badRequest('Cannot send a friend request to yourself');
    }

    const existing = await friendsRepository.getFriendshipStatus(requesterId, addresseeId);
    if (existing) {
      if (existing.status === 'accepted') {
        throw AppError.conflict('Already friends');
      }
      if (existing.status === 'pending') {
        throw AppError.conflict('Friend request already pending');
      }
      if (existing.status === 'blocked') {
        throw AppError.forbidden('Cannot send friend request');
      }
    }

    return friendsRepository.sendRequest(requesterId, addresseeId);
  },

  async acceptRequest(friendshipId: string, userId: string) {
    const friendship = await friendsRepository.acceptRequest(friendshipId, userId);
    if (!friendship) {
      throw AppError.notFound('Friend request not found');
    }
    return friendship;
  },

  async rejectOrCancel(friendshipId: string, userId: string) {
    const removed = await friendsRepository.rejectRequest(friendshipId, userId);
    if (!removed) {
      throw AppError.notFound('Friend request not found');
    }
  },

  async removeFriend(userId: string, friendId: string) {
    const removed = await friendsRepository.removeFriend(userId, friendId);
    if (!removed) {
      throw AppError.notFound('Friendship not found');
    }
  },

  async removeByFriendshipId(friendshipId: string, userId: string) {
    const removed = await friendsRepository.removeByFriendshipId(friendshipId, userId);
    if (!removed) {
      throw AppError.notFound('Friendship not found');
    }
  },

  async getFriends(userId: string) {
    return friendsRepository.getFriends(userId);
  },

  async getPendingRequests(userId: string) {
    const incoming = await friendsRepository.getPendingRequests(userId);
    const outgoing = await friendsRepository.getSentRequests(userId);
    return { incoming, outgoing };
  },

  async searchUsers(q: string, userId: string) {
    if (!q || q.trim().length < 2) {
      throw AppError.badRequest('Search query must be at least 2 characters');
    }
    return friendsRepository.searchUsers(q.trim(), userId);
  },
};
