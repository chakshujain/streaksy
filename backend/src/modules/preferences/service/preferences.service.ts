import { preferencesRepository, PreferencesRow } from '../repository/preferences.repository';

export const preferencesService = {
  async get(userId: string) {
    const prefs = await preferencesRepository.get(userId);
    return formatPreferences(prefs);
  },

  async update(userId: string, data: Partial<Omit<PreferencesRow, 'user_id' | 'updated_at'>>) {
    const prefs = await preferencesRepository.upsert(userId, data);
    return formatPreferences(prefs);
  },
};

function formatPreferences(prefs: PreferencesRow) {
  return {
    theme: prefs.theme,
    accentColor: prefs.accent_color,
    dashboardLayout: prefs.dashboard_layout,
    showStreakAnimation: prefs.show_streak_animation,
    showHeatmap: prefs.show_heatmap,
    weeklyGoal: prefs.weekly_goal,
    updatedAt: prefs.updated_at,
  };
}
