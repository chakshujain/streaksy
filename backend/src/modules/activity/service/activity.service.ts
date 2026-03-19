import { activityRepository } from '../repository/activity.repository';

export const activityService = {
  async log(groupId: string, userId: string, action: string, metadata?: Record<string, unknown>) {
    // Fire and forget — don't let failures block the main flow
    return activityRepository.create(groupId, userId, action, metadata).catch(() => {});
  },

  async getForGroup(groupId: string, limit?: number, offset?: number) {
    return activityRepository.getForGroup(groupId, limit, offset);
  },
};
