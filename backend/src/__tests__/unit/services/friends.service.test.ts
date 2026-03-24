import { friendsService } from '../../../modules/friends/service/friends.service';
import { friendsRepository } from '../../../modules/friends/repository/friends.repository';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/friends/repository/friends.repository');
const mockedRepo = friendsRepository as jest.Mocked<typeof friendsRepository>;

describe('friendsService', () => {
  const mockFriendship = {
    id: 'fs-1',
    requester_id: 'user-1',
    addressee_id: 'user-2',
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockFriend = {
    id: 'u-2',
    friendship_id: 'fs-1',
    user_id: 'user-2',
    display_name: 'User Two',
    avatar_url: null,
    bio: null,
    current_streak: 5,
    total_points: 100,
    last_active: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendRequest', () => {
    it('should send a friend request', async () => {
      mockedRepo.getFriendshipStatus.mockResolvedValue(null);
      mockedRepo.sendRequest.mockResolvedValue(mockFriendship);

      const result = await friendsService.sendRequest('user-1', 'user-2');

      expect(mockedRepo.getFriendshipStatus).toHaveBeenCalledWith('user-1', 'user-2');
      expect(mockedRepo.sendRequest).toHaveBeenCalledWith('user-1', 'user-2');
      expect(result).toEqual(mockFriendship);
    });

    it('should throw badRequest when sending request to self', async () => {
      await expect(friendsService.sendRequest('user-1', 'user-1')).rejects.toThrow(
        'Cannot send a friend request to yourself'
      );
      await expect(friendsService.sendRequest('user-1', 'user-1')).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('should throw conflict when already friends', async () => {
      mockedRepo.getFriendshipStatus.mockResolvedValue({
        ...mockFriendship,
        status: 'accepted',
      });

      await expect(friendsService.sendRequest('user-1', 'user-2')).rejects.toThrow(
        'Already friends'
      );
      await expect(friendsService.sendRequest('user-1', 'user-2')).rejects.toMatchObject({
        statusCode: 409,
      });
    });

    it('should throw conflict when request already pending', async () => {
      mockedRepo.getFriendshipStatus.mockResolvedValue({
        ...mockFriendship,
        status: 'pending',
      });

      await expect(friendsService.sendRequest('user-1', 'user-2')).rejects.toThrow(
        'Friend request already pending'
      );
    });

    it('should throw forbidden when user is blocked', async () => {
      mockedRepo.getFriendshipStatus.mockResolvedValue({
        ...mockFriendship,
        status: 'blocked',
      });

      await expect(friendsService.sendRequest('user-1', 'user-2')).rejects.toThrow(
        'Cannot send friend request'
      );
      await expect(friendsService.sendRequest('user-1', 'user-2')).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('acceptRequest', () => {
    it('should accept a friend request', async () => {
      const accepted = { ...mockFriendship, status: 'accepted' };
      mockedRepo.acceptRequest.mockResolvedValue(accepted);

      const result = await friendsService.acceptRequest('fs-1', 'user-2');

      expect(mockedRepo.acceptRequest).toHaveBeenCalledWith('fs-1', 'user-2');
      expect(result).toEqual(accepted);
    });

    it('should throw notFound when request not found', async () => {
      mockedRepo.acceptRequest.mockResolvedValue(null);

      await expect(friendsService.acceptRequest('bad-id', 'user-2')).rejects.toThrow(
        'Friend request not found'
      );
      await expect(friendsService.acceptRequest('bad-id', 'user-2')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('removeFriend', () => {
    it('should remove a friend', async () => {
      mockedRepo.removeFriend.mockResolvedValue(true);

      await expect(friendsService.removeFriend('user-1', 'user-2')).resolves.toBeUndefined();
      expect(mockedRepo.removeFriend).toHaveBeenCalledWith('user-1', 'user-2');
    });

    it('should throw notFound when friendship not found', async () => {
      mockedRepo.removeFriend.mockResolvedValue(false);

      await expect(friendsService.removeFriend('user-1', 'user-3')).rejects.toThrow(
        'Friendship not found'
      );
      await expect(friendsService.removeFriend('user-1', 'user-3')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('removeByFriendshipId', () => {
    it('should remove by friendship id', async () => {
      mockedRepo.removeByFriendshipId.mockResolvedValue(true);

      await expect(friendsService.removeByFriendshipId('fs-1', 'user-1')).resolves.toBeUndefined();
    });

    it('should throw notFound when friendship not found', async () => {
      mockedRepo.removeByFriendshipId.mockResolvedValue(false);

      await expect(friendsService.removeByFriendshipId('bad-id', 'user-1')).rejects.toThrow(
        'Friendship not found'
      );
    });
  });

  describe('getFriends', () => {
    it('should return friends list', async () => {
      mockedRepo.getFriends.mockResolvedValue([mockFriend]);

      const result = await friendsService.getFriends('user-1');

      expect(mockedRepo.getFriends).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockFriend]);
    });
  });

  describe('getPendingRequests', () => {
    it('should return incoming and outgoing requests', async () => {
      const incoming = [mockFriend];
      const outgoing = [{ ...mockFriend, user_id: 'user-3', display_name: 'User Three' }];
      mockedRepo.getPendingRequests.mockResolvedValue(incoming);
      mockedRepo.getSentRequests.mockResolvedValue(outgoing);

      const result = await friendsService.getPendingRequests('user-1');

      expect(result).toEqual({ incoming, outgoing });
      expect(mockedRepo.getPendingRequests).toHaveBeenCalledWith('user-1');
      expect(mockedRepo.getSentRequests).toHaveBeenCalledWith('user-1');
    });
  });

  describe('searchUsers', () => {
    it('should search users by query', async () => {
      const searchResults = [{ id: 'u-3', display_name: 'Alice', avatar_url: null, bio: null, friendship_status: null, friendship_id: null }];
      mockedRepo.searchUsers.mockResolvedValue(searchResults);

      const result = await friendsService.searchUsers('Ali', 'user-1');

      expect(mockedRepo.searchUsers).toHaveBeenCalledWith('Ali', 'user-1');
      expect(result).toEqual(searchResults);
    });

    it('should pass empty query through to repository for suggested users', async () => {
      const suggestedUsers = [{ id: 'u-4', display_name: 'Bob', avatar_url: null, bio: null, friendship_status: null, friendship_id: null }];
      mockedRepo.searchUsers.mockResolvedValue(suggestedUsers);

      const result = await friendsService.searchUsers('', 'user-1');

      expect(mockedRepo.searchUsers).toHaveBeenCalledWith('', 'user-1');
      expect(result).toEqual(suggestedUsers);
    });

    it('should trim whitespace from query', async () => {
      mockedRepo.searchUsers.mockResolvedValue([]);

      await friendsService.searchUsers('  Alice  ', 'user-1');

      expect(mockedRepo.searchUsers).toHaveBeenCalledWith('Alice', 'user-1');
    });

    it('should handle null query gracefully', async () => {
      mockedRepo.searchUsers.mockResolvedValue([]);

      await friendsService.searchUsers(null as any, 'user-1');

      expect(mockedRepo.searchUsers).toHaveBeenCalledWith('', 'user-1');
    });
  });

  describe('getFriendsEnriched', () => {
    it('should return enriched friends from repository', async () => {
      const enrichedFriends = [
        {
          friendship_id: 'fs-1',
          user_id: 'user-2',
          display_name: 'User Two',
          avatar_url: null,
          bio: null,
          current_streak: 5,
          total_points: 100,
          last_active: null,
          shared_groups: [{ id: 'g-1', name: 'Study Group' }],
          active_roadmaps: [{ id: 'r-1', name: 'DSA Roadmap', template_slug: 'dsa' }],
          active_rooms: [],
        },
      ];
      mockedRepo.getFriendsWithContext.mockResolvedValue(enrichedFriends);

      const result = await friendsService.getFriendsEnriched('user-1');

      expect(mockedRepo.getFriendsWithContext).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(enrichedFriends);
    });

    it('should return empty array when user has no friends', async () => {
      mockedRepo.getFriendsWithContext.mockResolvedValue([]);

      const result = await friendsService.getFriendsEnriched('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('getFriendIds', () => {
    it('should return friend ids from repository', async () => {
      const friendIds = ['user-2', 'user-3', 'user-4'];
      mockedRepo.getFriendIds.mockResolvedValue(friendIds);

      const result = await friendsService.getFriendIds('user-1');

      expect(mockedRepo.getFriendIds).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(friendIds);
    });

    it('should return empty array when user has no friends', async () => {
      mockedRepo.getFriendIds.mockResolvedValue([]);

      const result = await friendsService.getFriendIds('user-1');

      expect(result).toEqual([]);
    });
  });
});
