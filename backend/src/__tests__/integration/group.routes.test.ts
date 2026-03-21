import request from 'supertest';
import app from '../../app';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/group/repository/group.repository');
const mockedRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('Group Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockGroup = {
    id: 'group-1',
    name: 'DSA Group',
    description: 'Study together',
    invite_code: 'abc123',
    created_by: 'user-1',
    created_at: new Date(),
    plan: null,
    objective: null,
    target_date: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/groups', () => {
    it('should create a group', async () => {
      mockedRepo.create.mockResolvedValue(mockGroup);

      const res = await request(app)
        .post('/api/groups')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'DSA Group', description: 'Study together' });

      expect(res.status).toBe(201);
      expect(res.body.group.name).toBe('DSA Group');
      expect(res.body.group.invite_code).toBeDefined();
    });

    it('should return 400 for empty group name', async () => {
      const res = await request(app)
        .post('/api/groups')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/groups')
        .send({ name: 'Group' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/groups/join', () => {
    it('should join a group by invite code', async () => {
      mockedRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(false);
      mockedRepo.addMember.mockResolvedValue();

      const res = await request(app)
        .post('/api/groups/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ inviteCode: 'abc123' });

      expect(res.status).toBe(200);
      expect(res.body.group.name).toBe('DSA Group');
    });

    it('should return 404 for invalid invite code', async () => {
      mockedRepo.findByInviteCode.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/groups/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ inviteCode: 'invalid' });

      expect(res.status).toBe(404);
    });

    it('should return 409 when already a member', async () => {
      mockedRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/groups/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ inviteCode: 'abc123' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/groups', () => {
    it('should return user groups', async () => {
      mockedRepo.getUserGroups.mockResolvedValue([mockGroup]);

      const res = await request(app)
        .get('/api/groups')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.groups).toHaveLength(1);
    });
  });

  describe('GET /api/groups/:id', () => {
    it('should return group details with members', async () => {
      mockedRepo.findById.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(true);
      mockedRepo.getMembers.mockResolvedValue([
        {
          user_id: 'user-1',
          display_name: 'User One',
          role: 'admin',
          joined_at: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/groups/group-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.group.members).toHaveLength(1);
    });

    it('should return 403 for non-member', async () => {
      mockedRepo.findById.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(false);

      const res = await request(app)
        .get('/api/groups/group-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('should return 404 for nonexistent group', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/groups/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
