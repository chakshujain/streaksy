import { queryOne } from '../../../config/database';

export interface PreferencesRow {
  user_id: string;
  theme: string;
  accent_color: string;
  dashboard_layout: string;
  show_streak_animation: boolean;
  show_heatmap: boolean;
  weekly_goal: number;
  updated_at: Date;
}

const DEFAULTS: Omit<PreferencesRow, 'user_id' | 'updated_at'> = {
  theme: 'default',
  accent_color: '#10b981',
  dashboard_layout: 'default',
  show_streak_animation: true,
  show_heatmap: true,
  weekly_goal: 7,
};

export const preferencesRepository = {
  async get(userId: string): Promise<PreferencesRow> {
    const row = await queryOne<PreferencesRow>(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    if (row) return row;
    return {
      user_id: userId,
      ...DEFAULTS,
      updated_at: new Date(),
    };
  },

  async upsert(userId: string, prefs: Partial<Omit<PreferencesRow, 'user_id' | 'updated_at'>>): Promise<PreferencesRow> {
    const row = await queryOne<PreferencesRow>(
      `INSERT INTO user_preferences (user_id, theme, accent_color, dashboard_layout, show_streak_animation, show_heatmap, weekly_goal)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
         theme = COALESCE($2, user_preferences.theme),
         accent_color = COALESCE($3, user_preferences.accent_color),
         dashboard_layout = COALESCE($4, user_preferences.dashboard_layout),
         show_streak_animation = COALESCE($5, user_preferences.show_streak_animation),
         show_heatmap = COALESCE($6, user_preferences.show_heatmap),
         weekly_goal = COALESCE($7, user_preferences.weekly_goal),
         updated_at = NOW()
       RETURNING *`,
      [
        userId,
        prefs.theme ?? DEFAULTS.theme,
        prefs.accent_color ?? DEFAULTS.accent_color,
        prefs.dashboard_layout ?? DEFAULTS.dashboard_layout,
        prefs.show_streak_animation ?? DEFAULTS.show_streak_animation,
        prefs.show_heatmap ?? DEFAULTS.show_heatmap,
        prefs.weekly_goal ?? DEFAULTS.weekly_goal,
      ]
    );
    return row!;
  },
};
