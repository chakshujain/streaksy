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

    // Notify all existing group members
    import('../../auth/repository/auth.repository').then(async m => {
      const joiner = await m.authRepository.findById(userId);
      if (!joiner) return;
      const members = await groupRepository.getMembers(group.id);
      const { notificationHub } = await import('../../notification/service/notification-hub');
      const otherIds = members.map(m => m.user_id).filter(id => id !== userId);
      await notificationHub.sendToMany(
        otherIds,
        'group_join',
        `${joiner.display_name} joined "${group.name}"`,
        'Your group is growing! Welcome the new member.',
        { groupId: group.id }
      );
    }).catch(() => {});

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

  async updatePlan(groupId: string, userId: string, data: { plan?: string; objective?: string; targetDate?: string }) {
    const member = await groupRepository.getMember(groupId, userId);
    if (!member || member.role !== 'admin') throw AppError.forbidden('Only admins can update the group plan');
    return groupRepository.updateGroupPlan(groupId, data);
  },

  async assignSheet(groupId: string, userId: string, sheetId: string) {
    const member = await groupRepository.getMember(groupId, userId);
    if (!member || member.role !== 'admin') throw AppError.forbidden('Only admins can assign sheets');
    await groupRepository.assignSheet(groupId, sheetId, userId);
  },

  async removeSheet(groupId: string, userId: string, sheetId: string) {
    const member = await groupRepository.getMember(groupId, userId);
    if (!member || member.role !== 'admin') throw AppError.forbidden('Only admins can remove sheets');
    await groupRepository.removeSheet(groupId, sheetId);
  },

  async getGroupSheets(groupId: string, userId?: string) {
    if (userId) {
      const isMember = await groupRepository.isMember(groupId, userId);
      if (!isMember) throw AppError.forbidden('Not a member of this group');
    }
    return groupRepository.getGroupSheets(groupId);
  },

  async getMemberSheetProgress(groupId: string, sheetId: string, userId?: string) {
    if (userId) {
      const isMember = await groupRepository.isMember(groupId, userId);
      if (!isMember) throw AppError.forbidden('Not a member of this group');
    }
    return groupRepository.getMemberSheetProgress(groupId, sheetId);
  },

  async leaveGroup(groupId: string, userId: string) {
    const member = await groupRepository.getMember(groupId, userId);
    if (!member) throw AppError.notFound('Not a member of this group');
    if (member.role === 'admin') {
      const count = await groupRepository.getMemberCount(groupId);
      if (count > 1) throw AppError.badRequest('Transfer admin role before leaving, or remove all members first');
    }
    await groupRepository.removeMember(groupId, userId);
  },

  async deleteGroup(groupId: string, userId: string) {
    const member = await groupRepository.getMember(groupId, userId);
    if (!member || member.role !== 'admin') throw AppError.forbidden('Only admin can delete the group');
    await groupRepository.deleteGroup(groupId);
  },
};
