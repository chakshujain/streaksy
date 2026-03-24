import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { roomRepository } from '../../modules/room/repository/room.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/group/repository/group.repository');
jest.mock('../../modules/room/repository/room.repository');

const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedRoomRepo = roomRepository as jest.Mocked<typeof roomRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Invite System', () => {
  const inviter = { id: 'user-inviter', email: 'inviter@test.com' };
  const invitee = { id: 'user-invitee', email: 'invitee@test.com' };
  const inviterToken = generateTestToken(inviter.id, inviter.email);
  const inviteeToken = generateTestToken(invitee.id, invitee.email);

  const mockGroup = {
    id: 'group-invite',
    name: 'Invite Test Group',
    description: 'Testing invite system',
    invite_code: 'GRP-INV-01',
    created_by: inviter.id,
    created_at: new Date(),
    plan: null,
    objective: null,
    target_date: null,
  };

  const mockRoom = {
    id: 'room-invite',
    name: 'Invite Test Room',
    code: 'ROOM-INV',
    problem_id: 'prob-placeholder',
    host_id: inviter.id,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Resolve group invite (public, no auth)', () => {
    it('should resolve a group invite code to group info', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMemberCount.mockResolvedValue(3);

      const res = await request(app)
        .get('/api/invite/group/GRP-INV-01');

      expect(res.status).toBe(200);
      expect(res.body.type).toBe('group');
      expect(res.body.name).toBe('Invite Test Group');
    });

    it('should return 404 for invalid group invite code', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/invite/group/INVALID');

      expect(res.status).toBe(404);
    });
  });

  describe('Step 2: Resolve room invite (public, no auth)', () => {
    it('should resolve a room invite code to room info', async () => {
      mockedRoomRepo.findByCode.mockResolvedValue(mockRoom);
      mockedRoomRepo.getParticipants.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/invite/room/ROOM-INV');

      expect(res.status).toBe(200);
      expect(res.body.type).toBe('room');
      expect(res.body.name).toBe('Invite Test Room');
    });

    it('should return 404 for invalid room invite code', async () => {
      mockedRoomRepo.findByCode.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/invite/room/INVALID');

      expect(res.status).toBe(404);
    });
  });

  describe('Step 3: Join group via invite code (auth required)', () => {
    it('should join a group using invite code', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(false);
      mockedGroupRepo.addMember.mockResolvedValue();
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: inviter.id, display_name: 'Inviter', role: 'admin', joined_at: new Date() },
        { user_id: invitee.id, display_name: 'Invitee', role: 'member', joined_at: new Date() },
      ]);
      mockedGroupRepo.getMemberCount.mockResolvedValue(2);
      mockedGroupRepo.getGroupSheets.mockResolvedValue([]);

      const res = await request(app)
        .post('/api/invite/group/GRP-INV-01/join')
        .set('Authorization', `Bearer ${inviteeToken}`);

      expect(res.status).toBe(200);
    });

    it('should handle already-member case', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/invite/group/GRP-INV-01/join')
        .set('Authorization', `Bearer ${inviteeToken}`);

      expect(res.status).toBe(409);
    });

    it('should require authentication to join', async () => {
      const res = await request(app)
        .post('/api/invite/group/GRP-INV-01/join');

      expect(res.status).toBe(401);
    });
  });

  describe('Step 4: Join room via invite code (auth required)', () => {
    it('should join a room using invite code', async () => {
      mockedRoomRepo.findByCode.mockResolvedValue(mockRoom);
      mockedRoomRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/invite/room/ROOM-INV/join')
        .set('Authorization', `Bearer ${inviteeToken}`);

      expect(res.status).toBe(200);
    });

    it('should return 404 for invalid room code', async () => {
      mockedRoomRepo.findByCode.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/invite/room/INVALID/join')
        .set('Authorization', `Bearer ${inviteeToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Step 5: Full invite flow - create group and share invite', () => {
    it('inviter creates a group', async () => {
      mockedGroupRepo.create.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: inviter.id, display_name: 'Inviter', role: 'admin', joined_at: new Date() },
      ]);

      const res = await request(app)
        .post('/api/groups')
        .set('Authorization', `Bearer ${inviterToken}`)
        .send({ name: 'Invite Test Group', description: 'Testing invite system' });

      expect(res.status).toBe(201);
      expect(res.body.group.invite_code).toBeDefined();
    });

    it('invitee resolves the invite without login', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMemberCount.mockResolvedValue(1);

      const res = await request(app)
        .get(`/api/invite/group/${mockGroup.invite_code}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Invite Test Group');
    });

    it('invitee joins after logging in', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(false);
      mockedGroupRepo.addMember.mockResolvedValue();
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: inviter.id, display_name: 'Inviter', role: 'admin', joined_at: new Date() },
        { user_id: invitee.id, display_name: 'Invitee', role: 'member', joined_at: new Date() },
      ]);
      mockedGroupRepo.getMemberCount.mockResolvedValue(2);
      mockedGroupRepo.getGroupSheets.mockResolvedValue([]);

      const res = await request(app)
        .post(`/api/invite/group/${mockGroup.invite_code}/join`)
        .set('Authorization', `Bearer ${inviteeToken}`);

      expect(res.status).toBe(200);
    });
  });
});
