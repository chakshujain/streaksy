import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { roadmapsRepository } from '../../modules/roadmaps/repository/roadmaps.repository';
import { badgeRepository } from '../../modules/badge/repository/badge.repository';

jest.mock('../../modules/roadmaps/repository/roadmaps.repository');
jest.mock('../../modules/badge/repository/badge.repository');
jest.mock('../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, basePoints: 10, streakBonus: 5, multipliers: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedRoadmapsRepo = roadmapsRepository as jest.Mocked<typeof roadmapsRepository>;
const mockedBadgeRepo = badgeRepository as jest.Mocked<typeof badgeRepository>;

describe('E2E Journey: Roadmap Lifecycle', () => {
  const userId = 'user-lifecycle';
  const email = 'lifecycle@test.com';
  const token = generateTestToken(userId, email);

  const templateSlug = 'go-to-gym-daily';
  const roadmapId = 'roadmap-gym';

  const mockRoadmap = {
    id: roadmapId, user_id: userId, template_id: 'tmpl-gym',
    group_id: null, name: 'Daily Gym Challenge', category_id: 'cat-fitness',
    duration_days: 30, start_date: '2026-03-01', status: 'active' as string,
    custom_tasks: null, share_code: 'gym-code', created_at: new Date(),
    updated_at: new Date(), completed_days: 0,
    template_slug: templateSlug,
    category_slug: 'fitness-health', category_icon: 'Dumbbell',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Start a 30-day fitness roadmap', () => {
    it('should create the roadmap', async () => {
      mockedRoadmapsRepo.createUserRoadmap.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', `Bearer ${token}`)
        .send({ templateId: 'tmpl-gym', name: 'Daily Gym Challenge', durationDays: 30 });

      expect(res.status).toBe(201);
      expect(res.body.roadmap.duration_days).toBe(30);
      expect(res.body.roadmap.status).toBe('active');
    });

    it('should view roadmap details with empty progress', async () => {
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.getTemplateTasks.mockResolvedValue([
        { id: 'task-1', day_number: 1, title: 'Warm-up day', description: 'Start easy', task_type: 'exercise', link: null },
        { id: 'task-2', day_number: 2, title: 'Cardio focus', description: 'Run 2km', task_type: 'exercise', link: null },
      ]);
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue([]);
      mockedRoadmapsRepo.getStreak.mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmap.name).toBe('Daily Gym Challenge');
      expect(res.body.tasks).toHaveLength(2);
      expect(res.body.progress).toHaveLength(0);
    });
  });

  describe('Step 2: Complete tasks day by day', () => {
    const completeDayN = (dayNumber: number, currentStreak: number) => {
      return async () => {
        const dayProgress = {
          roadmap_id: roadmapId, user_id: userId,
          day_number: dayNumber, completed: true, completed_at: new Date(), notes: null,
        };
        const streak = {
          id: 'streak-gym', roadmap_id: roadmapId, user_id: userId,
          current_streak: currentStreak, longest_streak: currentStreak,
          last_activity_date: `2026-03-${String(dayNumber).padStart(2, '0')}`,
        };

        mockedRoadmapsRepo.getRoadmapById.mockResolvedValue({
          ...mockRoadmap, completed_days: dayNumber - 1,
        });
        mockedRoadmapsRepo.updateDayProgress.mockResolvedValue(dayProgress);
        mockedRoadmapsRepo.updateStreak.mockResolvedValue(streak);
        mockedRoadmapsRepo.getDayProgress.mockResolvedValue(
          Array.from({ length: dayNumber }, (_, i) => ({
            roadmap_id: roadmapId, user_id: userId,
            day_number: i + 1, completed: true, completed_at: new Date(), notes: null,
          }))
        );
        mockedRoadmapsRepo.addPoints.mockResolvedValue();

        const res = await request(app)
          .put(`/api/roadmaps/${roadmapId}/progress`)
          .set('Authorization', `Bearer ${token}`)
          .send({ day: dayNumber, completed: true });

        expect(res.status).toBe(200);
        expect(res.body.progress).toBeDefined();
      };
    };

    it('should complete day 1', completeDayN(1, 1));
    it('should complete day 2 with growing streak', completeDayN(2, 2));
    it('should complete day 3 with 3-day streak', completeDayN(3, 3));
    it('should complete day 7 with week-long streak', completeDayN(7, 7));
  });

  describe('Step 3: Verify growing streak and points', () => {
    it('should show a 7-day streak after a week of consistency', async () => {
      mockedRoadmapsRepo.getStreak.mockResolvedValue({
        id: 'streak-gym', roadmap_id: roadmapId, user_id: userId,
        current_streak: 7, longest_streak: 7, last_activity_date: '2026-03-07',
      });

      const res = await request(app)
        .get(`/api/roadmaps/${roadmapId}/streak`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.streak.current_streak).toBe(7);
      expect(res.body.streak.longest_streak).toBe(7);
    });

    it('should show correct progress for completed days', async () => {
      const allProgress = Array.from({ length: 7 }, (_, i) => ({
        roadmap_id: roadmapId, user_id: userId,
        day_number: i + 1, completed: true, completed_at: new Date(), notes: null,
      }));
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue(allProgress);

      const res = await request(app)
        .get(`/api/roadmaps/${roadmapId}/progress`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(7);
      expect(res.body.progress.every((p: any) => p.completed)).toBe(true);
    });
  });

  describe('Step 4: Earn badges through milestones', () => {
    it('should show earned badges after streak milestones', async () => {
      mockedBadgeRepo.getUserBadges.mockResolvedValue([
        {
          user_id: userId, badge_id: 'badge-streak-7', earned_at: new Date(),
          name: '7-Day Streak', description: 'Maintained a 7-day streak',
          icon: 'Fire', category: 'streak',
        },
        {
          user_id: userId, badge_id: 'badge-first-roadmap', earned_at: new Date(),
          name: 'First Roadmap', description: 'Started your first roadmap',
          icon: 'Map', category: 'milestone',
        },
      ]);

      const res = await request(app)
        .get('/api/badges/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges).toHaveLength(2);
      expect(res.body.badges.some((b: any) => b.name === '7-Day Streak')).toBe(true);
    });
  });

  describe('Step 5: Complete the full roadmap', () => {
    it('should mark the final day (day 30) as complete', async () => {
      const finalDayProgress = {
        roadmap_id: roadmapId, user_id: userId,
        day_number: 30, completed: true, completed_at: new Date(), notes: 'Finished!',
      };

      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue({
        ...mockRoadmap, completed_days: 29,
      });
      mockedRoadmapsRepo.updateDayProgress.mockResolvedValue(finalDayProgress);
      mockedRoadmapsRepo.updateStreak.mockResolvedValue({
        id: 'streak-gym', roadmap_id: roadmapId, user_id: userId,
        current_streak: 30, longest_streak: 30, last_activity_date: '2026-03-30',
      });
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue(
        Array.from({ length: 30 }, (_, i) => ({
          roadmap_id: roadmapId, user_id: userId,
          day_number: i + 1, completed: true, completed_at: new Date(), notes: null,
        }))
      );
      mockedRoadmapsRepo.addPoints.mockResolvedValue();

      const res = await request(app)
        .put(`/api/roadmaps/${roadmapId}/progress`)
        .set('Authorization', `Bearer ${token}`)
        .send({ day: 30, completed: true });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 6: Check final stats after completion', () => {
    it('should show 30-day streak after full completion', async () => {
      mockedRoadmapsRepo.getStreak.mockResolvedValue({
        id: 'streak-gym', roadmap_id: roadmapId, user_id: userId,
        current_streak: 30, longest_streak: 30, last_activity_date: '2026-03-30',
      });

      const res = await request(app)
        .get(`/api/roadmaps/${roadmapId}/streak`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.streak.current_streak).toBe(30);
    });

    it('should show all 30 days completed', async () => {
      const allProgress = Array.from({ length: 30 }, (_, i) => ({
        roadmap_id: roadmapId, user_id: userId,
        day_number: i + 1, completed: true, completed_at: new Date(), notes: null,
      }));
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue(allProgress);

      const res = await request(app)
        .get(`/api/roadmaps/${roadmapId}/progress`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(30);
    });

    it('should show completion badge', async () => {
      mockedBadgeRepo.getUserBadges.mockResolvedValue([
        {
          user_id: userId, badge_id: 'badge-completed', earned_at: new Date(),
          name: 'Roadmap Complete', description: 'Completed an entire roadmap',
          icon: 'CheckCircle', category: 'milestone',
        },
        {
          user_id: userId, badge_id: 'badge-streak-30', earned_at: new Date(),
          name: '30-Day Streak', description: 'Maintained a 30-day streak',
          icon: 'Flame', category: 'streak',
        },
      ]);

      const res = await request(app)
        .get('/api/badges/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.badges.some((b: any) => b.name === 'Roadmap Complete')).toBe(true);
      expect(res.body.badges.some((b: any) => b.name === '30-Day Streak')).toBe(true);
    });
  });

  describe('Step 7: Leave the roadmap', () => {
    it('should delete/leave the completed roadmap', async () => {
      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue({
        ...mockRoadmap, status: 'completed',
      });
      mockedRoadmapsRepo.deleteRoadmap.mockResolvedValue();

      const res = await request(app)
        .delete(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Roadmap deleted');
    });
  });

  describe('Step 8: Check history shows the roadmap existed', () => {
    it('should show roadmap in all roadmaps list (including completed/deleted)', async () => {
      mockedRoadmapsRepo.getAllRoadmaps.mockResolvedValue([
        { ...mockRoadmap, status: 'completed', completed_days: 30 },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmaps).toHaveLength(1);
      expect(res.body.roadmaps[0].status).toBe('completed');
      expect(res.body.roadmaps[0].completed_days).toBe(30);
    });

    it('should not show deleted roadmap in active list', async () => {
      mockedRoadmapsRepo.getActiveRoadmaps.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/roadmaps/active')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmaps).toHaveLength(0);
    });
  });
});
