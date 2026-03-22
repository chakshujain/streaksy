import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { roadmapsRepository } from '../../modules/roadmaps/repository/roadmaps.repository';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/roadmaps/repository/roadmaps.repository');
jest.mock('../../modules/group/repository/group.repository');
jest.mock('../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, basePoints: 10, streakBonus: 5, multipliers: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedRoadmapsRepo = roadmapsRepository as jest.Mocked<typeof roadmapsRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Multi-User Roadmap Collaboration', () => {
  const userA = { id: 'user-collab-a', email: 'collaba@test.com', name: 'CollabAlice' };
  const userB = { id: 'user-collab-b', email: 'collabb@test.com', name: 'CollabBob' };
  const userC = { id: 'user-collab-c', email: 'collabc@test.com', name: 'CollabCharlie' };
  const tokenA = generateTestToken(userA.id, userA.email);
  const tokenB = generateTestToken(userB.id, userB.email);
  const tokenC = generateTestToken(userC.id, userC.email);

  const groupId = 'group-collab';
  const roadmapId = 'roadmap-collab';

  const mockRoadmap = {
    id: roadmapId, user_id: userA.id, template_id: 'tmpl-100days',
    group_id: groupId, name: '100 Days of Code', category_id: 'cat-coding',
    duration_days: 100, start_date: '2026-03-01', status: 'active',
    custom_tasks: null, share_code: 'COLLAB-100', created_at: new Date(),
    updated_at: new Date(), completed_days: 0,
    template_slug: '100-days-of-code',
    category_slug: 'coding-tech', category_icon: 'Code',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Create a group roadmap', () => {
    it('should create a roadmap linked to a group', async () => {
      mockedRoadmapsRepo.createUserRoadmap.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          templateId: 'tmpl-100days',
          name: '100 Days of Code',
          durationDays: 100,
          groupId,
        });

      expect(res.status).toBe(201);
      expect(res.body.roadmap.group_id).toBe(groupId);
      expect(res.body.roadmap.share_code).toBeDefined();
    });
  });

  describe('Step 2: Share roadmap via share code', () => {
    it('should resolve roadmap by share code', async () => {
      mockedRoadmapsRepo.getByShareCode.mockResolvedValue(mockRoadmap);

      const res = await request(app)
        .get('/api/roadmaps/share/COLLAB-100')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmap.name).toBe('100 Days of Code');
    });

    it('should return 404 for invalid share code', async () => {
      mockedRoadmapsRepo.getByShareCode.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/roadmaps/share/INVALID-CODE')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Step 3: View template participants', () => {
    it('should list participants for a roadmap template', async () => {
      mockedRoadmapsRepo.getParticipants.mockResolvedValue([
        { user_id: userA.id, display_name: userA.name, avatar_url: null, joined_at: new Date(), current_streak: 10, completed_days: 22 },
        { user_id: userB.id, display_name: userB.name, avatar_url: null, joined_at: new Date(), current_streak: 5, completed_days: 15 },
        { user_id: userC.id, display_name: userC.name, avatar_url: null, joined_at: new Date(), current_streak: 3, completed_days: 8 },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/templates/100-days-of-code/participants')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.participants).toHaveLength(3);
    });
  });

  describe('Step 4: Multiple users complete progress concurrently', () => {
    const createProgressMock = (userId: string, dayNumber: number, streak: number) => {
      return {
        roadmap: { ...mockRoadmap, user_id: userId, completed_days: dayNumber - 1 },
        progress: {
          roadmap_id: roadmapId, user_id: userId,
          day_number: dayNumber, completed: true, completed_at: new Date(), notes: null,
        },
        streak: {
          id: `streak-${userId}`, roadmap_id: roadmapId, user_id: userId,
          current_streak: streak, longest_streak: streak,
          last_activity_date: '2026-03-22',
        },
      };
    };

    it('Alice completes day 22', async () => {
      const mock = createProgressMock(userA.id, 22, 22);
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mock.roadmap);
      mockedRoadmapsRepo.updateDayProgress.mockResolvedValue(mock.progress);
      mockedRoadmapsRepo.updateStreak.mockResolvedValue(mock.streak);
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue([mock.progress]);
      mockedRoadmapsRepo.addPoints.mockResolvedValue();

      const res = await request(app)
        .put(`/api/roadmaps/${roadmapId}/progress`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ day: 22, completed: true });

      expect(res.status).toBe(200);
    });

    it('Bob completes day 15', async () => {
      const mock = createProgressMock(userB.id, 15, 15);
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mock.roadmap);
      mockedRoadmapsRepo.updateDayProgress.mockResolvedValue(mock.progress);
      mockedRoadmapsRepo.updateStreak.mockResolvedValue(mock.streak);
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue([mock.progress]);
      mockedRoadmapsRepo.addPoints.mockResolvedValue();

      const res = await request(app)
        .put(`/api/roadmaps/${roadmapId}/progress`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ day: 15, completed: true });

      expect(res.status).toBe(200);
    });

    it('Charlie completes day 8', async () => {
      const mock = createProgressMock(userC.id, 8, 8);
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mock.roadmap);
      mockedRoadmapsRepo.updateDayProgress.mockResolvedValue(mock.progress);
      mockedRoadmapsRepo.updateStreak.mockResolvedValue(mock.streak);
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue([mock.progress]);
      mockedRoadmapsRepo.addPoints.mockResolvedValue();

      const res = await request(app)
        .put(`/api/roadmaps/${roadmapId}/progress`)
        .set('Authorization', `Bearer ${tokenC}`)
        .send({ day: 8, completed: true });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 5: View roadmap leaderboard', () => {
    it('should show leaderboard with Alice leading', async () => {
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.getLeaderboard.mockResolvedValue([
        { user_id: userA.id, display_name: userA.name, avatar_url: null, completed_count: 22, current_streak: 22 },
        { user_id: userB.id, display_name: userB.name, avatar_url: null, completed_count: 15, current_streak: 15 },
        { user_id: userC.id, display_name: userC.name, avatar_url: null, completed_count: 8, current_streak: 8 },
      ]);

      const res = await request(app)
        .get(`/api/roadmaps/${roadmapId}/leaderboard`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(3);
      expect(res.body.leaderboard[0].display_name).toBe(userA.name);
      expect(res.body.leaderboard[0].completed_days).toBe(22);
    });
  });

  describe('Step 6: Template discussions', () => {
    it('should create a discussion on a template', async () => {
      mockedRoadmapsRepo.getTemplateBySlug.mockResolvedValue({
        id: 'tmpl-100days', category_id: 'cat-coding', name: '100 Days of Code',
        slug: '100-days-of-code', description: 'Code every day for 100 days',
        icon: 'Code', color: '#4F46E5', duration_days: 100,
        difficulty: 'beginner', is_featured: true, participant_count: 200,
        created_at: new Date(), task_count: 100,
        category_slug: 'coding-tech', category_name: 'Coding & Tech',
        tasks: [],
      });
      mockedRoadmapsRepo.createDiscussion.mockResolvedValue({
        id: 'disc-1', template_id: 'tmpl-100days', user_id: userA.id,
        content: 'Day 22 was tough! Anyone else struggling with linked lists?',
        parent_id: null, created_at: new Date(),
        display_name: userA.name,
      });

      const res = await request(app)
        .post('/api/roadmaps/templates/100-days-of-code/discussions')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ content: 'Day 22 was tough! Anyone else struggling with linked lists?' });

      expect(res.status).toBe(201);
      expect(res.body.discussion.content).toContain('linked lists');
    });

    it('should list template discussions', async () => {
      mockedRoadmapsRepo.getTemplateBySlug.mockResolvedValue({
        id: 'tmpl-100days', category_id: 'cat-coding', name: '100 Days of Code',
        slug: '100-days-of-code', description: 'Code every day for 100 days',
        icon: 'Code', color: '#4F46E5', duration_days: 100,
        difficulty: 'beginner', is_featured: true, participant_count: 200,
        created_at: new Date(), task_count: 100,
        category_slug: 'coding-tech', category_name: 'Coding & Tech',
        tasks: [],
      });
      mockedRoadmapsRepo.getDiscussions.mockResolvedValue([
        {
          id: 'disc-1', template_id: 'tmpl-100days', user_id: userA.id,
          content: 'Day 22 was tough!', parent_id: null,
          created_at: new Date(), display_name: userA.name,
        },
        {
          id: 'disc-2', template_id: 'tmpl-100days', user_id: userB.id,
          content: 'Same here! I found it helpful to draw diagrams first.',
          parent_id: 'disc-1', created_at: new Date(), display_name: userB.name,
        },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/templates/100-days-of-code/discussions')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(200);
      expect(res.body.discussions).toHaveLength(2);
    });
  });

  describe('Step 7: Link group to roadmap', () => {
    it('should link a group to an existing roadmap', async () => {
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue({
        ...mockRoadmap, group_id: null,
      });
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedRoadmapsRepo.linkGroup.mockResolvedValue();

      const res = await request(app)
        .post(`/api/roadmaps/${roadmapId}/link-group`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ groupId });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 8: Global leaderboard', () => {
    it('should show global leaderboard across all roadmaps', async () => {
      mockedRoadmapsRepo.getGlobalLeaderboard.mockResolvedValue([
        { user_id: userA.id, display_name: userA.name, total_points: 2500, current_streak: 30, roadmaps_completed: 3 },
        { user_id: userB.id, display_name: userB.name, total_points: 1800, current_streak: 15, roadmaps_completed: 2 },
        { user_id: userC.id, display_name: userC.name, total_points: 900, current_streak: 8, roadmaps_completed: 1 },
      ]);

      const res = await request(app)
        .get('/api/leaderboard/global')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(3);
      expect(res.body.leaderboard[0].total_points).toBe(2500);
    });
  });

  describe('Step 9: Get featured templates', () => {
    it('should show featured roadmap templates', async () => {
      mockedRoadmapsRepo.getFeaturedTemplates.mockResolvedValue([
        {
          id: 'tmpl-1', category_id: 'cat-coding', name: 'Crack the Job Together',
          slug: 'crack-the-job-together', description: '90-day coding roadmap',
          icon: 'Rocket', color: '#4F46E5', duration_days: 90,
          difficulty: 'intermediate', is_featured: true, participant_count: 500,
          created_at: new Date(), task_count: 90,
          category_slug: 'coding-tech', category_name: 'Coding & Tech',
        },
        {
          id: 'tmpl-100days', category_id: 'cat-coding', name: '100 Days of Code',
          slug: '100-days-of-code', description: 'Code every day',
          icon: 'Code', color: '#10B981', duration_days: 100,
          difficulty: 'beginner', is_featured: true, participant_count: 200,
          created_at: new Date(), task_count: 100,
          category_slug: 'coding-tech', category_name: 'Coding & Tech',
        },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/templates/featured')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.templates).toHaveLength(2);
      expect(res.body.templates[0].is_featured).toBe(true);
    });
  });

  describe('Step 10: Update and delete roadmap', () => {
    it('should update roadmap name', async () => {
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.updateRoadmap.mockResolvedValue({
        ...mockRoadmap, name: 'My 100 Days Challenge',
      });

      const res = await request(app)
        .patch(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'My 100 Days Challenge' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap.name).toBe('My 100 Days Challenge');
    });

    it('should not allow non-owner to delete roadmap', async () => {
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mockRoadmap);

      const res = await request(app)
        .delete(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });

    it('should allow owner to delete roadmap', async () => {
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.deleteRoadmap.mockResolvedValue();

      const res = await request(app)
        .delete(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
    });
  });
});
