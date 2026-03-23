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

    const result = await friendsRepository.sendRequest(requesterId, addresseeId);

    // Notify addressee of friend request
    import('../../auth/repository/auth.repository').then(async m => {
      const requester = await m.authRepository.findById(requesterId);
      if (requester) {
        const { notificationHub } = await import('../../notification/service/notification-hub');
        await notificationHub.send(
          addresseeId,
          'friend_request',
          `${requester.display_name} sent you a friend request`,
          'Accept their request to start tracking goals together!',
        );
      }
    }).catch(() => {});

    return result;
  },

  async acceptRequest(friendshipId: string, userId: string) {
    const friendship = await friendsRepository.acceptRequest(friendshipId, userId);
    if (!friendship) {
      throw AppError.notFound('Friend request not found');
    }

    // Notify the requester that their request was accepted
    import('../../auth/repository/auth.repository').then(async m => {
      const accepter = await m.authRepository.findById(userId);
      if (accepter) {
        // Notify the other person
        const otherId = (friendship as any).user_id_1 === userId
          ? (friendship as any).user_id_2
          : (friendship as any).user_id_1;
        const { notificationHub } = await import('../../notification/service/notification-hub');
        await notificationHub.send(
          otherId,
          'friend_accepted',
          `${accepter.display_name} accepted your friend request!`,
          'You can now track each other\'s progress and poke each other!',
        );
      }
    }).catch(() => {});

    return friendship;
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

  async getFriendsEnriched(userId: string) {
    return friendsRepository.getFriendsWithContext(userId);
  },

  async getFriendIds(userId: string) {
    return friendsRepository.getFriendIds(userId);
  },

  async searchUsers(q: string, userId: string) {
    if (!q || q.trim().length < 2) {
      throw AppError.badRequest('Search query must be at least 2 characters');
    }
    return friendsRepository.searchUsers(q.trim(), userId);
  },
};
