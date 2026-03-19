import { contestRepository } from '../repository/contest.repository';
import { AppError } from '../../../common/errors/AppError';

export const contestService = {
  async create(groupId: string, userId: string, data: {
    title: string;
    description?: string;
    startsAt: string;
    endsAt: string;
    problemIds?: string[];
  }) {
    const contest = await contestRepository.create(
      groupId, data.title, data.description || null, data.startsAt, data.endsAt, userId
    );

    if (data.problemIds) {
      for (let i = 0; i < data.problemIds.length; i++) {
        await contestRepository.addProblem(contest.id, data.problemIds[i], i);
      }
    }

    return contest;
  },

  async getForGroup(groupId: string) {
    return contestRepository.getForGroup(groupId);
  },

  async getDetails(contestId: string) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw AppError.notFound('Contest not found');

    const problems = await contestRepository.getProblems(contestId);
    const standings = await contestRepository.getStandings(contestId);

    return { ...contest, problems, standings };
  },

  async submit(contestId: string, userId: string, problemId: string) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw AppError.notFound('Contest not found');

    const now = new Date();
    if (now < new Date(contest.starts_at)) throw AppError.badRequest('Contest has not started yet');
    if (now > new Date(contest.ends_at)) throw AppError.badRequest('Contest has ended');

    return contestRepository.submit(contestId, userId, problemId);
  },
};
