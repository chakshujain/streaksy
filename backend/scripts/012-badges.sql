CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    criteria JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE user_badges (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- Seed default badges
INSERT INTO badges (name, description, icon, category, criteria) VALUES
('First Solve', 'Solved your first problem', 'trophy', 'solve', '{"solveCount": 1}'),
('Ten Down', 'Solved 10 problems', 'star', 'solve', '{"solveCount": 10}'),
('Half Century', 'Solved 50 problems', 'award', 'solve', '{"solveCount": 50}'),
('Century Club', 'Solved 100 problems', 'crown', 'solve', '{"solveCount": 100}'),
('Week Warrior', '7-day streak', 'flame', 'streak', '{"streakDays": 7}'),
('Fortnight Fighter', '14-day streak', 'flame', 'streak', '{"streakDays": 14}'),
('Monthly Master', '30-day streak', 'flame', 'streak', '{"streakDays": 30}'),
('Easy Peasy', 'Solved 10 easy problems', 'zap', 'difficulty', '{"difficulty": "easy", "count": 10}'),
('Medium Rare', 'Solved 10 medium problems', 'target', 'difficulty', '{"difficulty": "medium", "count": 10}'),
('Hard Hitter', 'Solved 10 hard problems', 'shield', 'difficulty', '{"difficulty": "hard", "count": 10}'),
('Team Player', 'Joined a study group', 'users', 'social', '{"action": "group_join"}'),
('Note Taker', 'Created 10 revision notes', 'book-open', 'social', '{"revisionCount": 10}');
