import { groupService } from '../../../modules/group/service/group.service';
import { groupRepository } from '../../../modules/group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/group/repository/group.repository');
const mockedRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('groupService', () => {
  const mockGroup = {
    id: 'group-1',
    name: 'DSA Group',
    description: 'Study group',
    invite_code: 'abc123',
    created_by: 'user-1',
    created_at: new Date(),
    plan: null,
    objective: null,
    target_date: null,
  };

  const mockMembers = [
    {
      user_id: 'user-1',
      display_name: 'User One',
      email: 'u1@test.com',
      role: 'admin',
      joined_at: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a group via repository', async () => {
      mockedRepo.create.mockResolvedValue(mockGroup);

      const result = await groupService.create('DSA Group', 'Study group', 'user-1');

      expect(mockedRepo.create).toHaveBeenCalledWith('DSA Group', 'Study group', 'user-1');
      expect(result).toEqual(mockGroup);
    });
  });

  describe('join', () => {
    it('should join a group by invite code', async () => {
      mockedRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(false);
      mockedRepo.addMember.mockResolvedValue();

      const result = await groupService.join('abc123', 'user-2');

      expect(mockedRepo.findByInviteCode).toHaveBeenCalledWith('abc123');
      expect(mockedRepo.addMember).toHaveBeenCalledWith('group-1', 'user-2');
      expect(result).toEqual(mockGroup);
    });

    it('should throw notFound for invalid invite code', async () => {
      mockedRepo.findByInviteCode.mockResolvedValue(null);

      await expect(groupService.join('invalid', 'user-1')).rejects.toThrow('Invalid invite code');
      await expect(groupService.join('invalid', 'user-1')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('should throw conflict when user is already a member', async () => {
      mockedRepo.findByInviteCode.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(true);

      await expect(groupService.join('abc123', 'user-1')).rejects.toThrow(
        'Already a member of this group'
      );
      await expect(groupService.join('abc123', 'user-1')).rejects.toMatchObject({
        statusCode: 409,
      });
    });
  });

  describe('getDetails', () => {
    it('should return group details with members', async () => {
      mockedRepo.findById.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(true);
      mockedRepo.getMembers.mockResolvedValue(mockMembers);

      const result = await groupService.getDetails('group-1', 'user-1');

      expect(result).toEqual({ ...mockGroup, members: mockMembers });
    });

    it('should throw notFound when group does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(groupService.getDetails('no-group', 'user-1')).rejects.toThrow(
        'Group not found'
      );
    });

    it('should throw forbidden when user is not a member', async () => {
      mockedRepo.findById.mockResolvedValue(mockGroup);
      mockedRepo.isMember.mockResolvedValue(false);

      await expect(groupService.getDetails('group-1', 'user-2')).rejects.toThrow(
        'Not a member of this group'
      );
      await expect(groupService.getDetails('group-1', 'user-2')).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  describe('getUserGroups', () => {
    it('should return all groups for a user', async () => {
      mockedRepo.getUserGroups.mockResolvedValue([mockGroup]);

      const result = await groupService.getUserGroups('user-1');

      expect(mockedRepo.getUserGroups).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockGroup]);
    });
  });
});
