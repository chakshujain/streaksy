import { groupRepository } from '../../group/repository/group.repository';
import { roomRepository } from '../../room/repository/room.repository';
import { groupService } from '../../group/service/group.service';
import { roomService } from '../../room/service/room.service';
import { AppError } from '../../../common/errors/AppError';

export const inviteService = {
  /** Public: get group preview by invite code (no auth required) */
  async resolveGroup(code: string) {
    const group = await groupRepository.findByInviteCode(code);
    if (!group) throw AppError.notFound('Invalid invite link');
    const memberCount = await groupRepository.getMemberCount(group.id);
    return {
      type: 'group' as const,
      id: group.id,
      name: group.name,
      description: group.description,
      memberCount,
    };
  },

  /** Public: get room preview by code (no auth required) */
  async resolveRoom(code: string) {
    const room = await roomRepository.findByCode(code);
    if (!room) throw AppError.notFound('Invalid invite link');
    const participants = await roomRepository.getParticipants(room.id);
    return {
      type: 'room' as const,
      id: room.id,
      name: room.name,
      problemTitle: room.problem_title || null,
      problemDifficulty: room.problem_difficulty || null,
      status: room.status,
      participantCount: participants.length,
      timeLimitMinutes: room.time_limit_minutes,
      mode: room.mode,
    };
  },

  /** Authenticated: join group via invite code */
  async joinGroup(code: string, userId: string) {
    const group = await groupService.join(code, userId);
    return { id: group.id, name: group.name };
  },

  /** Authenticated: join room via code */
  async joinRoom(code: string, userId: string) {
    const room = await roomService.joinRoom(code, userId);
    return { id: room.id, name: room.name };
  },
};
