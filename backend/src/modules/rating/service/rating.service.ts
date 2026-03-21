import { ratingRepository } from '../repository/rating.repository';
import { cached, invalidate } from '../../../common/utils/cache';
import { logger } from '../../../config/logger';

export const ratingService = {
  async rate(userId: string, problemId: string, rating: number) {
    const result = await ratingRepository.upsert(userId, problemId, rating);
    await invalidate(`rating:stats:${problemId}`).catch(() => {});
    return result;
  },

  async getUserRating(userId: string, problemId: string) {
    return ratingRepository.getUserRating(userId, problemId);
  },

  async getStats(problemId: string) {
    return cached(`rating:stats:${problemId}`, 300, async () => {
      const stats = await ratingRepository.getStats(problemId);
      const distribution = await ratingRepository.getRatingDistribution(problemId);
      return { stats, distribution };
    });
  },

  async getStatsMultiple(problemIds: string[]) {
    return ratingRepository.getStatsMultiple(problemIds);
  },

  async listCompanyTags() {
    return cached('company:tags', 3600, () => ratingRepository.listCompanyTags());
  },

  async getCompanyTags(problemId: string) {
    return cached(`company:problem:${problemId}`, 600, () =>
      ratingRepository.getCompanyTagsForProblem(problemId)
    );
  },

  async reportCompanyTag(problemId: string, companyTagId: string, userId: string) {
    await ratingRepository.reportCompanyTag(problemId, companyTagId, userId);
    await invalidate(`company:problem:${problemId}`).catch(() => {});
    logger.info({ problemId, companyTagId, userId }, 'Company tag reported');
  },
};
