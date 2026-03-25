import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { friendsRepository } from '../../modules/friends/repository/friends.repository';
import { authRepository } from '../../modules/auth/repository/auth.repository';

jest.mock('../../modules/friends/repository/friends.repository');
jest.mock('../../modules/auth/repository/auth.repository');
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../config/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));
const mockedFriendsRepo = friendsRepository as jest.Mocked<typeof friendsRepository>;
const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>;

describe('E2E Journey: Friends Management', () => {
  const userA = { id: '70000000-0000-4000-a000-000000000001', email: 'charlie@test.com', name: 'Charlie' };
  const userB = { id: '70000000-0000-4000-a000-000000000002', email: 'dana@test.com', name: 'Dana' };
  const userC = { id: '70000000-0000-4000-a000-000000000003', email: 'eve@test.com', name: 'Eve' };
  const tokenA = generateTestToken(userA.id, userA.email);
  const tokenB = generateTestToken(userB.id, userB.email);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Search for users to friend', () => {
    it('should search users by name', async () => {
      mockedFriendsRepo.searchUsers.mockResolvedValue([
        { user_id: userB.id, display_name: userB.name, avatar_url: null, bio: 'DSA enthusiast' },
        { user_id: userC.id, display_name: userC.name, avatar_url: null, bio: null },
      ] as any);

      const res = await request(app)
        .get('/api/friends/search?q=a')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(2);
      expect(res.body.users[0].display_name).toBe('Dana');
    });

    it('should return suggested users when search query is empty', async () => {
      mockedFriendsRepo.searchUsers.mockResolvedValue([
        { user_id: userB.id, display_name: userB.name, avatar_url: null, bio: null },
      ] as any);

      const res = await request(app)
        .get('/api/friends/search')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toBeDefined();
    });
  });

  describe('Step 2: Send friend request and handle duplicates', () => {
    it('should send a friend request', async () => {
      mockedFriendsRepo.getFriendshipStatus.mockResolvedValue(null);
      mockedFriendsRepo.sendRequest.mockResolvedValue({
        id: 'fs-1', requester_id: userA.id, addressee_id: userB.id,
        status: 'pending', created_at: new Date(), updated_at: new Date(),
      } as any);
      mockedAuthRepo.findById.mockResolvedValue({ id: userA.id, display_name: userA.name } as any);

      const res = await request(app)
        .post('/api/friends/request')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ userId: userB.id });

      expect(res.status).toBe(201);
      expect(res.body.friendship.status).toBe('pending');
    });

    it('should reject duplicate friend request', async () => {
      mockedFriendsRepo.getFriendshipStatus.mockResolvedValue({
        id: 'fs-1', requester_id: userA.id, addressee_id: userB.id,
        status: 'pending', created_at: new Date(), updated_at: new Date(),
      } as any);

      const res = await request(app)
        .post('/api/friends/request')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ userId: userB.id });

      expect(res.status).toBe(409);
    });

    it('should reject self-friend request', async () => {
      const res = await request(app)
        .post('/api/friends/request')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ userId: userA.id });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 3: Accept friend request', () => {
    it('should accept and update friendship status', async () => {
      mockedFriendsRepo.acceptRequest.mockResolvedValue({
        id: 'fs-1', requester_id: userA.id, addressee_id: userB.id,
        status: 'accepted', created_at: new Date(), updated_at: new Date(),
      } as any);
      mockedAuthRepo.findById.mockResolvedValue({ id: userB.id, display_name: userB.name } as any);

      const res = await request(app)
        .patch('/api/friends/fs-1/accept')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.friendship.status).toBe('accepted');
    });

    it('should return 404 for non-existent friendship', async () => {
      mockedFriendsRepo.acceptRequest.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/friends/nonexistent/accept')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Step 4: List friends', () => {
    it('should return the friends list', async () => {
      mockedFriendsRepo.getFriends.mockResolvedValue([
        {
          id: 'fr-1', friendship_id: 'fs-1', user_id: userB.id,
          display_name: userB.name, avatar_url: null, bio: 'DSA enthusiast',
          current_streak: 5, total_points: 150, last_active: new Date(),
        },
      ] as any);

      const res = await request(app)
        .get('/api/friends')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.friends).toHaveLength(1);
      expect(res.body.friends[0].display_name).toBe('Dana');
      expect(res.body.friends[0].current_streak).toBe(5);
    });

    it('should return empty list for user with no friends', async () => {
      mockedFriendsRepo.getFriends.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/friends')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.friends).toHaveLength(0);
    });
  });

  describe('Step 5: Get enriched friends data', () => {
    it('should return friends with shared groups, roadmaps, and rooms', async () => {
      mockedFriendsRepo.getFriendsWithContext.mockResolvedValue([
        {
          user_id: userB.id, display_name: userB.name, avatar_url: null,
          bio: 'DSA enthusiast', current_streak: 5, total_points: 150,
          shared_groups: [{ id: 'g1', name: 'DSA Warriors' }],
          active_roadmaps: [{ id: 'r1', name: 'Crack the Job' }],
          active_rooms: [],
        },
      ] as any);

      const res = await request(app)
        .get('/api/friends/enriched')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.friends).toHaveLength(1);
      expect(res.body.friends[0].shared_groups).toHaveLength(1);
      expect(res.body.friends[0].active_roadmaps).toHaveLength(1);
    });
  });

  describe('Step 6: Get friend IDs for global cache', () => {
    it('should return array of friend user IDs', async () => {
      mockedFriendsRepo.getFriendIds.mockResolvedValue([userB.id, userC.id]);

      const res = await request(app)
        .get('/api/friends/ids')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.friendIds).toHaveLength(2);
      expect(res.body.friendIds).toContain(userB.id);
      expect(res.body.friendIds).toContain(userC.id);
    });
  });

  describe('Step 7: View pending requests', () => {
    it('should show both incoming and outgoing requests', async () => {
      mockedFriendsRepo.getPendingRequests.mockResolvedValue([
        {
          id: 'fr-2', friendship_id: 'fs-2', user_id: userC.id,
          display_name: userC.name, avatar_url: null, bio: null,
          current_streak: 0, total_points: 0, last_active: new Date(),
        },
      ] as any);
      mockedFriendsRepo.getSentRequests.mockResolvedValue([
        {
          id: 'fr-3', friendship_id: 'fs-3', user_id: userB.id,
          display_name: userB.name, avatar_url: null, bio: null,
          current_streak: 5, total_points: 150, last_active: new Date(),
        },
      ] as any);

      const res = await request(app)
        .get('/api/friends/requests')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.incoming).toHaveLength(1);
      expect(res.body.incoming[0].display_name).toBe('Eve');
      expect(res.body.outgoing).toHaveLength(1);
      expect(res.body.outgoing[0].display_name).toBe('Dana');
    });
  });

  describe('Step 8: Remove a friend', () => {
    it('should remove an existing friendship', async () => {
      mockedFriendsRepo.removeByFriendshipId.mockResolvedValue(true);

      const res = await request(app)
        .delete('/api/friends/fs-1')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Removed');
      expect(mockedFriendsRepo.removeByFriendshipId).toHaveBeenCalledWith('fs-1', userA.id);
    });

    it('should return 404 when removing non-existent friendship', async () => {
      mockedFriendsRepo.removeByFriendshipId.mockResolvedValue(false);

      const res = await request(app)
        .delete('/api/friends/nonexistent')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Step 9: Invite non-user by email', () => {
    it('should send an invite email to a non-registered user', async () => {
      mockedAuthRepo.findById.mockResolvedValue({ id: userA.id, display_name: userA.name } as any);
      mockedAuthRepo.findByEmail.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/friends/invite-email')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ email: 'newuser@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Invite sent!');
    });

    it('should reject invite for existing user', async () => {
      mockedAuthRepo.findById.mockResolvedValue({ id: userA.id, display_name: userA.name } as any);
      mockedAuthRepo.findByEmail.mockResolvedValue({ id: 'existing-id', email: 'existing@test.com' } as any);

      const res = await request(app)
        .post('/api/friends/invite-email')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ email: 'existing@test.com' });

      expect(res.status).toBe(409);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/friends/invite-email')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/friends/invite-email')
        .send({ email: 'someone@example.com' });

      expect(res.status).toBe(401);
    });
  });
});
