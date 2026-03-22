import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { feedRepository } from '../../modules/feed/repository/feed.repository';
import { friendsRepository } from '../../modules/friends/repository/friends.repository';
import { pokeRepository } from '../../modules/poke/repository/poke.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/feed/repository/feed.repository');
jest.mock('../../modules/friends/repository/friends.repository');
jest.mock('../../modules/poke/repository/poke.repository');
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedFeedRepo = feedRepository as jest.Mocked<typeof feedRepository>;
const mockedFriendsRepo = friendsRepository as jest.Mocked<typeof friendsRepository>;
const mockedPokeRepo = pokeRepository as jest.Mocked<typeof pokeRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Feed & Social Interaction', () => {
  const userA = { id: 'user-feed-a', email: 'feeda@test.com', name: 'FeedAlice' };
  const userB = { id: 'user-feed-b', email: 'feedb@test.com', name: 'FeedBob' };
  const userC = { id: 'user-feed-c', email: 'feedc@test.com', name: 'FeedCharlie' };
  const tokenA = generateTestToken(userA.id, userA.email);
  const tokenB = generateTestToken(userB.id, userB.email);
  const tokenC = generateTestToken(userC.id, userC.email);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Create a feed post', () => {
    it('should create a new feed post', async () => {
      mockedFeedRepo.createEvent.mockResolvedValue({
        id: 'post-1', user_id: userA.id, event_type: 'post',
        title: 'Just completed my 30-day coding streak!',
        description: null, metadata: {},
        created_at: new Date(), display_name: userA.name,
        like_count: 0, comment_count: 0, liked_by_me: false,
      } as any);

      const res = await request(app)
        .post('/api/feed/post')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ content: 'Just completed my 30-day coding streak! 🔥' });

      expect(res.status).toBe(201);
      expect(res.body.post.content).toContain('30-day');
    });

    it('should reject empty post content', async () => {
      const res = await request(app)
        .post('/api/feed/post')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });

    it('should reject post exceeding 500 characters', async () => {
      const res = await request(app)
        .post('/api/feed/post')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ content: 'x'.repeat(501) });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 2: View the feed', () => {
    it('should show feed with posts from friends and groups', async () => {
      mockedFeedRepo.getFeed.mockResolvedValue([
        {
          id: 'post-1', user_id: userA.id, event_type: 'post',
          title: '', description: null,
          metadata: { content: 'Just completed my 30-day coding streak!' },
          created_at: new Date(), display_name: userA.name, avatar_url: undefined,
          like_count: 5, comment_count: 2, liked_by_me: false,
        },
        {
          id: 'event-streak', user_id: userB.id, event_type: 'streak_milestone',
          title: 'Bob reached a 7-day streak!', description: null,
          metadata: { streak: 7 },
          created_at: new Date(), display_name: userB.name, avatar_url: undefined,
          like_count: 3, comment_count: 0, liked_by_me: true,
        },
      ]);

      const res = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(2);
    });

    it('should paginate feed with limit and offset', async () => {
      mockedFeedRepo.getFeed.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/feed?limit=5&offset=10')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(0);
    });
  });

  describe('Step 3: Like and unlike feed posts', () => {
    it('should toggle like on a feed post', async () => {
      mockedFeedRepo.toggleLike.mockResolvedValue(true);
      mockedFeedRepo.getLikeCount.mockResolvedValue(6);

      const res = await request(app)
        .post('/api/feed/post-1/like')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.liked).toBe(true);
      expect(res.body.count).toBe(6);
    });

    it('should toggle unlike on a feed post', async () => {
      mockedFeedRepo.toggleLike.mockResolvedValue(false);
      mockedFeedRepo.getLikeCount.mockResolvedValue(5);

      const res = await request(app)
        .post('/api/feed/post-1/like')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.liked).toBe(false);
      expect(res.body.count).toBe(5);
    });
  });

  describe('Step 4: Comment on feed posts', () => {
    it('should add a comment to a post', async () => {
      mockedFeedRepo.addComment.mockResolvedValue({
        id: 'fc-1', feed_event_id: 'post-1', user_id: userB.id,
        content: 'Congrats! Keep it up!', created_at: new Date(),
        display_name: userB.name,
      });

      const res = await request(app)
        .post('/api/feed/post-1/comments')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ content: 'Congrats! Keep it up!' });

      expect(res.status).toBe(201);
      expect(res.body.comment.content).toBe('Congrats! Keep it up!');
    });

    it('should list comments on a post', async () => {
      mockedFeedRepo.getCommentss.mockResolvedValue([
        {
          id: 'fc-1', feed_event_id: 'post-1', user_id: userB.id,
          content: 'Congrats! Keep it up!', created_at: new Date(),
          display_name: userB.name,
        },
        {
          id: 'fc-2', feed_event_id: 'post-1', user_id: userC.id,
          content: 'Amazing streak!', created_at: new Date(),
          display_name: userC.name,
        },
      ]);

      const res = await request(app)
        .get('/api/feed/post-1/comments')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(2);
    });

    it('should delete own comment', async () => {
      mockedFeedRepo.deleteComment.mockResolvedValue();

      const res = await request(app)
        .delete('/api/feed/comments/fc-1')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Step 5: View user-specific feed', () => {
    it('should get feed for a specific user', async () => {
      mockedFeedRepo.getUserFeed.mockResolvedValue([
        {
          id: 'post-1', user_id: userA.id, event_type: 'post',
          title: '', description: null,
          metadata: { content: '30-day streak!' },
          created_at: new Date(), display_name: userA.name, avatar_url: undefined,
          like_count: 5, comment_count: 2, liked_by_me: false,
        },
      ]);

      const res = await request(app)
        .get(`/api/feed/user/${userA.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(1);
    });
  });

  describe('Step 6: Friend search and management', () => {
    it('should search for users', async () => {
      mockedFriendsRepo.searchUsers.mockResolvedValue([
        { id: userC.id, display_name: userC.name, avatar_url: null, bio: null, friendship_status: null, friendship_id: null },
      ] as any);

      const res = await request(app)
        .get('/api/friends/search?q=Charlie')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(1);
      expect(res.body.users[0].display_name).toBe('FeedCharlie');
    });

    it('should list friends', async () => {
      mockedFriendsRepo.getFriends.mockResolvedValue([
        {
          id: 'friend-row-1', friendship_id: 'f-1',
          user_id: userB.id, display_name: userB.name,
          avatar_url: null, bio: null,
          current_streak: 7, total_points: 500, last_active: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/friends')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.friends).toHaveLength(1);
    });

    it('should remove a friend', async () => {
      (mockedFriendsRepo as any).removeFriend = jest.fn().mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/api/friends/f-1')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Step 7: Poke system for motivation', () => {
    it('should poke a friend with a message', async () => {
      mockedPokeRepo.pokessentToday.mockResolvedValue(0);
      mockedPokeRepo.recentPokeBetween.mockResolvedValue(false);
      mockedPokeRepo.create.mockResolvedValue({
        id: 'poke-1', from_user_id: userA.id, to_user_id: userB.id,
        group_id: null, message: 'Time to code!', poke_type: 'manual',
        escalation_level: 1, created_at: new Date(),
      });
      mockedQueryOne.mockResolvedValue({ display_name: userA.name });

      const res = await request(app)
        .post('/api/pokes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ toUserId: userB.id, message: 'Time to code!' });

      expect(res.status).toBe(201);
      expect(res.body.poke.message).toBe('Time to code!');
    });

    it('should check streak risk', async () => {
      mockedPokeRepo.getStreakAtRiskUsers.mockResolvedValue([
        { user_id: userA.id, email: userA.email, display_name: 'FeedAlice', current_streak: 14 },
      ]);

      const res = await request(app)
        .get('/api/pokes/streak-risk')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
    });

    it('should get inactive group members', async () => {
      mockedPokeRepo.getInactiveGroupMembers.mockResolvedValue([
        { user_id: userC.id, display_name: userC.name, days_inactive: 3, last_solve_date: '2026-03-19', current_streak: 0 },
      ] as any);

      const res = await request(app)
        .get('/api/pokes/inactive/group-1?days=3')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.members).toHaveLength(1);
      expect(res.body.members[0].days_inactive).toBe(3);
    });
  });
});
