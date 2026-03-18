import { groupRepository } from '../repository/group.repository';
import { AppError } from '../../../common/errors/AppError';

export const groupService = {
  async create(name: string, description: string | undefined, userId: string) {
    return groupRepository.create(name, description, userId);
  },

  async join(inviteCode: string, userId: string) {
    const group = await groupRepository.findByInviteCode(inviteCode);
    if (!group) throw AppError.notFound('Invalid invite code');

    const already = await groupRepository.isMember(group.id, userId);
    if (already) throw AppError.conflict('Already a member of this group');

    await groupRepository.addMember(group.id, userId);
    return group;
  },

  async getDetails(groupId: string, userId: string) {
    const group = await groupRepository.findById(groupId);
    if (!group) throw AppError.notFound('Group not found');

    const isMember = await groupRepository.isMember(groupId, userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');

    const members = await groupRepository.getMembers(groupId);
    return { ...group, members };
  },

  async getUserGroups(userId: string) {
    return groupRepository.getUserGroups(userId);
  },
};
