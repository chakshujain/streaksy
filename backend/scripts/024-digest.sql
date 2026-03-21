-- ============================================
-- Smart Notifications & Daily Digest
-- ============================================

-- Digest preferences
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS digest_enabled BOOLEAN DEFAULT true;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS digest_time VARCHAR(5) DEFAULT '08:00';
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS digest_frequency VARCHAR(20) DEFAULT 'daily'
    CHECK (digest_frequency IN ('daily', 'weekly', 'off'));
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS evening_reminder BOOLEAN DEFAULT true;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS weekly_report BOOLEAN DEFAULT true;

-- Track digest sends to prevent duplicates
CREATE TABLE digest_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    digest_type VARCHAR(20) NOT NULL CHECK (digest_type IN ('morning', 'evening', 'weekly')),
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_digest_log_user ON digest_log(user_id, digest_type, sent_at DESC);
