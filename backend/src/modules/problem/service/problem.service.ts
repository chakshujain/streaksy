import { problemRepository } from '../repository/problem.repository';
import { AppError } from '../../../common/errors/AppError';
import { cached } from '../../../common/utils/cache';

export const problemService = {
  async list(difficulty?: string, limit?: number, offset?: number) {
    const cacheKey = `problems:list:${difficulty || 'all'}:${limit || 0}:${offset || 0}`;
    return cached(cacheKey, 600, () => problemRepository.list(difficulty, limit, offset));
  },

  async getBySlug(slug: string) {
    const problem = await problemRepository.findBySlug(slug);
    if (!problem) throw AppError.notFound('Problem not found');

    const tags = await problemRepository.getTagsForProblem(problem.id);
    return { ...problem, tags };
  },

  async getSheets() {
    return cached('sheets:list', 600, () => problemRepository.getSheets());
  },

  async getSheetProblems(sheetSlug: string) {
    return problemRepository.getSheetProblems(sheetSlug);
  },

  async search(query: string, limit = 20) {
    return problemRepository.search(query, limit);
  },
};
