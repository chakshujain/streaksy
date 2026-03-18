CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'default',
    accent_color VARCHAR(7) DEFAULT '#10b981',
    dashboard_layout VARCHAR(20) DEFAULT 'default',
    show_streak_animation BOOLEAN DEFAULT true,
    show_heatmap BOOLEAN DEFAULT true,
    weekly_goal INT DEFAULT 7,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
