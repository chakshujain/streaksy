import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { groupRepository } from '../../modules/group/repository/group.repository';
import { activityRepository } from '../../modules/activity/repository/activity.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/group/repository/group.repository');
jest.mock('../../modules/activity/repository/activity.repository');
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedActivityRepo = activityRepository as jest.Mocked<typeof activityRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Group Management & Sheets', () => {
  const admin = { id: 'user-admin', email: 'admin@test.com', name: 'Admin User' };
  const member = { id: 'user-member', email: 'member@test.com', name: 'Member User' };
  const adminToken = generateTestToken(admin.id, admin.email);
  const memberToken = generateTestToken(member.id, member.email);

  const mockGroup = {
    id: 'group-mgmt',
    name: 'Coding Warriors',
    description: 'Master DSA together',
    invite_code: 'COD-WAR-99',
    created_by: admin.id,
    created_at: new Date(),
    plan: null,
    objective: null,
    target_date: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Create and configure a group', () => {
    it('should create a new group', async () => {
      mockedGroupRepo.create.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: admin.id, display_name: admin.name, role: 'admin', joined_at: new Date() },
      ]);

      const res = await request(app)
        .post('/api/groups')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Coding Warriors', description: 'Master DSA together' });

      expect(res.status).toBe(201);
      expect(res.body.group.name).toBe('Coding Warriors');
      expect(res.body.group.invite_code).toBeDefined();
    });

    it('should update group plan and objective', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.updateGroupPlan.mockResolvedValue({
        ...mockGroup,
        plan: 'Solve 150 problems in 3 months',
        objective: 'Everyone gets a FAANG offer',
        target_date: '2026-06-22',
      });

      const res = await request(app)
        .put('/api/groups/group-mgmt/plan')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          plan: 'Solve 150 problems in 3 months',
          objective: 'Everyone gets a FAANG offer',
          targetDate: '2026-06-22',
        });

      expect(res.status).toBe(200);
      expect(res.body.group.plan).toBe('Solve 150 problems in 3 months');
    });
  });

  describe('Step 2: Member joins the group', () => {
    it('should join the group via invite code', async () => {
      mockedGroupRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(false);
      mockedGroupRepo.addMember.mockResolvedValue();
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.getMembers.mockResolvedValue([
        { user_id: admin.id, display_name: admin.name, role: 'admin', joined_at: new Date() },
        { user_id: member.id, display_name: member.name, role: 'member', joined_at: new Date() },
      ]);
      mockedGroupRepo.getMemberCount.mockResolvedValue(2);
      mockedGroupRepo.getGroupSheets.mockResolvedValue([]);

      const res = await request(app)
        .post('/api/groups/join')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ inviteCode: 'COD-WAR-99' });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 3: Assign sheets to the group', () => {
    it('should assign a sheet to the group', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.assignSheet.mockResolvedValue();

      const res = await request(app)
        .post('/api/groups/group-mgmt/sheets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sheetId: 'sheet-blind-75' });

      expect(res.status).toBe(200);
    });

    it('should list group sheets', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.getGroupSheets.mockResolvedValue([
        { sheet_id: 'sheet-blind-75', name: 'Blind 75', slug: 'blind-75', description: 'Must-do 75 problems', assigned_at: new Date() },
      ]);

      const res = await request(app)
        .get('/api/groups/group-mgmt/sheets')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.sheets).toHaveLength(1);
      expect(res.body.sheets[0].name).toBe('Blind 75');
    });
  });

  describe('Step 4: View member progress on sheets', () => {
    it('should show member progress for an assigned sheet', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.getMemberSheetProgress.mockResolvedValue([
        { user_id: admin.id, display_name: admin.name, solved: 25, total: 75 },
        { user_id: member.id, display_name: member.name, solved: 10, total: 75 },
      ]);

      const res = await request(app)
        .get('/api/groups/group-mgmt/sheets/sheet-blind-75/progress')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(2);
      expect(res.body.progress[0].solved_count).toBe(25);
    });
  });

  describe('Step 5: View group activity feed', () => {
    it('should show group activity log', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedActivityRepo.getForGroup.mockResolvedValue([
        {
          id: 'act-1', group_id: 'group-mgmt', user_id: member.id,
          action: 'joined_group', metadata: {},
          created_at: new Date(), display_name: member.name,
        },
        {
          id: 'act-2', group_id: 'group-mgmt', user_id: admin.id,
          action: 'created_group', metadata: {},
          created_at: new Date(), display_name: admin.name,
        },
      ]);

      const res = await request(app)
        .get('/api/groups/group-mgmt/activity')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.activity).toHaveLength(2);
    });

    it('should deny activity access to non-members', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);
      const outsiderToken = generateTestToken('outsider', 'out@test.com');

      const res = await request(app)
        .get('/api/groups/group-mgmt/activity')
        .set('Authorization', `Bearer ${outsiderToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Step 6: Remove a sheet from the group', () => {
    it('should remove an assigned sheet', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.removeSheet.mockResolvedValue();

      const res = await request(app)
        .delete('/api/groups/group-mgmt/sheets/sheet-blind-75')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Step 7: List user groups', () => {
    it('should list all groups the user belongs to', async () => {
      mockedGroupRepo.getUserGroups.mockResolvedValue([
        {
          id: 'group-mgmt', name: 'Coding Warriors', description: 'Master DSA together',
          invite_code: 'COD-WAR-99', created_by: admin.id, created_at: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/groups')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.groups).toHaveLength(1);
      expect(res.body.groups[0].name).toBe('Coding Warriors');
    });
  });

  describe('Step 8: Member leaves the group', () => {
    it('should allow a member to leave the group', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.removeMember.mockResolvedValue();

      const res = await request(app)
        .post('/api/groups/group-mgmt/leave')
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Step 9: Admin deletes the group', () => {
    it('should allow admin to delete the group', async () => {
      mockedGroupRepo.findById.mockResolvedValue(mockGroup);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedGroupRepo.deleteGroup.mockResolvedValue();

      const res = await request(app)
        .delete('/api/groups/group-mgmt')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
