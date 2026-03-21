import { prepRepository } from '../repository/prep.repository';
import { AppError } from '../../../common/errors/AppError';
import { queryOne } from '../../../config/database';

export const prepService = {
  async create(
    userId: string,
    answers: Record<string, unknown>,
    days: Record<string, unknown>[],
    totalDays: number,
    groupId?: string
  ) {
    if (groupId) {
      const member = await queryOne<{ user_id: string }>(
        'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
      );
      if (!member) throw AppError.forbidden('Not a member of this group');
    }
    return prepRepository.create(userId, answers, days, totalDays, groupId);
  },

  async getActive(userId: string) {
    return prepRepository.getActive(userId);
  },

  async getById(id: string) {
    const roadmap = await prepRepository.getById(id);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return roadmap;
  },

  async getByShareCode(code: string) {
    const roadmap = await prepRepository.getByShareCode(code);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return roadmap;
  },

  async updateProgress(roadmapId: string, userId: string, dayNumber: number, completed: boolean) {
    const roadmap = await prepRepository.getById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return prepRepository.updateProgress(roadmapId, userId, dayNumber, completed);
  },

  async getProgress(roadmapId: string) {
    const roadmap = await prepRepository.getById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return prepRepository.getProgress(roadmapId);
  },

  async getUserProgress(roadmapId: string, userId: string) {
    return prepRepository.getUserProgress(roadmapId, userId);
  },

  async linkGroup(roadmapId: string, userId: string, groupId: string) {
    const roadmap = await prepRepository.getById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    if (roadmap.user_id !== userId) throw AppError.forbidden('Not your roadmap');

    const member = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
    if (!member) throw AppError.forbidden('Not a member of this group');

    await prepRepository.linkGroup(roadmapId, groupId);
  },

  async getLeaderboard(roadmapId: string) {
    const roadmap = await prepRepository.getById(roadmapId);
    if (!roadmap) throw AppError.notFound('Roadmap not found');
    return prepRepository.getLeaderboard(roadmapId);
  },
};
