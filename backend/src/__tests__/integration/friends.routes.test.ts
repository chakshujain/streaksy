import request from 'supertest';
import app from '../../app';
import { friendsRepository } from '../../modules/friends/repository/friends.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/friends/repository/friends.repository');
const mockedRepo = friendsRepository as jest.Mocked<typeof friendsRepository>;

describe('Friends Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockFriend = {
    id: 'friend-row-1',
    friendship_id: 'friendship-1',
    user_id: 'user-2',
    display_name: 'Friend User',
    avatar_url: null,
    bio: 'A friend',
    current_streak: 5,
    total_points: 100,
    last_active: new Date(),
  };

  const mockFriendship = {
    id: 'friendship-1',
    requester_id: 'user-1',
    addressee_id: 'user-2',
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/friends', () => {
    it('should return friends list', async () => {
      mockedRepo.getFriends.mockResolvedValue([mockFriend]);

      const res = await request(app)
        .get('/api/friends')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.friends).toHaveLength(1);
      expect(res.body.friends[0].display_name).toBe('Friend User');
    });

    it('should return empty list when no friends', async () => {
      mockedRepo.getFriends.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/friends')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.friends).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/friends');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/friends/requests', () => {
    it('should return pending requests', async () => {
      mockedRepo.getPendingRequests.mockResolvedValue([mockFriend]);
      mockedRepo.getSentRequests.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/friends/requests')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.incoming).toHaveLength(1);
      expect(res.body.outgoing).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/friends/requests');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/friends/search', () => {
    it('should search users by query', async () => {
      mockedRepo.searchUsers.mockResolvedValue([
        {
          id: 'user-3',
          display_name: 'Search Result',
          avatar_url: null,
          bio: null,
          friendship_status: null,
          friendship_id: null,
        },
      ]);

      const res = await request(app)
        .get('/api/friends/search?q=Search')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(1);
    });

    it('should return 400 for short query', async () => {
      const res = await request(app)
        .get('/api/friends/search?q=a')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/friends/search?q=test');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/friends/request', () => {
    it('should send a friend request', async () => {
      mockedRepo.getFriendshipStatus.mockResolvedValue(null);
      mockedRepo.sendRequest.mockResolvedValue(mockFriendship);

      const res = await request(app)
        .post('/api/friends/request')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'user-2' });

      expect(res.status).toBe(201);
      expect(res.body.friendship.id).toBe('friendship-1');
    });

    it('should return 400 when sending to yourself', async () => {
      const res = await request(app)
        .post('/api/friends/request')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'user-1' });

      expect(res.status).toBe(400);
    });

    it('should return 409 when already friends', async () => {
      mockedRepo.getFriendshipStatus.mockResolvedValue({
        ...mockFriendship,
        status: 'accepted',
      });

      const res = await request(app)
        .post('/api/friends/request')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'user-2' });

      expect(res.status).toBe(409);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/friends/request')
        .send({ userId: 'user-2' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/friends/:id/accept', () => {
    it('should accept a friend request', async () => {
      mockedRepo.acceptRequest.mockResolvedValue({
        ...mockFriendship,
        status: 'accepted',
      });

      const res = await request(app)
        .patch('/api/friends/friendship-1/accept')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.friendship.status).toBe('accepted');
    });

    it('should return 404 for nonexistent request', async () => {
      mockedRepo.acceptRequest.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/friends/nonexistent/accept')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).patch('/api/friends/friendship-1/accept');
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/friends/:id', () => {
    it('should remove a friendship', async () => {
      mockedRepo.removeByFriendshipId.mockResolvedValue(true);

      const res = await request(app)
        .delete('/api/friends/friendship-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Removed');
    });

    it('should return 404 for nonexistent friendship', async () => {
      mockedRepo.removeByFriendshipId.mockResolvedValue(false);

      const res = await request(app)
        .delete('/api/friends/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).delete('/api/friends/friendship-1');
      expect(res.status).toBe(401);
    });
  });
});
