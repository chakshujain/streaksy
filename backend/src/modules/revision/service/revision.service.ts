import { revisionRepository } from '../repository/revision.repository';
import { AppError } from '../../../common/errors/AppError';

export const revisionService = {
  async createOrUpdate(userId: string, problemId: string, data: {
    keyTakeaway: string;
    approach?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    tags?: string[];
    difficultyRating?: string;
  }) {
    return revisionRepository.createOrUpdate(userId, problemId, data);
  },

  async getRevisionCards(userId: string, filters?: { tag?: string; difficulty?: string; limit?: number; offset?: number }) {
    return revisionRepository.getForUser(userId, filters);
  },

  async getRevisionQuiz(userId: string, count = 10) {
    return revisionRepository.getRandomForRevision(userId, count);
  },

  async getByProblem(userId: string, problemId: string) {
    return revisionRepository.getByProblem(userId, problemId);
  },

  async markRevised(id: string, userId: string) {
    const note = await revisionRepository.findById(id);
    if (!note) throw AppError.notFound('Revision note not found');
    if (note.user_id !== userId) throw AppError.forbidden('Not your revision note');
    await revisionRepository.markRevised(id, userId);
  },

  async delete(id: string, userId: string) {
    const note = await revisionRepository.findById(id);
    if (!note) throw AppError.notFound('Revision note not found');
    if (note.user_id !== userId) throw AppError.forbidden('Not your revision note');
    await revisionRepository.delete(id, userId);
  },
};
