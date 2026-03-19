import { preferencesService } from '../../../modules/preferences/service/preferences.service';
import { preferencesRepository } from '../../../modules/preferences/repository/preferences.repository';

jest.mock('../../../modules/preferences/repository/preferences.repository');
const mockedRepo = preferencesRepository as jest.Mocked<typeof preferencesRepository>;

describe('preferencesService', () => {
  const defaultRow = {
    user_id: 'user-1',
    theme: 'default',
    accent_color: '#10b981',
    dashboard_layout: 'default',
    show_streak_animation: true,
    show_heatmap: true,
    weekly_goal: 7,
    updated_at: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return formatted preferences', async () => {
      mockedRepo.get.mockResolvedValue(defaultRow);

      const result = await preferencesService.get('user-1');

      expect(result).toEqual({
        theme: 'default',
        accentColor: '#10b981',
        dashboardLayout: 'default',
        showStreakAnimation: true,
        showHeatmap: true,
        weeklyGoal: 7,
        updatedAt: defaultRow.updated_at,
      });
    });
  });

  describe('update', () => {
    it('should update and return formatted preferences', async () => {
      const updatedRow = { ...defaultRow, theme: 'dark', weekly_goal: 14 };
      mockedRepo.upsert.mockResolvedValue(updatedRow);

      const result = await preferencesService.update('user-1', {
        theme: 'dark',
        weekly_goal: 14,
      });

      expect(mockedRepo.upsert).toHaveBeenCalledWith('user-1', {
        theme: 'dark',
        weekly_goal: 14,
      });
      expect(result.theme).toBe('dark');
      expect(result.weeklyGoal).toBe(14);
    });
  });
});
