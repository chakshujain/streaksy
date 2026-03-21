import { roadmapsRepository } from '../repository/roadmaps.repository';
import { AppError } from '../../../common/errors/AppError';
import { queryOne } from '../../../config/database';

const BASE_POINTS = 10;
const STREAK_BONUS_MULTIPLIER = 2;

export const roadmapsService = {
  async getCategories() {
    return roadmapsRepository.getCategories();
  },

  async getTemplates(categorySlug?: string) {
    return roadmapsRepository.getTemplates(categorySlug);
  },

  async getTemplateBySlug(slug: string) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    return template;
  },

  async getFeaturedTemplates() {
    return roadmapsRepository.getFeaturedTemplates();
  },

  async createUserRoadmap(
    userId: string,
    data: {
      templateId?: string;
      groupId?: string;
      name: string;
      categoryId?: string;
      durationDays: number;
      startDate?: string;
      customTasks?: unknown;
    }
  ) {
    if (data.groupId) {
      const member = await queryOne<{ user_id: string }>(
        'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
        [data.groupId, userId]
      );
      if (!member) throw AppError.forbidden('Not a member of this group');
    }
    const roadmap = await roadmapsRepository.createUserRoadmap(userId, data);

    // Auto-add user as participant on the template
    if (data.templateId) {
      await roadmapsRepository.addParticipant(data.templateId, userId, roadmap.id);
    }

    return roadmap;
  },

  async getActiveRoadmaps(userId: string) {
    return roadmapsRepository.getActiveRoadmaps(userId);
  },

  async getAllRoadmaps(userId: string) {
    return roadmapsRepository.getAllRoadmaps(userId);
  },

  async getRoadmapById(id: string, userId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(id);
    if (!roadmap) throw AppError.notFound('Roadmap not found');

    // Get tasks (from template or custom)
    let tasks = null;
    if (roadmap.template_id) {
      tasks = await roadmapsRepository.getTemplateTasks(roadmap.template_id);
    }

    // Get progress
    const progress = await roadmapsRepository.getDayProgress(id, userId);

    // Get streak
    const streak = await roadmapsRepository.getStreak(id, userId);

    return { roadmap, tasks, progress, streak };
  },

  async updateRoadmap(id: string, userId: string, data: { status?: string; name?: string }) {
    const roadmap = await roadmapsRepository.getRoadmapById(id);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');
    return roadmapsRepository.updateRoadmap(id, data);
  },

  async deleteRoadmap(id: string, userId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(id);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');
    await roadmapsRepository.deleteRoadmap(id);
  },

  async updateDayProgress(roadmapId: string, userId: string, dayNumber: number, completed: boolean) {
    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');

    const progress = await roadmapsRepository.updateDayProgress(roadmapId, userId, dayNumber, completed);

    let streak = null;
    let pointsEarned = 0;

    if (completed) {
      // Update streak
      streak = await roadmapsRepository.updateStreak(roadmapId, userId);

      // Calculate points: base + streak bonus
      pointsEarned = BASE_POINTS + (streak.current_streak > 1 ? streak.current_streak * STREAK_BONUS_MULTIPLIER : 0);

      // Add to global total_points
      await roadmapsRepository.addPoints(userId, pointsEarned);

      // Check if roadmap is now complete
      const allProgress = await roadmapsRepository.getDayProgress(roadmapId, userId);
      const completedCount = allProgress.filter(p => p.completed).length;
      if (completedCount >= roadmap.duration_days) {
        await roadmapsRepository.updateRoadmap(roadmapId, { status: 'completed' });
      }
    }

    return { progress, streak, pointsEarned };
  },

  async getDayProgress(roadmapId: string, userId?: string) {
    return roadmapsRepository.getDayProgress(roadmapId, userId);
  },

  async getStreak(roadmapId: string, userId: string) {
    return roadmapsRepository.getStreak(roadmapId, userId);
  },

  async getLeaderboard(roadmapId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return roadmapsRepository.getLeaderboard(roadmapId);
  },

  async getByShareCode(code: string) {
    const roadmap = await roadmapsRepository.getByShareCode(code);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return roadmap;
  },

  async linkGroup(roadmapId: string, userId: string, groupId: string) {
    const roadmap = await roadmapsRepository.getRoadmapById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');

    const member = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
    if (!member) throw AppError.forbidden('Not a member of this group');

    await roadmapsRepository.linkGroup(roadmapId, groupId);
  },

  async getTodayTasks(userId: string) {
    return roadmapsRepository.getTodayTasks(userId);
  },

  async getGlobalLeaderboard() {
    return roadmapsRepository.getGlobalLeaderboard(50);
  },

  async getParticipants(slug: string) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    return roadmapsRepository.getParticipants(template.id);
  },

  async getDiscussions(slug: string, limit?: number, offset?: number) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    return roadmapsRepository.getDiscussions(template.id, limit, offset);
  },

  async createDiscussion(slug: string, userId: string, content: string, parentId?: string) {
    const template = await roadmapsRepository.getTemplateBySlug(slug);
    if (!template) throw AppError.notFound('Template not found');
    if (!content || content.trim().length === 0) throw AppError.badRequest('Content is required');
    return roadmapsRepository.createDiscussion(template.id, userId, content.trim(), parentId);
  },
};
