import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { roomRepository } from '../../modules/room/repository/room.repository';
import { notesRepository } from '../../modules/notes/repository/notes.repository';
import { revisionRepository } from '../../modules/revision/repository/revision.repository';
import { insightsRepository } from '../../modules/insights/repository/insights.repository';
import { progressRepository } from '../../modules/progress/repository/progress.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/room/repository/room.repository');
jest.mock('../../modules/notes/repository/notes.repository');
jest.mock('../../modules/revision/repository/revision.repository');
jest.mock('../../modules/insights/repository/insights.repository');
jest.mock('../../modules/progress/repository/progress.repository');
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../config/redis', () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
  },
}));
jest.mock('../../modules/ai/service/ai.service', () => ({
  aiService: {
    getHint: jest.fn().mockResolvedValue({ hint: 'Try using a hash map for O(n) lookup.' }),
    explain: jest.fn().mockResolvedValue({ explanation: 'Two Sum uses a complement approach...' }),
    reviewCode: jest.fn().mockResolvedValue({ review: 'Good solution! Consider edge cases.' }),
    generateRevisionNotes: jest.fn().mockResolvedValue({
      keyTakeaway: 'Use hash map for complement lookup',
      approach: 'Single pass hash map',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    }),
  },
}));

const mockedRoomRepo = roomRepository as jest.Mocked<typeof roomRepository>;
const mockedNotesRepo = notesRepository as jest.Mocked<typeof notesRepository>;
const mockedRevisionRepo = revisionRepository as jest.Mocked<typeof revisionRepository>;
const mockedInsightsRepo = insightsRepository as jest.Mocked<typeof insightsRepository>;
const mockedProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Study Session', () => {
  const hostUser = { id: 'user-host', email: 'host@test.com' };
  const joinUser = { id: 'user-joiner', email: 'joiner@test.com' };
  const hostToken = generateTestToken(hostUser.id, hostUser.email);
  const joinToken = generateTestToken(joinUser.id, joinUser.email);

  const mockRoom = {
    id: 'room-study-1',
    name: 'Two Sum Sprint',
    code: 'STUDY123',
    problem_id: '10000000-0000-4000-a000-000000000001',
    host_id: hostUser.id,
    status: 'waiting' as string,
    time_limit_minutes: 30,
    started_at: null as Date | null,
    ended_at: null as Date | null,
    created_at: new Date(),
    scheduled_at: null,
    sheet_id: null,
    mode: 'single',
    recurrence: null,
    meet_link: 'https://meet.jit.si/streaksy-study123',
    calendar_event_id: null,
    problem_title: 'Two Sum',
    problem_slug: 'two-sum',
    problem_difficulty: 'easy',
  };

  const hostParticipant = {
    room_id: 'room-study-1', user_id: hostUser.id,
    status: 'joined', solved_at: null, code: null, language: null,
    runtime_ms: null, memory_kb: null, joined_at: new Date(),
    display_name: 'Host User',
  };

  const joinParticipant = {
    room_id: 'room-study-1', user_id: joinUser.id,
    status: 'joined', solved_at: null, code: null, language: null,
    runtime_ms: null, memory_kb: null, joined_at: new Date(),
    display_name: 'Joiner User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Create a war room', () => {
    it('should create a new room with a problem', async () => {
      mockedRoomRepo.create.mockResolvedValue(mockRoom);
      mockedRoomRepo.addParticipant.mockResolvedValue();
      mockedRoomRepo.findById.mockResolvedValue(mockRoom);
      mockedRoomRepo.addProblems.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${hostToken}`)
        .send({ name: 'Two Sum Sprint', timeLimitMinutes: 30 });

      expect(res.status).toBe(201);
      expect(res.body.room.name).toBe('Two Sum Sprint');
      expect(res.body.room.code).toBeDefined();
    });

    it('should show room in host user rooms list', async () => {
      mockedRoomRepo.getRecentRooms.mockResolvedValue([mockRoom]);

      const res = await request(app)
        .get('/api/rooms/mine')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.rooms).toHaveLength(1);
      expect(res.body.rooms[0].name).toBe('Two Sum Sprint');
    });
  });

  describe('Step 2: Another user joins the room', () => {
    it('should join the room by code', async () => {
      mockedRoomRepo.findByCode.mockResolvedValue(mockRoom);
      mockedRoomRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms/join')
        .set('Authorization', `Bearer ${joinToken}`)
        .send({ code: 'STUDY123' });

      expect(res.status).toBe(200);
      expect(res.body.room.code).toBe('STUDY123');
    });

    it('should show both participants in room details', async () => {
      mockedRoomRepo.findById.mockResolvedValue(mockRoom);
      mockedRoomRepo.getParticipants.mockResolvedValue([hostParticipant, joinParticipant]);
      mockedRoomRepo.getMessages.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/rooms/room-study-1')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.room.participants).toHaveLength(2);
    });
  });

  describe('Step 3: Start the room and solve the problem', () => {
    it('host should start the room', async () => {
      const activeRoom = { ...mockRoom, status: 'active', started_at: new Date() };
      mockedRoomRepo.findById
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce(activeRoom);
      mockedRoomRepo.updateStatus.mockResolvedValue();
      mockedRoomRepo.getParticipants.mockResolvedValue([hostParticipant, joinParticipant]);

      const res = await request(app)
        .post('/api/rooms/room-study-1/start')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
    });

    it('joiner should mark problem as solved', async () => {
      const activeRoom = { ...mockRoom, status: 'active', started_at: new Date() };
      mockedRoomRepo.findById
        .mockResolvedValueOnce(activeRoom)
        .mockResolvedValueOnce(activeRoom);
      mockedRoomRepo.markSolved.mockResolvedValue();
      mockedRoomRepo.getParticipants.mockResolvedValue([
        hostParticipant,
        { ...joinParticipant, status: 'solved', solved_at: new Date() },
      ]);
      mockedRoomRepo.markProblemSolved.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms/room-study-1/solve')
        .set('Authorization', `Bearer ${joinToken}`)
        .send({ language: 'python' });

      expect(res.status).toBe(200);
      expect(res.body.participants).toBeDefined();
    });
  });

  describe('Step 4: Mark problem progress outside the room', () => {
    it('should toggle problem status to solved', async () => {
      mockedProgressRepo.upsert.mockResolvedValue({
        user_id: joinUser.id, problem_id: '10000000-0000-4000-a000-000000000001',
        status: 'solved', solved_at: new Date(), updated_at: new Date(),
      });
      mockedProgressRepo.getSolvedCountToday.mockResolvedValue(1);
      // Streak update mocks
      mockedQueryOne.mockResolvedValue({ current_streak: 1, longest_streak: 1, last_solve_date: '2026-03-22' });

      const res = await request(app)
        .put('/api/progress/status')
        .set('Authorization', `Bearer ${joinToken}`)
        .send({ problemId: '10000000-0000-4000-a000-000000000001', status: 'solved' });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 5: Add notes to the problem', () => {
    it('should create a personal note for the problem', async () => {
      mockedNotesRepo.create.mockResolvedValue({
        id: 'note-1', user_id: joinUser.id, problem_id: '10000000-0000-4000-a000-000000000001',
        group_id: null, content: 'Key insight: use complement = target - nums[i]',
        visibility: 'personal', created_at: new Date(), updated_at: new Date(),
      });

      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${joinToken}`)
        .send({
          problemId: '10000000-0000-4000-a000-000000000001',
          content: 'Key insight: use complement = target - nums[i]',
          visibility: 'personal',
        });

      expect(res.status).toBe(201);
      expect(res.body.note.content).toContain('complement');
    });

    it('should retrieve personal notes for the problem', async () => {
      mockedNotesRepo.getPersonalNotes.mockResolvedValue([{
        id: 'note-1', user_id: joinUser.id, problem_id: '10000000-0000-4000-a000-000000000001',
        group_id: null, content: 'Key insight: use complement = target - nums[i]',
        visibility: 'personal', created_at: new Date(), updated_at: new Date(),
      }]);

      const res = await request(app)
        .get('/api/notes/personal/10000000-0000-4000-a000-000000000001')
        .set('Authorization', `Bearer ${joinToken}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(1);
    });
  });

  describe('Step 6: Generate revision notes', () => {
    it('should save revision notes for the problem', async () => {
      mockedRevisionRepo.createOrUpdate.mockResolvedValue({
        id: 'rev-1', user_id: joinUser.id, problem_id: '10000000-0000-4000-a000-000000000001',
        key_takeaway: 'Use hash map for complement lookup',
        approach: 'Single pass hash map', time_complexity: 'O(n)',
        space_complexity: 'O(n)', tags: ['hash-map', 'array'],
        difficulty_rating: 'easy', intuition: 'Store seen values, check complement',
        points_to_remember: ['Handle duplicates', 'Return indices not values'],
        ai_generated: false, last_revised_at: null, revision_count: 0,
        created_at: new Date(), updated_at: new Date(),
      });

      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${joinToken}`)
        .send({
          problemId: '10000000-0000-4000-a000-000000000001',
          keyTakeaway: 'Use hash map for complement lookup',
          approach: 'Single pass hash map',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          tags: ['hash-map', 'array'],
        });

      expect(res.status).toBe(201);
      expect(res.body.note.key_takeaway).toContain('hash map');
    });

    it('should retrieve revision notes', async () => {
      mockedRevisionRepo.getForUser.mockResolvedValue([{
        id: 'rev-1', user_id: joinUser.id, problem_id: '10000000-0000-4000-a000-000000000001',
        key_takeaway: 'Use hash map for complement lookup',
        approach: 'Single pass hash map', time_complexity: 'O(n)',
        space_complexity: 'O(n)', tags: ['hash-map', 'array'],
        difficulty_rating: 'easy', intuition: null,
        points_to_remember: null, ai_generated: false,
        last_revised_at: null, revision_count: 0,
        created_at: new Date(), updated_at: new Date(),
        problem_title: 'Two Sum', problem_slug: 'two-sum', problem_difficulty: 'easy',
      }]);

      const res = await request(app)
        .get('/api/revisions')
        .set('Authorization', `Bearer ${joinToken}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(1);
      expect(res.body.notes[0].problem_title).toBe('Two Sum');
    });
  });

  describe('Step 7: Check insights after study session', () => {
    it('should show updated problem-solving stats via overview endpoint', async () => {
      mockedInsightsRepo.getOverview.mockResolvedValue({
        total_solved: 1, easy_count: 1, medium_count: 0, hard_count: 0,
      });
      mockedInsightsRepo.getStreak.mockResolvedValue({
        current_streak: 1, longest_streak: 1,
      });
      mockedInsightsRepo.getActiveDays.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/insights/overview')
        .set('Authorization', `Bearer ${joinToken}`);

      expect(res.status).toBe(200);
      expect(res.body.totalSolved).toBe(1);
    });

    it('should show tag stats', async () => {
      mockedInsightsRepo.getTagStats.mockResolvedValue([
        { tag_name: 'Array', solved_count: 1, total_count: 15 },
        { tag_name: 'Hash Table', solved_count: 1, total_count: 12 },
      ]);

      const res = await request(app)
        .get('/api/insights/tags')
        .set('Authorization', `Bearer ${joinToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tags).toHaveLength(2);
    });
  });

  describe('Step 8: End the war room', () => {
    it('host should end the room', async () => {
      const activeRoom = { ...mockRoom, status: 'active', started_at: new Date() };
      const finishedRoom = { ...mockRoom, status: 'finished', ended_at: new Date() };
      mockedRoomRepo.findById
        .mockResolvedValueOnce(activeRoom)
        .mockResolvedValueOnce(finishedRoom);
      mockedRoomRepo.updateStatus.mockResolvedValue();
      mockedRoomRepo.getParticipants.mockResolvedValue([
        hostParticipant,
        { ...joinParticipant, status: 'solved', solved_at: new Date() },
      ]);
      mockedRoomRepo.updateStats.mockResolvedValue();

      const res = await request(app)
        .post('/api/rooms/room-study-1/end')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
    });

    it('should show room in leaderboard stats', async () => {
      mockedRoomRepo.getLeaderboard.mockResolvedValue([
        { user_id: joinUser.id, display_name: 'Joiner User', rooms_participated: 1, rooms_won: 1, total_solves: 1 },
        { user_id: hostUser.id, display_name: 'Host User', rooms_participated: 1, rooms_won: 0, total_solves: 0 },
      ]);

      const res = await request(app)
        .get('/api/rooms/leaderboard')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(res.status).toBe(200);
      expect(res.body.leaderboard).toHaveLength(2);
      expect(res.body.leaderboard[0].display_name).toBe('Joiner User');
    });
  });
});
