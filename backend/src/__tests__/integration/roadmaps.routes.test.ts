import request from 'supertest';
import app from '../../app';
import { roadmapsRepository } from '../../modules/roadmaps/repository/roadmaps.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/roadmaps/repository/roadmaps.repository');
jest.mock('../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, basePoints: 10, streakBonus: 5, multipliers: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedRepo = roadmapsRepository as jest.Mocked<typeof roadmapsRepository>;

describe('Roadmap Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockCategory = {
    id: 'cat-1',
    name: 'Coding & Tech',
    slug: 'coding-tech',
    icon: 'Code',
    color: '#4F46E5',
    position: 1,
  };

  const mockTemplate = {
    id: 'tmpl-1',
    category_id: 'cat-1',
    name: 'Crack the Job Together',
    slug: 'crack-the-job-together',
    description: '90-day coding roadmap',
    icon: 'Rocket',
    color: '#4F46E5',
    duration_days: 90,
    difficulty: 'intermediate',
    is_featured: true,
    participant_count: 50,
    created_at: new Date(),
    task_count: 90,
    category_slug: 'coding-tech',
    category_name: 'Coding & Tech',
  };

  const mockRoadmap = {
    id: 'roadmap-1',
    user_id: 'user-1',
    template_id: 'tmpl-1',
    group_id: null,
    name: 'My DSA Roadmap',
    category_id: 'cat-1',
    duration_days: 90,
    start_date: '2024-01-01',
    status: 'active',
    custom_tasks: null,
    share_code: 'abc123',
    created_at: new Date(),
    updated_at: new Date(),
    completed_days: 5,
    template_slug: 'crack-the-job-together',
    category_slug: 'coding-tech',
    category_icon: 'Code',
  };

  const mockDayProgress = {
    roadmap_id: 'roadmap-1',
    user_id: 'user-1',
    day_number: 1,
    completed: true,
    completed_at: new Date(),
    notes: null,
  };

  const mockStreak = {
    id: 'streak-1',
    roadmap_id: 'roadmap-1',
    user_id: 'user-1',
    current_streak: 5,
    longest_streak: 10,
    last_activity_date: '2024-01-05',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/roadmaps/categories', () => {
    it('should return roadmap categories', async () => {
      mockedRepo.getCategories.mockResolvedValue([mockCategory]);

      const res = await request(app)
        .get('/api/roadmaps/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.categories).toHaveLength(1);
      expect(res.body.categories[0].slug).toBe('coding-tech');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/categories');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/templates', () => {
    it('should return all templates', async () => {
      mockedRepo.getTemplates.mockResolvedValue([mockTemplate]);

      const res = await request(app)
        .get('/api/roadmaps/templates')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.templates).toHaveLength(1);
    });

    it('should filter by category', async () => {
      mockedRepo.getTemplates.mockResolvedValue([mockTemplate]);

      const res = await request(app)
        .get('/api/roadmaps/templates?category=coding-tech')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRepo.getTemplates).toHaveBeenCalledWith('coding-tech');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/templates');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/templates/featured', () => {
    it('should return featured templates', async () => {
      mockedRepo.getFeaturedTemplates.mockResolvedValue([mockTemplate]);

      const res = await request(app)
        .get('/api/roadmaps/templates/featured')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.templates).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/templates/featured');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/templates/:slug', () => {
    it('should return template by slug', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue({ ...mockTemplate, tasks: [] });

      const res = await request(app)
        .get('/api/roadmaps/templates/crack-the-job-together')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.template.slug).toBe('crack-the-job-together');
    });

    it('should return 404 for nonexistent template', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/roadmaps/templates/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/templates/some-slug');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/roadmaps', () => {
    it('should create a user roadmap', async () => {
      mockedRepo.createUserRoadmap.mockResolvedValue(mockRoadmap);
      mockedRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', `Bearer ${token}`)
        .send({
          templateId: 'tmpl-1',
          name: 'My DSA Roadmap',
          durationDays: 90,
        });

      expect(res.status).toBe(201);
      expect(res.body.roadmap.name).toBe('My DSA Roadmap');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/roadmaps')
        .send({ name: 'Roadmap', durationDays: 30 });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/active', () => {
    it('should return active roadmaps', async () => {
      mockedRepo.getActiveRoadmaps.mockResolvedValue([mockRoadmap]);

      const res = await request(app)
        .get('/api/roadmaps/active')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmaps).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/active');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/all', () => {
    it('should return all user roadmaps', async () => {
      mockedRepo.getAllRoadmaps.mockResolvedValue([mockRoadmap]);

      const res = await request(app)
        .get('/api/roadmaps/all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmaps).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/all');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/today', () => {
    it('should return today tasks', async () => {
      mockedRepo.getTodayTasks.mockResolvedValue([
        {
          roadmap_id: 'roadmap-1',
          roadmap_name: 'My DSA Roadmap',
          day_number: 5,
          title: 'Arrays & Hashing',
          description: null,
          task_type: 'study',
          link: null,
          completed: false,
        },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/today')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/today');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/:id', () => {
    it('should return roadmap by id', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.getTemplateTasks.mockResolvedValue([]);
      mockedRepo.getDayProgress.mockResolvedValue([mockDayProgress]);
      mockedRepo.getStreak.mockResolvedValue(mockStreak);

      const res = await request(app)
        .get('/api/roadmaps/roadmap-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmap.name).toBe('My DSA Roadmap');
    });

    it('should return 404 for nonexistent roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/roadmaps/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/roadmap-1');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/roadmaps/:id', () => {
    it('should update a roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.updateRoadmap.mockResolvedValue({ ...mockRoadmap, name: 'Updated Name' });

      const res = await request(app)
        .patch('/api/roadmaps/roadmap-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
    });

    it('should return 404 for nonexistent roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/roadmaps/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('should return 403 for other user roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue({ ...mockRoadmap, user_id: 'other-user' });

      const res = await request(app)
        .patch('/api/roadmaps/roadmap-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Hacked' });

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .patch('/api/roadmaps/roadmap-1')
        .send({ name: 'Updated' });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/roadmaps/:id', () => {
    it('should delete a roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.deleteRoadmap.mockResolvedValue();

      const res = await request(app)
        .delete('/api/roadmaps/roadmap-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Roadmap deleted');
    });

    it('should return 404 for nonexistent roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/roadmaps/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 403 for other user roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue({ ...mockRoadmap, user_id: 'other-user' });

      const res = await request(app)
        .delete('/api/roadmaps/roadmap-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).delete('/api/roadmaps/roadmap-1');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/roadmaps/:id/progress', () => {
    it('should update day progress', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.updateDayProgress.mockResolvedValue(mockDayProgress);
      mockedRepo.updateStreak.mockResolvedValue(mockStreak);
      mockedRepo.getDayProgress.mockResolvedValue([mockDayProgress]);
      mockedRepo.addPoints.mockResolvedValue();

      const res = await request(app)
        .put('/api/roadmaps/roadmap-1/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ day: 1, completed: true });

      expect(res.status).toBe(200);
      expect(res.body.progress).toBeDefined();
    });

    it('should return 404 for nonexistent roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/roadmaps/nonexistent/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ day: 1, completed: true });

      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .put('/api/roadmaps/roadmap-1/progress')
        .send({ day: 1, completed: true });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/:id/progress', () => {
    it('should return day progress', async () => {
      mockedRepo.getDayProgress.mockResolvedValue([mockDayProgress]);

      const res = await request(app)
        .get('/api/roadmaps/roadmap-1/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/roadmap-1/progress');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/:id/streak', () => {
    it('should return streak data', async () => {
      mockedRepo.getStreak.mockResolvedValue(mockStreak);

      const res = await request(app)
        .get('/api/roadmaps/roadmap-1/streak')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.streak.current_streak).toBe(5);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/roadmap-1/streak');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/:id/leaderboard', () => {
    it('should return roadmap leaderboard', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.getLeaderboard.mockResolvedValue([
        { user_id: 'user-1', display_name: 'User One', avatar_url: null, completed_count: 10, current_streak: 5 },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/roadmap-1/leaderboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(1);
    });

    it('should return 404 for nonexistent roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/roadmaps/nonexistent/leaderboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/roadmap-1/leaderboard');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/share/:code', () => {
    it('should return roadmap by share code', async () => {
      mockedRepo.getByShareCode.mockResolvedValue(mockRoadmap);

      const res = await request(app)
        .get('/api/roadmaps/share/abc123')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmap.share_code).toBe('abc123');
    });

    it('should return 404 for invalid share code', async () => {
      mockedRepo.getByShareCode.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/roadmaps/share/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return roadmap without token (public route)', async () => {
      mockedRepo.getByShareCode.mockResolvedValue(mockRoadmap);

      const res = await request(app).get('/api/roadmaps/share/abc123');
      expect(res.status).toBe(200);
      expect(res.body.roadmap.share_code).toBe('abc123');
    });
  });

  describe('POST /api/roadmaps/:id/link-group', () => {
    it('should link a group to roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.linkGroup.mockResolvedValue();
      // Mock the queryOne for group membership check
      const { queryOne } = require('../../config/database');
      queryOne.mockResolvedValue({ user_id: 'user-1' });

      const res = await request(app)
        .post('/api/roadmaps/roadmap-1/link-group')
        .set('Authorization', `Bearer ${token}`)
        .send({ groupId: 'group-1' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Group linked');
    });

    it('should return 403 for other user roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue({ ...mockRoadmap, user_id: 'other-user' });

      const res = await request(app)
        .post('/api/roadmaps/roadmap-1/link-group')
        .set('Authorization', `Bearer ${token}`)
        .send({ groupId: 'group-1' });

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/roadmaps/roadmap-1/link-group')
        .send({ groupId: 'group-1' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/roadmaps/templates/:slug/participants', () => {
    it('should return template participants', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue({ ...mockTemplate, tasks: [] });
      mockedRepo.getParticipants.mockResolvedValue([
        { user_id: 'user-1', display_name: 'User One', avatar_url: null, joined_at: new Date(), current_streak: 5, completed_days: 10 },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/templates/crack-the-job-together/participants')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.participants).toHaveLength(1);
    });

    it('should return 404 for nonexistent template', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/roadmaps/templates/nonexistent/participants')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roadmaps/templates/some-slug/participants');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/roadmaps/templates/:slug/discussions', () => {
    it('should create a discussion', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue({ ...mockTemplate, tasks: [] });
      mockedRepo.createDiscussion.mockResolvedValue({
        id: 'disc-1',
        template_id: 'tmpl-1',
        user_id: 'user-1',
        content: 'Great roadmap!',
        parent_id: null,
        created_at: new Date(),
      });

      const res = await request(app)
        .post('/api/roadmaps/templates/crack-the-job-together/discussions')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Great roadmap!' });

      expect(res.status).toBe(201);
      expect(res.body.discussion.content).toBe('Great roadmap!');
    });

    it('should return 404 for nonexistent template', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/roadmaps/templates/nonexistent/discussions')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Hello' });

      expect(res.status).toBe(404);
    });

    it('should return 400 for empty content', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue({ ...mockTemplate, tasks: [] });

      const res = await request(app)
        .post('/api/roadmaps/templates/crack-the-job-together/discussions')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/roadmaps/templates/some-slug/discussions')
        .send({ content: 'test' });

      expect(res.status).toBe(401);
    });
  });
});
