-- Enhanced notification system: per-channel preferences and web push subscriptions

-- Web Push subscriptions for browser notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);

-- Notification channel preferences (which channels for which types)
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Channel toggles
  in_app_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  -- Category toggles
  social_enabled BOOLEAN DEFAULT true,       -- friend requests, pokes, group activity
  roadmap_enabled BOOLEAN DEFAULT true,      -- roadmap progress, reminders
  room_enabled BOOLEAN DEFAULT true,         -- war room events
  achievement_enabled BOOLEAN DEFAULT true,  -- badges, streaks, milestones
  smart_enabled BOOLEAN DEFAULT true,        -- lagging behind, friend activity alerts
  -- Quiet hours (don't send push/email during these hours)
  quiet_start VARCHAR(5) DEFAULT '22:00',
  quiet_end VARCHAR(5) DEFAULT '07:00',
  PRIMARY KEY (user_id)
);
