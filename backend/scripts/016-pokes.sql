-- Poke / Nudge system
CREATE TABLE pokes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    poke_type VARCHAR(20) NOT NULL DEFAULT 'manual',
    escalation_level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pokes_to_user ON pokes(to_user_id, created_at DESC);
CREATE INDEX idx_pokes_cooldown ON pokes(from_user_id, to_user_id, created_at DESC);

-- Nudge preferences per user
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS nudge_frequency VARCHAR(20) DEFAULT 'medium';
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS nudge_channels TEXT[] DEFAULT ARRAY['in_app'];
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS nudge_quiet_start INT DEFAULT 22;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS nudge_quiet_end INT DEFAULT 8;

-- Recovery challenges
CREATE TABLE recovery_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_type VARCHAR(30) NOT NULL,
    target_count INT NOT NULL DEFAULT 3,
    completed_count INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_recovery_user ON recovery_challenges(user_id, status);
