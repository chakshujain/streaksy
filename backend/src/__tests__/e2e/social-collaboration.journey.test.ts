import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { friendsRepository } from '../../modules/friends/repository/friends.repository';
import { roadmapsRepository } from '../../modules/roadmaps/repository/roadmaps.repository';
import { pokeRepository } from '../../modules/poke/repository/poke.repository';
import { feedRepository } from '../../modules/feed/repository/feed.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/group/repository/group.repository');
jest.mock('../../modules/friends/repository/friends.repository');
jest.mock('../../modules/roadmaps/repository/roadmaps.repository');
jest.mock('../../modules/poke/repository/poke.repository');
jest.mock('../../modules/feed/repository/feed.repository');
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, basePoints: 10, streakBonus: 5, multipliers: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedFriendsRepo = friendsRepository as jest.Mocked<typeof friendsRepository>;
const mockedRoadmapsRepo = roadmapsRepository as jest.Mocked<typeof roadmapsRepository>;
const mockedPokeRepo = pokeRepository as jest.Mocked<typeof pokeRepository>;
const mockedFeedRepo = feedRepository as jest.Mocked<typeof feedRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Social Collaboration', () => {
  const userA = { id: 'user-alice', email: 'alice@test.com', name: 'Alice' };
  const userB = { id: 'user-bob', email: 'bob@test.com', name: 'Bob' };
  const tokenA = generateTestToken(userA.id, userA.email);
  const tokenB = generateTestToken(userB.id, userB.email);

  const mockGroup = {
    id: 'group-1',
    name: 'DSA Warriors',
    description: 'Prep together for interviews',
    invite_code: 'DSA-WAR-123',
    created_by: userA.id,
    created_at: new Date(),
    plan: null,
    objective: null,
    target_date: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Alice creates a group', () => {
    it('should create a new study group', async () => {
      mockedGroupRepo.create.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: userA.id, display_name: userA.name, role: 'admin', joined_at: new Date() },
      ]);

      const res = await request(app)
        .post('/api/groups')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'DSA Warriors', description: 'Prep together for interviews' });

      expect(res.status).toBe(201);
      expect(res.body.group.name).toBe('DSA Warriors');
      expect(res.body.group.invite_code).toBeDefined();
    });

    it('should show Alice as the only member with admin role', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: userA.id, display_name: userA.name, role: 'admin', joined_at: new Date() },
      ]);
      mockedGroupRepo.getMemberCount.mockResolvedValue(1);
      mockedGroupRepo.getGroupSheets.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/groups/group-1')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.group.members).toHaveLength(1);
      expect(res.body.group.members[0].role).toBe('admin');
    });
  });

  describe('Step 2: Alice sends a friend request to Bob', () => {
    it('should send a friend request', async () => {
      mockedFriendsRepo.getFriendshipStatus.mockResolvedValue(null);
      mockedFriendsRepo.sendRequest.mockResolvedValue({
        id: 'friendship-1',
        requester_id: userA.id,
        addressee_id: userB.id,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const res = await request(app)
        .post('/api/friends/request')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ userId: userB.id });

      expect(res.status).toBe(201);
      expect(res.body.friendship.status).toBe('pending');
    });

    it('Bob should see the pending friend request', async () => {
      mockedFriendsRepo.getPendingRequests.mockResolvedValue([{
        id: 'friend-row-1',
        friendship_id: 'friendship-1',
        user_id: userA.id,
        display_name: userA.name,
        avatar_url: null,
        bio: null,
        current_streak: 0,
        total_points: 0,
        last_active: new Date(),
      }]);
      mockedFriendsRepo.getSentRequests.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/friends/requests')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.incoming).toHaveLength(1);
      expect(res.body.incoming[0].display_name).toBe('Alice');
    });

    it('Bob should accept the friend request', async () => {
      mockedFriendsRepo.acceptRequest.mockResolvedValue({
        id: 'friendship-1',
        requester_id: userA.id,
        addressee_id: userB.id,
        status: 'accepted',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const res = await request(app)
        .patch('/api/friends/friendship-1/accept')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.friendship.status).toBe('accepted');
    });
  });

  describe('Step 3: Bob joins the group via invite code', () => {
    it('should join the group with invite code', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(false);
      mockedGroupRepo.addMember.mockResolvedValue();
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: userA.id, display_name: userA.name, role: 'admin', joined_at: new Date() },
        { user_id: userB.id, display_name: userB.name, role: 'member', joined_at: new Date() },
      ]);
      mockedGroupRepo.getMemberCount.mockResolvedValue(2);
      mockedGroupRepo.getGroupSheets.mockResolvedValue([]);

      const res = await request(app)
        .post('/api/groups/join')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ inviteCode: 'DSA-WAR-123' });

      expect(res.status).toBe(200);
    });

    it('should show both members in the group', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: userA.id, display_name: userA.name, role: 'admin', joined_at: new Date() },
        { user_id: userB.id, display_name: userB.name, role: 'member', joined_at: new Date() },
      ]);
      mockedGroupRepo.getMemberCount.mockResolvedValue(2);
      mockedGroupRepo.getGroupSheets.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/groups/group-1')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.group.members).toHaveLength(2);
    });
  });

  describe('Step 4: Both users start the same roadmap', () => {
    it('Alice starts a roadmap', async () => {
      const aliceRoadmap = {
        id: 'roadmap-alice', user_id: userA.id, template_id: 'tmpl-1',
        group_id: 'group-1', name: 'DSA Warriors Roadmap', category_id: 'cat-1',
        duration_days: 90, start_date: '2026-03-22', status: 'active',
        custom_tasks: null, share_code: 'share-alice', created_at: new Date(),
        updated_at: new Date(), completed_days: 0,
        template_slug: 'crack-the-job-together',
        category_slug: 'coding-tech', category_icon: 'Code',
      };

      mockedRoadmapsRepo.createUserRoadmap.mockResolvedValue(aliceRoadmap);
      mockedRoadmapsRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ templateId: 'tmpl-1', name: 'DSA Warriors Roadmap', durationDays: 90, groupId: 'group-1' });

      expect(res.status).toBe(201);
      expect(res.body.roadmap.name).toBe('DSA Warriors Roadmap');
    });

    it('Bob starts the same roadmap', async () => {
      const bobRoadmap = {
        id: 'roadmap-bob', user_id: userB.id, template_id: 'tmpl-1',
        group_id: 'group-1', name: 'DSA Warriors Roadmap', category_id: 'cat-1',
        duration_days: 90, start_date: '2026-03-22', status: 'active',
        custom_tasks: null, share_code: 'share-bob', created_at: new Date(),
        updated_at: new Date(), completed_days: 0,
        template_slug: 'crack-the-job-together',
        category_slug: 'coding-tech', category_icon: 'Code',
      };

      mockedRoadmapsRepo.createUserRoadmap.mockResolvedValue(bobRoadmap);
      mockedRoadmapsRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ templateId: 'tmpl-1', name: 'DSA Warriors Roadmap', durationDays: 90, groupId: 'group-1' });

      expect(res.status).toBe(201);
    });
  });

  describe('Step 5: Alice pokes Bob to stay motivated', () => {
    it('should send a poke to Bob', async () => {
      mockedPokeRepo.pokessentToday.mockResolvedValue(0);
      mockedPokeRepo.recentPokeBetween.mockResolvedValue(false);
      mockedPokeRepo.create.mockResolvedValue({
        id: 'poke-1',
        from_user_id: userA.id,
        to_user_id: userB.id,
        group_id: null,
        message: 'Hey Bob, keep up the streak!',
        poke_type: 'manual',
        escalation_level: 1,
        created_at: new Date(),
      });
      // Mock the user lookup for display name
      mockedQueryOne.mockResolvedValue({ display_name: userA.name });

      const res = await request(app)
        .post('/api/pokes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ toUserId: userB.id, message: 'Hey Bob, keep up the streak!' });

      expect(res.status).toBe(201);
      expect(res.body.poke.message).toBe('Hey Bob, keep up the streak!');
    });

    it('Bob should see received pokes', async () => {
      mockedPokeRepo.getReceivedPokes.mockResolvedValue([{
        id: 'poke-1',
        from_user_id: userA.id,
        to_user_id: userB.id,
        group_id: null,
        message: 'Hey Bob, keep up the streak!',
        poke_type: 'manual',
        escalation_level: 1,
        created_at: new Date(),
        from_display_name: userA.name,
      }]);

      const res = await request(app)
        .get('/api/pokes/received')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.pokes).toHaveLength(1);
      expect(res.body.pokes[0].from_display_name).toBe('Alice');
    });
  });

  describe('Step 6: Check feed shows activity', () => {
    it('should show feed events from group members', async () => {
      mockedFeedRepo.getFeed.mockResolvedValue([
        {
          id: 'event-1', user_id: userA.id, event_type: 'roadmap_started',
          title: 'Alice started DSA Warriors Roadmap',
          description: null, metadata: { roadmap_id: 'roadmap-alice' },
          created_at: new Date(), display_name: userA.name, avatar_url: undefined,
          like_count: 2, comment_count: 0, liked_by_me: false,
        },
        {
          id: 'event-2', user_id: userB.id, event_type: 'roadmap_started',
          title: 'Bob started DSA Warriors Roadmap',
          description: null, metadata: { roadmap_id: 'roadmap-bob' },
          created_at: new Date(), display_name: userB.name, avatar_url: undefined,
          like_count: 1, comment_count: 0, liked_by_me: false,
        },
      ]);

      const res = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(2);
    });

    it('should allow liking a feed event', async () => {
      mockedFeedRepo.toggleLike.mockResolvedValue(true);
      mockedFeedRepo.getLikeCount.mockResolvedValue(3);

      const res = await request(app)
        .post('/api/feed/event-2/like')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.liked).toBe(true);
      expect(res.body.count).toBe(3);
    });

    it('should allow commenting on a feed event', async () => {
      mockedFeedRepo.addComment.mockResolvedValue({
        id: 'comment-1', feed_event_id: 'event-2', user_id: userA.id,
        content: 'Let\'s crush it!', created_at: new Date(),
        display_name: userA.name,
      });

      const res = await request(app)
        .post('/api/feed/event-2/comments')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ content: 'Let\'s crush it!' });

      expect(res.status).toBe(201);
      expect(res.body.comment.content).toBe('Let\'s crush it!');
    });
  });

  describe('Step 7: Check leaderboard rankings', () => {
    it('should show group leaderboard with both members', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);

      // Leaderboard service uses query/redis directly
      mockedQuery.mockResolvedValue([
        {
          user_id: userA.id, display_name: userA.name,
          solved_count: '15', current_streak: '5',
        },
        {
          user_id: userB.id, display_name: userB.name,
          solved_count: '10', current_streak: '3',
        },
      ]);

      const res = await request(app)
        .get('/api/leaderboard/group/group-1')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toBeDefined();
    });

    it('should deny leaderboard access to non-members', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);

      const outsiderToken = generateTestToken('outsider-id', 'outsider@test.com');

      const res = await request(app)
        .get('/api/leaderboard/group/group-1')
        .set('Authorization', `Bearer ${outsiderToken}`);

      expect(res.status).toBe(403);
    });
  });
});
