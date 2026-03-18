import { progressRepository } from '../repository/progress.repository';
import { ProblemStatus } from '../../../common/types';

export const progressService = {
  async updateStatus(userId: string, problemId: string, status: ProblemStatus) {
    return progressRepository.upsert(userId, problemId, status);
  },

  async getUserProgress(userId: string) {
    return progressRepository.getUserProgress(userId);
  },

  async getUserProgressForSheet(userId: string, sheetSlug: string) {
    return progressRepository.getUserProgressForSheet(userId, sheetSlug);
  },
};
