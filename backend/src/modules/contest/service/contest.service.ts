import { contestRepository } from '../repository/contest.repository';
import { AppError } from '../../../common/errors/AppError';
import { groupRepository } from '../../group/repository/group.repository';

export const contestService = {
  async create(groupId: string, userId: string, data: {
    title: string;
    description?: string;
    startsAt: string;
    endsAt: string;
    problemIds?: string[];
  }) {
    const member = await groupRepository.getMember(groupId, userId);
    if (!member) throw AppError.forbidden('Not a member of this group');
    if (member.role !== 'admin') throw AppError.forbidden('Only group admins can create contests');

    if (new Date(data.endsAt) <= new Date(data.startsAt)) {
      throw AppError.badRequest('End time must be after start time');
    }

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

  async getForGroup(groupId: string, userId: string) {
    const isMember = await groupRepository.isMember(groupId, userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');
    return contestRepository.getForGroup(groupId);
  },

  async getDetails(contestId: string, userId: string) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw AppError.notFound('Contest not found');

    const isMember = await groupRepository.isMember(contest.group_id, userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');

    const problems = await contestRepository.getProblems(contestId);
    const standings = await contestRepository.getStandings(contestId);

    return { ...contest, problems, standings };
  },

  async submit(contestId: string, userId: string, problemId: string) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw AppError.notFound('Contest not found');

    const isMember = await groupRepository.isMember(contest.group_id, userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');

    const now = new Date();
    if (now < new Date(contest.starts_at)) throw AppError.badRequest('Contest has not started yet');
    if (now > new Date(contest.ends_at)) throw AppError.badRequest('Contest has ended');

    return contestRepository.submit(contestId, userId, problemId);
  },
};
