import { problemRepository } from '../repository/problem.repository';
import { AppError } from '../../../common/errors/AppError';

export const problemService = {
  async list(difficulty?: string, limit?: number, offset?: number) {
    return problemRepository.list(difficulty, limit, offset);
  },

  async getBySlug(slug: string) {
    const problem = await problemRepository.findBySlug(slug);
    if (!problem) throw AppError.notFound('Problem not found');

    const tags = await problemRepository.getTagsForProblem(problem.id);
    return { ...problem, tags };
  },

  async getSheets() {
    return problemRepository.getSheets();
  },

  async getSheetProblems(sheetSlug: string) {
    return problemRepository.getSheetProblems(sheetSlug);
  },
};
