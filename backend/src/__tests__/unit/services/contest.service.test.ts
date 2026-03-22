import { contestService } from '../../../modules/contest/service/contest.service';
import { contestRepository } from '../../../modules/contest/repository/contest.repository';
import { groupRepository } from '../../../modules/group/repository/group.repository';

jest.mock('../../../modules/contest/repository/contest.repository');
jest.mock('../../../modules/group/repository/group.repository');

const mockedContestRepo = contestRepository as jest.Mocked<typeof contestRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;

describe('contestService', () => {
  const mockContest = {
    id: 'contest-1',
    group_id: 'group-1',
    title: 'Weekly Challenge',
    description: 'Solve 5 problems',
    starts_at: new Date('2025-01-01T10:00:00Z'),
    ends_at: new Date('2025-01-02T10:00:00Z'),
    created_by: 'user-1',
    created_at: new Date(),
  };

  const mockProblem = {
    problem_id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    position: 0,
  };

  const mockStanding = {
    user_id: 'user-1',
    display_name: 'Test User',
    solved_count: 3,
    last_submission: new Date(),
  };

  const mockSubmission = {
    id: 'sub-1',
    contest_id: 'contest-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    submitted_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a contest when user is group admin', async () => {
      mockedGroupRepo.getMember.mockResolvedValue({ group_id: 'group-1', user_id: 'user-1', role: 'admin' });
      mockedContestRepo.create.mockResolvedValue(mockContest);

      const result = await contestService.create('group-1', 'user-1', {
        title: 'Weekly Challenge',
        description: 'Solve 5 problems',
        startsAt: '2025-01-01T10:00:00Z',
        endsAt: '2025-01-02T10:00:00Z',
      });

      expect(mockedContestRepo.create).toHaveBeenCalledWith(
        'group-1', 'Weekly Challenge', 'Solve 5 problems', '2025-01-01T10:00:00Z', '2025-01-02T10:00:00Z', 'user-1'
      );
      expect(result).toEqual(mockContest);
    });

    it('should create a contest with problems', async () => {
      mockedGroupRepo.getMember.mockResolvedValue({ group_id: 'group-1', user_id: 'user-1', role: 'admin' });
      mockedContestRepo.create.mockResolvedValue(mockContest);
      mockedContestRepo.addProblem.mockResolvedValue();

      await contestService.create('group-1', 'user-1', {
        title: 'Weekly Challenge',
        startsAt: '2025-01-01T10:00:00Z',
        endsAt: '2025-01-02T10:00:00Z',
        problemIds: ['prob-1', 'prob-2'],
      });

      expect(mockedContestRepo.addProblem).toHaveBeenCalledTimes(2);
      expect(mockedContestRepo.addProblem).toHaveBeenCalledWith('contest-1', 'prob-1', 0);
      expect(mockedContestRepo.addProblem).toHaveBeenCalledWith('contest-1', 'prob-2', 1);
    });

    it('should use null description when not provided', async () => {
      mockedGroupRepo.getMember.mockResolvedValue({ group_id: 'group-1', user_id: 'user-1', role: 'admin' });
      mockedContestRepo.create.mockResolvedValue(mockContest);

      await contestService.create('group-1', 'user-1', {
        title: 'Weekly Challenge',
        startsAt: '2025-01-01T10:00:00Z',
        endsAt: '2025-01-02T10:00:00Z',
      });

      expect(mockedContestRepo.create).toHaveBeenCalledWith(
        'group-1', 'Weekly Challenge', null, expect.any(String), expect.any(String), 'user-1'
      );
    });

    it('should throw forbidden when user is not a group member', async () => {
      mockedGroupRepo.getMember.mockResolvedValue(null);

      await expect(
        contestService.create('group-1', 'user-2', {
          title: 'Test',
          startsAt: '2025-01-01T10:00:00Z',
          endsAt: '2025-01-02T10:00:00Z',
        })
      ).rejects.toThrow('Not a member of this group');
      await expect(
        contestService.create('group-1', 'user-2', {
          title: 'Test',
          startsAt: '2025-01-01T10:00:00Z',
          endsAt: '2025-01-02T10:00:00Z',
        })
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('should throw forbidden when user is not admin', async () => {
      mockedGroupRepo.getMember.mockResolvedValue({ group_id: 'group-1', user_id: 'user-1', role: 'member' });

      await expect(
        contestService.create('group-1', 'user-1', {
          title: 'Test',
          startsAt: '2025-01-01T10:00:00Z',
          endsAt: '2025-01-02T10:00:00Z',
        })
      ).rejects.toThrow('Only group admins can create contests');
    });

    it('should throw badRequest when end time is before start time', async () => {
      mockedGroupRepo.getMember.mockResolvedValue({ group_id: 'group-1', user_id: 'user-1', role: 'admin' });

      await expect(
        contestService.create('group-1', 'user-1', {
          title: 'Test',
          startsAt: '2025-01-02T10:00:00Z',
          endsAt: '2025-01-01T10:00:00Z',
        })
      ).rejects.toThrow('End time must be after start time');
      await expect(
        contestService.create('group-1', 'user-1', {
          title: 'Test',
          startsAt: '2025-01-02T10:00:00Z',
          endsAt: '2025-01-01T10:00:00Z',
        })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw badRequest when end time equals start time', async () => {
      mockedGroupRepo.getMember.mockResolvedValue({ group_id: 'group-1', user_id: 'user-1', role: 'admin' });

      await expect(
        contestService.create('group-1', 'user-1', {
          title: 'Test',
          startsAt: '2025-01-01T10:00:00Z',
          endsAt: '2025-01-01T10:00:00Z',
        })
      ).rejects.toThrow('End time must be after start time');
    });
  });

  describe('getForGroup', () => {
    it('should return contests for a group when user is member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.getForGroup.mockResolvedValue([mockContest]);

      const result = await contestService.getForGroup('group-1', 'user-1');

      expect(mockedGroupRepo.isMember).toHaveBeenCalledWith('group-1', 'user-1');
      expect(result).toEqual([mockContest]);
    });

    it('should throw forbidden when user is not a member', async () => {
      mockedGroupRepo.isMember.mockResolvedValue(false);

      await expect(
        contestService.getForGroup('group-1', 'user-2')
      ).rejects.toThrow('Not a member of this group');
      await expect(
        contestService.getForGroup('group-1', 'user-2')
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('getDetails', () => {
    it('should return contest details with problems and standings', async () => {
      mockedContestRepo.findById.mockResolvedValue(mockContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.getProblems.mockResolvedValue([mockProblem]);
      mockedContestRepo.getStandings.mockResolvedValue([mockStanding]);

      const result = await contestService.getDetails('contest-1', 'user-1');

      expect(result).toEqual({
        ...mockContest,
        problems: [mockProblem],
        standings: [mockStanding],
      });
    });

    it('should throw notFound when contest does not exist', async () => {
      mockedContestRepo.findById.mockResolvedValue(null);

      await expect(
        contestService.getDetails('bad-id', 'user-1')
      ).rejects.toThrow('Contest not found');
      await expect(
        contestService.getDetails('bad-id', 'user-1')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw forbidden when user is not a group member', async () => {
      mockedContestRepo.findById.mockResolvedValue(mockContest);
      mockedGroupRepo.isMember.mockResolvedValue(false);

      await expect(
        contestService.getDetails('contest-1', 'user-2')
      ).rejects.toThrow('Not a member of this group');
    });
  });

  describe('submit', () => {
    it('should submit a solution during an active contest', async () => {
      const activeContest = {
        ...mockContest,
        starts_at: new Date(Date.now() - 3600000), // 1 hour ago
        ends_at: new Date(Date.now() + 3600000),   // 1 hour from now
      };
      mockedContestRepo.findById.mockResolvedValue(activeContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);
      mockedContestRepo.submit.mockResolvedValue(mockSubmission);

      const result = await contestService.submit('contest-1', 'user-1', 'prob-1');

      expect(mockedContestRepo.submit).toHaveBeenCalledWith('contest-1', 'user-1', 'prob-1');
      expect(result).toEqual(mockSubmission);
    });

    it('should throw notFound when contest does not exist', async () => {
      mockedContestRepo.findById.mockResolvedValue(null);

      await expect(
        contestService.submit('bad-id', 'user-1', 'prob-1')
      ).rejects.toThrow('Contest not found');
      await expect(
        contestService.submit('bad-id', 'user-1', 'prob-1')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw forbidden when user is not a group member', async () => {
      const activeContest = {
        ...mockContest,
        starts_at: new Date(Date.now() - 3600000),
        ends_at: new Date(Date.now() + 3600000),
      };
      mockedContestRepo.findById.mockResolvedValue(activeContest);
      mockedGroupRepo.isMember.mockResolvedValue(false);

      await expect(
        contestService.submit('contest-1', 'user-2', 'prob-1')
      ).rejects.toThrow('Not a member of this group');
    });

    it('should throw badRequest when contest has not started', async () => {
      const futureContest = {
        ...mockContest,
        starts_at: new Date(Date.now() + 86400000), // tomorrow
        ends_at: new Date(Date.now() + 172800000),
      };
      mockedContestRepo.findById.mockResolvedValue(futureContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);

      await expect(
        contestService.submit('contest-1', 'user-1', 'prob-1')
      ).rejects.toThrow('Contest has not started yet');
      await expect(
        contestService.submit('contest-1', 'user-1', 'prob-1')
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw badRequest when contest has ended', async () => {
      const pastContest = {
        ...mockContest,
        starts_at: new Date(Date.now() - 172800000), // 2 days ago
        ends_at: new Date(Date.now() - 86400000),     // yesterday
      };
      mockedContestRepo.findById.mockResolvedValue(pastContest);
      mockedGroupRepo.isMember.mockResolvedValue(true);

      await expect(
        contestService.submit('contest-1', 'user-1', 'prob-1')
      ).rejects.toThrow('Contest has ended');
      await expect(
        contestService.submit('contest-1', 'user-1', 'prob-1')
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });
});
