import { roadmapsService } from '../../../modules/roadmaps/service/roadmaps.service';
import { roadmapsRepository } from '../../../modules/roadmaps/repository/roadmaps.repository';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/roadmaps/repository/roadmaps.repository');
jest.mock('../../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, breakdown: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));

const mockedRepo = roadmapsRepository as jest.Mocked<typeof roadmapsRepository>;
const { queryOne: mockedQueryOne } = require('../../../config/database');

describe('roadmapsService', () => {
  const mockTemplate = {
    id: 'tmpl-1',
    category_id: 'cat-1',
    name: 'Crack the Job',
    slug: 'crack-the-job',
    description: 'A 90-day coding prep roadmap',
    icon: null,
    color: null,
    duration_days: 90,
    difficulty: 'intermediate',
    is_featured: true,
    participant_count: 100,
    created_at: new Date(),
    tasks: [],
  };

  const mockRoadmap = {
    id: 'rm-1',
    user_id: 'user-1',
    template_id: 'tmpl-1',
    group_id: null,
    name: 'My Roadmap',
    category_id: 'cat-1',
    duration_days: 30,
    start_date: '2026-01-01',
    status: 'active',
    custom_tasks: null,
    share_code: 'abc123',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockStreak = {
    id: 'streak-1',
    roadmap_id: 'rm-1',
    user_id: 'user-1',
    current_streak: 5,
    longest_streak: 10,
    last_activity_date: '2026-01-05',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should return categories', async () => {
      const categories = [{ id: 'cat-1', name: 'Coding', slug: 'coding', icon: null, color: null, position: 1 }];
      mockedRepo.getCategories.mockResolvedValue(categories);

      const result = await roadmapsService.getCategories();

      expect(result).toEqual(categories);
    });
  });

  describe('getTemplates', () => {
    it('should return all templates', async () => {
      mockedRepo.getTemplates.mockResolvedValue([mockTemplate]);

      const result = await roadmapsService.getTemplates();

      expect(mockedRepo.getTemplates).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockTemplate]);
    });

    it('should filter templates by category slug', async () => {
      mockedRepo.getTemplates.mockResolvedValue([mockTemplate]);

      await roadmapsService.getTemplates('coding');

      expect(mockedRepo.getTemplates).toHaveBeenCalledWith('coding');
    });
  });

  describe('getTemplateBySlug', () => {
    it('should return a template by slug', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(mockTemplate);

      const result = await roadmapsService.getTemplateBySlug('crack-the-job');

      expect(result).toEqual(mockTemplate);
    });

    it('should throw notFound when template does not exist', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(null);

      await expect(roadmapsService.getTemplateBySlug('nonexistent')).rejects.toThrow(
        'Template not found'
      );
      await expect(roadmapsService.getTemplateBySlug('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('createUserRoadmap', () => {
    it('should create a user roadmap', async () => {
      mockedRepo.createUserRoadmap.mockResolvedValue(mockRoadmap);
      mockedRepo.addParticipant.mockResolvedValue();

      const result = await roadmapsService.createUserRoadmap('user-1', {
        templateId: 'tmpl-1',
        name: 'My Roadmap',
        durationDays: 30,
      });

      expect(mockedRepo.createUserRoadmap).toHaveBeenCalled();
      expect(mockedRepo.addParticipant).toHaveBeenCalledWith('tmpl-1', 'user-1', 'rm-1');
      expect(result).toEqual(mockRoadmap);
    });

    it('should throw forbidden when user is not a member of the group', async () => {
      mockedQueryOne.mockResolvedValue(null);

      await expect(
        roadmapsService.createUserRoadmap('user-1', {
          groupId: 'group-1',
          name: 'My Roadmap',
          durationDays: 30,
        })
      ).rejects.toThrow('Not a member of this group');
      await expect(
        roadmapsService.createUserRoadmap('user-1', {
          groupId: 'group-1',
          name: 'My Roadmap',
          durationDays: 30,
        })
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('getRoadmapById', () => {
    it('should return roadmap with tasks, progress, and streak', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.getTemplateTasks.mockResolvedValue([]);
      mockedRepo.getDayProgress.mockResolvedValue([]);
      mockedRepo.getStreak.mockResolvedValue(mockStreak);

      const result = await roadmapsService.getRoadmapById('rm-1', 'user-1');

      expect(result).toEqual({
        roadmap: mockRoadmap,
        tasks: [],
        progress: [],
        streak: mockStreak,
      });
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      await expect(roadmapsService.getRoadmapById('bad-id', 'user-1')).rejects.toThrow(
        'Roadmap not found'
      );
    });
  });

  describe('updateRoadmap', () => {
    it('should update a roadmap', async () => {
      const updated = { ...mockRoadmap, name: 'Renamed' };
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.updateRoadmap.mockResolvedValue(updated);

      const result = await roadmapsService.updateRoadmap('rm-1', 'user-1', { name: 'Renamed' });

      expect(result).toEqual(updated);
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      await expect(roadmapsService.updateRoadmap('bad-id', 'user-1', {})).rejects.toThrow(
        'Roadmap not found'
      );
    });

    it('should throw forbidden when user is not the owner', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);

      await expect(
        roadmapsService.updateRoadmap('rm-1', 'user-2', { name: 'Hack' })
      ).rejects.toThrow('Not your roadmap');
      await expect(
        roadmapsService.updateRoadmap('rm-1', 'user-2', { name: 'Hack' })
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('deleteRoadmap', () => {
    it('should delete a roadmap', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.deleteRoadmap.mockResolvedValue();

      await expect(roadmapsService.deleteRoadmap('rm-1', 'user-1')).resolves.toBeUndefined();
      expect(mockedRepo.deleteRoadmap).toHaveBeenCalledWith('rm-1');
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      await expect(roadmapsService.deleteRoadmap('bad-id', 'user-1')).rejects.toThrow(
        'Roadmap not found'
      );
    });

    it('should throw forbidden when user is not the owner', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);

      await expect(roadmapsService.deleteRoadmap('rm-1', 'user-2')).rejects.toThrow(
        'Not your roadmap'
      );
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard for a roadmap', async () => {
      const lb = [{ user_id: 'user-1', display_name: 'User One', avatar_url: null, completed_count: 10, current_streak: 5 }];
      mockedRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRepo.getLeaderboard.mockResolvedValue(lb);

      const result = await roadmapsService.getLeaderboard('rm-1');

      expect(result).toEqual(lb);
    });

    it('should throw notFound when roadmap does not exist', async () => {
      mockedRepo.getRoadmapById.mockResolvedValue(null);

      await expect(roadmapsService.getLeaderboard('bad-id')).rejects.toThrow(
        'Roadmap not found'
      );
    });
  });

  describe('getByShareCode', () => {
    it('should return roadmap by share code', async () => {
      mockedRepo.getByShareCode.mockResolvedValue(mockRoadmap);

      const result = await roadmapsService.getByShareCode('abc123');

      expect(result).toEqual(mockRoadmap);
    });

    it('should throw notFound for invalid share code', async () => {
      mockedRepo.getByShareCode.mockResolvedValue(null);

      await expect(roadmapsService.getByShareCode('invalid')).rejects.toThrow(
        'Roadmap not found'
      );
    });
  });

  describe('getParticipants', () => {
    it('should return participants for a template', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(mockTemplate);
      mockedRepo.getParticipants.mockResolvedValue([]);

      const result = await roadmapsService.getParticipants('crack-the-job');

      expect(mockedRepo.getParticipants).toHaveBeenCalledWith('tmpl-1');
      expect(result).toEqual([]);
    });

    it('should throw notFound when template does not exist', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(null);

      await expect(roadmapsService.getParticipants('nonexistent')).rejects.toThrow(
        'Template not found'
      );
    });
  });

  describe('getDiscussions', () => {
    it('should return discussions for a template', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(mockTemplate);
      mockedRepo.getDiscussions.mockResolvedValue([]);

      const result = await roadmapsService.getDiscussions('crack-the-job');

      expect(result).toEqual([]);
    });

    it('should throw notFound when template does not exist', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(null);

      await expect(roadmapsService.getDiscussions('nonexistent')).rejects.toThrow(
        'Template not found'
      );
    });
  });

  describe('createDiscussion', () => {
    it('should create a discussion on a template', async () => {
      const discussion = { id: 'd-1', template_id: 'tmpl-1', user_id: 'user-1', content: 'Great roadmap!', parent_id: null, created_at: new Date() };
      mockedRepo.getTemplateBySlug.mockResolvedValue(mockTemplate);
      mockedRepo.createDiscussion.mockResolvedValue(discussion);

      const result = await roadmapsService.createDiscussion('crack-the-job', 'user-1', 'Great roadmap!');

      expect(mockedRepo.createDiscussion).toHaveBeenCalledWith('tmpl-1', 'user-1', 'Great roadmap!', undefined);
      expect(result).toEqual(discussion);
    });

    it('should throw notFound when template does not exist', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(null);

      await expect(
        roadmapsService.createDiscussion('nonexistent', 'user-1', 'text')
      ).rejects.toThrow('Template not found');
    });

    it('should throw badRequest when content is empty', async () => {
      mockedRepo.getTemplateBySlug.mockResolvedValue(mockTemplate);

      await expect(
        roadmapsService.createDiscussion('crack-the-job', 'user-1', '')
      ).rejects.toThrow('Content is required');
      await expect(
        roadmapsService.createDiscussion('crack-the-job', 'user-1', '   ')
      ).rejects.toThrow('Content is required');
    });
  });

  describe('getActiveRoadmaps', () => {
    it('should return active roadmaps for a user', async () => {
      mockedRepo.getActiveRoadmaps.mockResolvedValue([mockRoadmap]);

      const result = await roadmapsService.getActiveRoadmaps('user-1');

      expect(mockedRepo.getActiveRoadmaps).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockRoadmap]);
    });
  });

  describe('getTodayTasks', () => {
    it('should return today tasks for a user', async () => {
      mockedRepo.getTodayTasks.mockResolvedValue([]);

      const result = await roadmapsService.getTodayTasks('user-1');

      expect(mockedRepo.getTodayTasks).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([]);
    });
  });
});
