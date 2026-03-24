import { inviteService } from '../../../modules/invite/service/invite.service';
import { groupRepository } from '../../../modules/group/repository/group.repository';
import { roomRepository } from '../../../modules/room/repository/room.repository';
import { groupService } from '../../../modules/group/service/group.service';
import { roomService } from '../../../modules/room/service/room.service';

jest.mock('../../../modules/group/repository/group.repository');
jest.mock('../../../modules/room/repository/room.repository');
jest.mock('../../../modules/group/service/group.service');
jest.mock('../../../modules/room/service/room.service');

const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedRoomRepo = roomRepository as jest.Mocked<typeof roomRepository>;
const mockedGroupService = groupService as jest.Mocked<typeof groupService>;
const mockedRoomService = roomService as jest.Mocked<typeof roomService>;

describe('inviteService', () => {
  const mockGroup = {
    id: 'group-1',
    name: 'DSA Study Group',
    description: 'A test group',
    invite_code: 'abc123',
    created_by: 'user-1',
    created_at: new Date(),
    plan: null,
    objective: null,
    target_date: null,
  };

  const mockRoom = {
    id: 'room-1',
    name: 'DSA Battle',
    code: 'ROOM1234',
    problem_id: 'prob-1',
    host_id: 'user-1',
    status: 'waiting',
    time_limit_minutes: 30,
    started_at: null,
    ended_at: null,
    created_at: new Date(),
    scheduled_at: null,
    sheet_id: null,
    mode: 'single',
    recurrence: null,
    meet_link: null,
    calendar_event_id: null,
    group_id: null,
    roadmap_id: null,
    problem_title: 'Two Sum',
    problem_difficulty: 'easy',
  };

  const mockParticipants = [
    {
      room_id: 'room-1',
      user_id: 'user-1',
      status: 'joined',
      solved_at: null,
      code: null,
      language: null,
      runtime_ms: null,
      memory_kb: null,
      joined_at: new Date(),
      display_name: 'User One',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveGroup', () => {
    it('should return group preview by invite code', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMemberCount.mockResolvedValue(5);

      const result = await inviteService.resolveGroup('abc123');

      expect(mockedGroupRepo.findByInviteCode).toHaveBeenCalledWith('abc123');
      expect(mockedGroupRepo.getMemberCount).toHaveBeenCalledWith('group-1');
      expect(result).toEqual({
        type: 'group',
        id: 'group-1',
        name: 'DSA Study Group',
        description: 'A test group',
        memberCount: 5,
      });
    });

    it('should throw notFound for invalid invite code', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(null);

      await expect(
        inviteService.resolveGroup('invalid-code')
      ).rejects.toThrow('Invalid invite link');
      await expect(
        inviteService.resolveGroup('invalid-code')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('resolveRoom', () => {
    it('should return room preview by code', async () => {
      mockedRoomRepo.findByCode.mockResolvedValue(mockRoom);
      mockedRoomRepo.getParticipants.mockResolvedValue(mockParticipants);

      const result = await inviteService.resolveRoom('ROOM1234');

      expect(mockedRoomRepo.findByCode).toHaveBeenCalledWith('ROOM1234');
      expect(mockedRoomRepo.getParticipants).toHaveBeenCalledWith('room-1');
      expect(result).toEqual({
        type: 'room',
        id: 'room-1',
        name: 'DSA Battle',
        problemTitle: 'Two Sum',
        problemDifficulty: 'easy',
        status: 'waiting',
        participantCount: 1,
        timeLimitMinutes: 30,
        mode: 'single',
      });
    });

    it('should throw notFound for invalid room code', async () => {
      mockedRoomRepo.findByCode.mockResolvedValue(null);

      await expect(
        inviteService.resolveRoom('INVALID')
      ).rejects.toThrow('Invalid invite link');
      await expect(
        inviteService.resolveRoom('INVALID')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should return null for problemTitle when not available', async () => {
      const roomWithoutProblem = { ...mockRoom, problem_title: undefined, problem_difficulty: undefined };
      mockedRoomRepo.findByCode.mockResolvedValue(roomWithoutProblem);
      mockedRoomRepo.getParticipants.mockResolvedValue([]);

      const result = await inviteService.resolveRoom('ROOM1234');

      expect(result.problemTitle).toBeNull();
      expect(result.problemDifficulty).toBeNull();
      expect(result.participantCount).toBe(0);
    });
  });

  describe('joinGroup', () => {
    it('should join a group via invite code and return id and name', async () => {
      mockedGroupService.join.mockResolvedValue(mockGroup);

      const result = await inviteService.joinGroup('abc123', 'user-2');

      expect(mockedGroupService.join).toHaveBeenCalledWith('abc123', 'user-2');
      expect(result).toEqual({ id: 'group-1', name: 'DSA Study Group' });
    });

    it('should propagate errors from group service', async () => {
      mockedGroupService.join.mockRejectedValue(new Error('Group not found'));

      await expect(
        inviteService.joinGroup('invalid', 'user-2')
      ).rejects.toThrow('Group not found');
    });
  });

  describe('joinRoom', () => {
    it('should join a room via code and return id and name', async () => {
      mockedRoomService.joinRoom.mockResolvedValue(mockRoom);

      const result = await inviteService.joinRoom('ROOM1234', 'user-2');

      expect(mockedRoomService.joinRoom).toHaveBeenCalledWith('ROOM1234', 'user-2');
      expect(result).toEqual({ id: 'room-1', name: 'DSA Battle' });
    });

    it('should propagate errors from room service', async () => {
      mockedRoomService.joinRoom.mockRejectedValue(new Error('Room not found'));

      await expect(
        inviteService.joinRoom('INVALID', 'user-2')
      ).rejects.toThrow('Room not found');
    });
  });
});
