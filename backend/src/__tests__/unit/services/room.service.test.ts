import { roomService } from '../../../modules/room/service/room.service';
import { roomRepository } from '../../../modules/room/repository/room.repository';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/room/repository/room.repository');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockReturnValue({ toString: () => 'ABCD1234' }),
}));

const mockedRepo = roomRepository as jest.Mocked<typeof roomRepository>;

describe('roomService', () => {
  const mockRoom = {
    id: 'room-1',
    name: 'DSA Battle',
    code: 'ABCD1234',
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

  describe('createRoom', () => {
    it('should create a room and add host as participant', async () => {
      mockedRepo.create.mockResolvedValue(mockRoom);
      mockedRepo.addParticipant.mockResolvedValue();
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.addProblems.mockResolvedValue();

      const result = await roomService.createRoom('user-1', 'DSA Battle', 'prob-1', 30);

      expect(mockedRepo.create).toHaveBeenCalled();
      expect(mockedRepo.addParticipant).toHaveBeenCalledWith('room-1', 'user-1');
      expect(mockedRepo.addProblems).toHaveBeenCalledWith('room-1', ['prob-1']);
      expect(result).toEqual(mockRoom);
    });

    it('should create a room with multiple problems', async () => {
      mockedRepo.create.mockResolvedValue(mockRoom);
      mockedRepo.addParticipant.mockResolvedValue();
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.addProblems.mockResolvedValue();

      await roomService.createRoom('user-1', 'DSA Battle', null, 30, {
        problemIds: ['prob-1', 'prob-2'],
        mode: 'multi',
      });

      expect(mockedRepo.addProblems).toHaveBeenCalledWith('room-1', ['prob-1', 'prob-2']);
    });
  });

  describe('joinRoom', () => {
    it('should join a room by code', async () => {
      mockedRepo.findByCode.mockResolvedValue(mockRoom);
      mockedRepo.addParticipant.mockResolvedValue();

      const result = await roomService.joinRoom('ABCD1234', 'user-2');

      expect(mockedRepo.findByCode).toHaveBeenCalledWith('ABCD1234');
      expect(mockedRepo.addParticipant).toHaveBeenCalledWith('room-1', 'user-2');
      expect(result).toEqual(mockRoom);
    });

    it('should throw notFound for invalid code', async () => {
      mockedRepo.findByCode.mockResolvedValue(null);

      await expect(roomService.joinRoom('INVALID', 'user-2')).rejects.toThrow('Room not found');
      await expect(roomService.joinRoom('INVALID', 'user-2')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('should throw badRequest when room has ended', async () => {
      mockedRepo.findByCode.mockResolvedValue({ ...mockRoom, status: 'finished' });

      await expect(roomService.joinRoom('ABCD1234', 'user-2')).rejects.toThrow('Room has ended');
      await expect(roomService.joinRoom('ABCD1234', 'user-2')).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe('getRoom', () => {
    it('should return room with participants and messages', async () => {
      const messages = [{ id: 'msg-1', room_id: 'room-1', user_id: 'user-1', content: 'Hello', created_at: new Date() }];
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);
      mockedRepo.getMessages.mockResolvedValue(messages);

      const result = await roomService.getRoom('room-1', 'user-1');

      expect(result).toEqual({ ...mockRoom, participants: mockParticipants, messages });
    });

    it('should throw notFound when room does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(roomService.getRoom('bad-id', 'user-1')).rejects.toThrow('Room not found');
    });

    it('should throw forbidden when user is not a participant', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);

      await expect(roomService.getRoom('room-1', 'user-999')).rejects.toThrow(
        'You are not a participant of this room'
      );
      await expect(roomService.getRoom('room-1', 'user-999')).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('startRoom', () => {
    it('should start a waiting room', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.updateStatus.mockResolvedValue();
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);
      const startedRoom = { ...mockRoom, status: 'active' };
      mockedRepo.findById.mockResolvedValueOnce(mockRoom).mockResolvedValueOnce(startedRoom);

      const result = await roomService.startRoom('room-1', 'user-1');

      expect(mockedRepo.updateStatus).toHaveBeenCalledWith('room-1', 'active');
    });

    it('should throw notFound when room does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(roomService.startRoom('bad-id', 'user-1')).rejects.toThrow('Room not found');
    });

    it('should throw forbidden when non-host tries to start', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);

      await expect(roomService.startRoom('room-1', 'user-2')).rejects.toThrow(
        'Only the host can start the room'
      );
      await expect(roomService.startRoom('room-1', 'user-2')).rejects.toMatchObject({
        statusCode: 403,
      });
    });

    it('should throw badRequest when room already started', async () => {
      mockedRepo.findById.mockResolvedValue({ ...mockRoom, status: 'active' });

      await expect(roomService.startRoom('room-1', 'user-1')).rejects.toThrow(
        'Room already started'
      );
    });
  });

  describe('endRoom', () => {
    it('should end a room and update stats', async () => {
      mockedRepo.findById.mockResolvedValue({ ...mockRoom, status: 'active' });
      mockedRepo.updateStatus.mockResolvedValue();
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);
      mockedRepo.updateStats.mockResolvedValue();

      await roomService.endRoom('room-1', 'user-1');

      expect(mockedRepo.updateStatus).toHaveBeenCalledWith('room-1', 'finished');
      expect(mockedRepo.updateStats).toHaveBeenCalledWith('user-1');
    });

    it('should throw notFound when room does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(roomService.endRoom('bad-id', 'user-1')).rejects.toThrow('Room not found');
    });

    it('should throw forbidden when non-host tries to end', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);

      await expect(roomService.endRoom('room-1', 'user-2')).rejects.toThrow(
        'Only the host can end the room'
      );
    });
  });

  describe('markSolved', () => {
    it('should mark a problem as solved in an active room', async () => {
      mockedRepo.findById.mockResolvedValue({ ...mockRoom, status: 'active' });
      mockedRepo.markSolved.mockResolvedValue();
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);

      const result = await roomService.markSolved('room-1', 'user-1');

      expect(mockedRepo.markSolved).toHaveBeenCalledWith('room-1', 'user-1', null, null, null, null);
      expect(result).toEqual(mockParticipants);
    });

    it('should throw notFound when room does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(roomService.markSolved('bad-id', 'user-1')).rejects.toThrow('Room not found');
    });

    it('should throw badRequest when room is not active', async () => {
      mockedRepo.findById.mockResolvedValue({ ...mockRoom, status: 'waiting' });

      await expect(roomService.markSolved('room-1', 'user-1')).rejects.toThrow(
        'Room is not active'
      );
      await expect(roomService.markSolved('room-1', 'user-1')).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe('sendMessage', () => {
    it('should send a message in a room', async () => {
      const mockMsg = { id: 'msg-1', room_id: 'room-1', user_id: 'user-1', content: 'Hello', created_at: new Date() };
      mockedRepo.addMessage.mockResolvedValue(mockMsg);

      const result = await roomService.sendMessage('room-1', 'user-1', 'Hello');

      expect(mockedRepo.addMessage).toHaveBeenCalledWith('room-1', 'user-1', 'Hello');
      expect(result).toEqual(mockMsg);
    });
  });

  describe('getUserRooms', () => {
    it('should return user rooms', async () => {
      mockedRepo.getRecentRooms.mockResolvedValue([mockRoom]);

      const result = await roomService.getUserRooms('user-1');

      expect(mockedRepo.getRecentRooms).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockRoom]);
    });
  });

  describe('getActiveRooms', () => {
    it('should return active rooms for a user', async () => {
      mockedRepo.getUserActiveRooms.mockResolvedValue([mockRoom]);

      const result = await roomService.getActiveRooms('user-1');

      expect(mockedRepo.getUserActiveRooms).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockRoom]);
    });
  });

  describe('autoStartScheduledRooms', () => {
    it('should auto-start scheduled rooms that are ready', async () => {
      const scheduledRoom = { ...mockRoom, status: 'scheduled' };
      mockedRepo.getScheduledReady.mockResolvedValue([scheduledRoom]);
      mockedRepo.updateStatus.mockResolvedValue();
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);

      const count = await roomService.autoStartScheduledRooms();

      expect(count).toBe(1);
      expect(mockedRepo.updateStatus).toHaveBeenCalledWith('room-1', 'active');
    });

    it('should return 0 when no rooms are ready', async () => {
      mockedRepo.getScheduledReady.mockResolvedValue([]);

      const count = await roomService.autoStartScheduledRooms();

      expect(count).toBe(0);
    });
  });

  describe('suggestProblems', () => {
    it('should suggest next unsolved problems from a sheet', async () => {
      const problems = [{ id: 'p-1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', url: '' }];
      mockedRepo.getNextUnsolved.mockResolvedValue(problems);

      const result = await roomService.suggestProblems('user-1', 'next_unsolved', 3, 'sheet-1');

      expect(mockedRepo.getNextUnsolved).toHaveBeenCalledWith('user-1', 'sheet-1', 3);
      expect(result).toEqual(problems);
    });

    it('should suggest random problems from a sheet', async () => {
      mockedRepo.getRandomFromSheet.mockResolvedValue([]);

      await roomService.suggestProblems('user-1', 'random_sheet', 3, 'sheet-1');

      expect(mockedRepo.getRandomFromSheet).toHaveBeenCalledWith('user-1', 'sheet-1', 3);
    });

    it('should suggest random problems from all when no sheet', async () => {
      mockedRepo.getRandomFromAll.mockResolvedValue([]);

      await roomService.suggestProblems('user-1', 'random', 3);

      expect(mockedRepo.getRandomFromAll).toHaveBeenCalledWith('user-1', 3);
    });
  });

  describe('getUpcoming', () => {
    it('should return upcoming rooms', async () => {
      mockedRepo.getUpcoming.mockResolvedValue([mockRoom]);

      const result = await roomService.getUpcoming();

      expect(mockedRepo.getUpcoming).toHaveBeenCalled();
      expect(result).toEqual([mockRoom]);
    });
  });

  describe('inviteFriends', () => {
    it('should invite friends to a room', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);

      await roomService.inviteFriends('room-1', 'user-1', ['user-2', 'user-3']);

      expect(mockedRepo.findById).toHaveBeenCalledWith('room-1');
      expect(mockedRepo.getParticipants).toHaveBeenCalledWith('room-1');
    });

    it('should throw notFound when room does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(roomService.inviteFriends('bad-id', 'user-1', ['user-2'])).rejects.toThrow('Room not found');
    });

    it('should throw forbidden when sender is not a participant', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.getParticipants.mockResolvedValue(mockParticipants);

      await expect(roomService.inviteFriends('room-1', 'user-999', ['user-2'])).rejects.toThrow(
        'Not a participant of this room'
      );
    });
  });

  describe('getRoomsByGroup', () => {
    it('should get rooms by group ID', async () => {
      mockedRepo.getRoomsByGroupId.mockResolvedValue([mockRoom]);

      const result = await roomService.getRoomsByGroup('group-1');

      expect(mockedRepo.getRoomsByGroupId).toHaveBeenCalledWith('group-1');
      expect(result).toEqual([mockRoom]);
    });
  });

  describe('getUserStats', () => {
    it('should return user room stats', async () => {
      const stats = { user_id: 'user-1', display_name: 'User One', rooms_participated: 5, rooms_won: 2, total_solves: 10 };
      mockedRepo.updateStats.mockResolvedValue();
      mockedRepo.getLeaderboard.mockResolvedValue([stats]);

      const result = await roomService.getUserStats('user-1');

      expect(mockedRepo.updateStats).toHaveBeenCalledWith('user-1');
      expect(mockedRepo.getLeaderboard).toHaveBeenCalledWith(1000);
      expect(result).toEqual(stats);
    });

    it('should return null when user has no stats', async () => {
      mockedRepo.updateStats.mockResolvedValue();
      mockedRepo.getLeaderboard.mockResolvedValue([]);

      const result = await roomService.getUserStats('user-1');

      expect(result).toBeNull();
    });
  });

  describe('getLeaderboard', () => {
    it('should return room leaderboard', async () => {
      const lb = [{ user_id: 'user-1', display_name: 'User One', rooms_participated: 5, rooms_won: 2, total_solves: 10 }];
      mockedRepo.getLeaderboard.mockResolvedValue(lb);

      const result = await roomService.getLeaderboard();

      expect(mockedRepo.getLeaderboard).toHaveBeenCalled();
      expect(result).toEqual(lb);
    });
  });
});
