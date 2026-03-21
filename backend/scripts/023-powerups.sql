-- ============================================
-- Streak Freeze & Power-ups
-- ============================================

-- Points balance and streak freezes
ALTER TABLE user_streaks ADD COLUMN IF NOT EXISTS points INT NOT NULL DEFAULT 0;
ALTER TABLE user_streaks ADD COLUMN IF NOT EXISTS freeze_count INT NOT NULL DEFAULT 0;
ALTER TABLE user_streaks ADD COLUMN IF NOT EXISTS last_freeze_used DATE;

-- Power-up inventory
CREATE TABLE user_powerups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    powerup_type VARCHAR(30) NOT NULL CHECK (powerup_type IN ('streak_freeze', 'double_xp', 'streak_shield')),
    quantity INT NOT NULL DEFAULT 1,
    UNIQUE (user_id, powerup_type)
);

CREATE INDEX idx_powerups_user ON user_powerups(user_id);

-- Power-up usage log
CREATE TABLE powerup_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    powerup_type VARCHAR(30) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('earned', 'used', 'expired')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_powerup_log_user ON powerup_log(user_id, created_at DESC);

-- Milestone definitions for earning power-ups
-- 7-day streak = 1 freeze, 14-day = 1 double_xp, 30-day = 1 shield
-- Every 10 problems solved = 50 points
-- Points can buy: freeze (100 pts), double_xp (150 pts), shield (200 pts)
