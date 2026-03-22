import request from 'supertest';
import app from '../../app';
import { inviteService } from '../../modules/invite/service/invite.service';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/invite/service/invite.service');
const mockedService = inviteService as jest.Mocked<typeof inviteService>;

describe('Invite Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockGroupPreview = {
    type: 'group' as const,
    id: 'group-1',
    name: 'DSA Study Group',
    description: 'A study group',
    memberCount: 5,
  };

  const mockRoomPreview = {
    type: 'room' as const,
    id: 'room-1',
    name: 'Live Sprint',
    problemTitle: null,
    problemDifficulty: null,
    status: 'waiting',
    participantCount: 3,
    timeLimitMinutes: 60,
    mode: 'collaborative',
  };

  const mockGroup = {
    id: 'group-1',
    name: 'DSA Study Group',
    description: 'A study group',
    invite_code: 'abc123def456',
    created_by: 'user-2',
    created_at: new Date(),
  };

  const mockRoom = {
    id: 'room-1',
    name: 'Live Sprint',
    code: 'ABCD1234',
    host_id: 'user-2',
    status: 'waiting',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Public endpoints (no auth required)
  describe('GET /api/invite/group/:code', () => {
    it('should resolve a group invite code', async () => {
      mockedService.resolveGroup.mockResolvedValue(mockGroupPreview);

      const res = await request(app).get('/api/invite/group/abc123def456');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('DSA Study Group');
    });

    it('should handle invalid invite code', async () => {
      mockedService.resolveGroup.mockRejectedValue(new Error('Not found'));

      const res = await request(app).get('/api/invite/group/invalid-code');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/invite/room/:code', () => {
    it('should resolve a room invite code', async () => {
      mockedService.resolveRoom.mockResolvedValue(mockRoomPreview);

      const res = await request(app).get('/api/invite/room/ABCD1234');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Live Sprint');
    });

    it('should handle invalid room code', async () => {
      mockedService.resolveRoom.mockRejectedValue(new Error('Not found'));

      const res = await request(app).get('/api/invite/room/invalid-code');

      expect(res.status).toBe(500);
    });
  });

  // Authenticated endpoints
  describe('POST /api/invite/group/:code/join', () => {
    it('should join a group via invite code', async () => {
      mockedService.joinGroup.mockResolvedValue(mockGroup);

      const res = await request(app)
        .post('/api/invite/group/abc123def456/join')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.group.name).toBe('DSA Study Group');
    });

    it('should handle already a member', async () => {
      mockedService.joinGroup.mockRejectedValue(new Error('Already a member'));

      const res = await request(app)
        .post('/api/invite/group/abc123def456/join')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/invite/group/abc123def456/join');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/invite/room/:code/join', () => {
    it('should join a room via invite code', async () => {
      mockedService.joinRoom.mockResolvedValue(mockRoom);

      const res = await request(app)
        .post('/api/invite/room/ABCD1234/join')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.room.name).toBe('Live Sprint');
    });

    it('should handle already a participant', async () => {
      mockedService.joinRoom.mockRejectedValue(new Error('Already a participant'));

      const res = await request(app)
        .post('/api/invite/room/ABCD1234/join')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/invite/room/ABCD1234/join');
      expect(res.status).toBe(401);
    });
  });
});
