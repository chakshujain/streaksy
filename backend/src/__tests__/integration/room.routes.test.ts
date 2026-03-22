import request from 'supertest';
import app from '../../app';
import { roomRepository } from '../../modules/room/repository/room.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/room/repository/room.repository');
const mockedRepo = roomRepository as jest.Mocked<typeof roomRepository>;

describe('Room Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockRoom = {
    id: 'room-1',
    name: 'DSA Sprint',
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
    meet_link: 'https://meet.jit.si/streaksy-abcd1234',
    calendar_event_id: null,
    problem_title: 'Two Sum',
    problem_slug: 'two-sum',
    problem_difficulty: 'easy',
  };

  const mockParticipant = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/rooms', () => {
    it('should create a room', async () => {
      mockedRepo.create.mockResolvedValue(mockRoom);
      mockedRepo.addParticipant.mockResolvedValue();
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.addProblems.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'DSA Sprint', timeLimitMinutes: 30 });

      expect(res.status).toBe(201);
      expect(res.body.room.name).toBe('DSA Sprint');
    });

    it('should return 400 for missing name', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .send({ name: 'Room' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/rooms/join', () => {
    it('should join a room by code', async () => {
      mockedRepo.findByCode.mockResolvedValue(mockRoom);
      mockedRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'ABCD1234' });

      expect(res.status).toBe(200);
      expect(res.body.room.code).toBe('ABCD1234');
    });

    it('should return 404 for invalid code', async () => {
      mockedRepo.findByCode.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/rooms/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'INVALID1' });

      expect(res.status).toBe(404);
    });

    it('should return 400 for finished room', async () => {
      mockedRepo.findByCode.mockResolvedValue({ ...mockRoom, status: 'finished' });

      const res = await request(app)
        .post('/api/rooms/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'ABCD1234' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for empty code', async () => {
      const res = await request(app)
        .post('/api/rooms/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: '' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/rooms/join')
        .send({ code: 'ABCD1234' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rooms/mine', () => {
    it('should return user rooms', async () => {
      mockedRepo.getRecentRooms.mockResolvedValue([mockRoom]);

      const res = await request(app)
        .get('/api/rooms/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.rooms).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/rooms/mine');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rooms/active', () => {
    it('should return active rooms', async () => {
      mockedRepo.getUserActiveRooms.mockResolvedValue([{ ...mockRoom, status: 'active' }]);

      const res = await request(app)
        .get('/api/rooms/active')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.rooms).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/rooms/active');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rooms/upcoming', () => {
    it('should return upcoming scheduled rooms', async () => {
      mockedRepo.getUpcoming.mockResolvedValue([{ ...mockRoom, status: 'scheduled', scheduled_at: new Date() }]);

      const res = await request(app)
        .get('/api/rooms/upcoming')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.rooms).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/rooms/upcoming');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rooms/leaderboard', () => {
    it('should return room leaderboard', async () => {
      mockedRepo.getLeaderboard.mockResolvedValue([
        { user_id: 'user-1', display_name: 'User One', rooms_participated: 5, rooms_won: 3, total_solves: 10 },
      ]);

      const res = await request(app)
        .get('/api/rooms/leaderboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/rooms/leaderboard');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rooms/:id', () => {
    it('should return room details for participant', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.getParticipants.mockResolvedValue([mockParticipant]);
      mockedRepo.getMessages.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/rooms/room-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.room.name).toBe('DSA Sprint');
      expect(res.body.room.participants).toHaveLength(1);
    });

    it('should return 404 for nonexistent room', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/rooms/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 403 for non-participant', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom);
      mockedRepo.getParticipants.mockResolvedValue([{ ...mockParticipant, user_id: 'other-user' }]);

      const res = await request(app)
        .get('/api/rooms/room-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/rooms/room-1');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/rooms/:id/start', () => {
    it('should start a room when host', async () => {
      mockedRepo.findById.mockResolvedValueOnce(mockRoom).mockResolvedValueOnce({ ...mockRoom, status: 'active' });
      mockedRepo.updateStatus.mockResolvedValue();
      mockedRepo.getParticipants.mockResolvedValue([mockParticipant]);

      const res = await request(app)
        .post('/api/rooms/room-1/start')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('should return 404 for nonexistent room', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/rooms/nonexistent/start')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return 403 when not host', async () => {
      mockedRepo.findById.mockResolvedValue({ ...mockRoom, host_id: 'other-user' });

      const res = await request(app)
        .post('/api/rooms/room-1/start')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/rooms/room-1/start');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/rooms/:id/end', () => {
    it('should end a room when host', async () => {
      mockedRepo.findById.mockResolvedValueOnce(mockRoom).mockResolvedValueOnce({ ...mockRoom, status: 'finished' });
      mockedRepo.updateStatus.mockResolvedValue();
      mockedRepo.getParticipants.mockResolvedValue([mockParticipant]);
      mockedRepo.updateStats.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms/room-1/end')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('should return 403 when not host', async () => {
      mockedRepo.findById.mockResolvedValue({ ...mockRoom, host_id: 'other-user' });

      const res = await request(app)
        .post('/api/rooms/room-1/end')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/rooms/room-1/end');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/rooms/:id/solve', () => {
    it('should mark problem as solved', async () => {
      mockedRepo.findById.mockResolvedValueOnce({ ...mockRoom, status: 'active' }).mockResolvedValueOnce({ ...mockRoom, status: 'active' });
      mockedRepo.markSolved.mockResolvedValue();
      mockedRepo.getParticipants.mockResolvedValue([{ ...mockParticipant, status: 'solved', solved_at: new Date() }]);
      mockedRepo.markProblemSolved.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms/room-1/solve')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'javascript' });

      expect(res.status).toBe(200);
      expect(res.body.participants).toBeDefined();
    });

    it('should return 400 when room is not active', async () => {
      mockedRepo.findById.mockResolvedValue(mockRoom); // status: 'waiting'

      const res = await request(app)
        .post('/api/rooms/room-1/solve')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/rooms/room-1/solve')
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rooms/:id/problems', () => {
    it('should return room problems for participant', async () => {
      mockedRepo.getParticipants.mockResolvedValue([mockParticipant]);
      mockedRepo.getRoomProblems.mockResolvedValue([
        { problem_id: 'prob-1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', position: 0 },
      ]);

      const res = await request(app)
        .get('/api/rooms/room-1/problems')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(1);
    });

    it('should return 403 for non-participant', async () => {
      mockedRepo.getParticipants.mockResolvedValue([{ ...mockParticipant, user_id: 'other-user' }]);

      const res = await request(app)
        .get('/api/rooms/room-1/problems')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/rooms/room-1/problems');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/rooms/suggest', () => {
    it('should suggest problems', async () => {
      mockedRepo.getRandomFromAll.mockResolvedValue([
        { id: 'prob-1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', url: 'https://leetcode.com/problems/two-sum' },
      ]);

      const res = await request(app)
        .get('/api/rooms/suggest')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toBeDefined();
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/rooms/suggest');
      expect(res.status).toBe(401);
    });
  });
});
