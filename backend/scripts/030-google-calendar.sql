-- Google Calendar Integration
-- Stores refresh tokens for calendar access and tracks created events

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_refresh_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_calendar_connected BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  google_event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(30) NOT NULL,   -- 'roadmap_study', 'war_room'
  reference_id UUID NOT NULL,        -- roadmap ID or room ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_ref ON calendar_events(reference_id);

-- Track calendar event on user_roadmaps too
ALTER TABLE user_roadmaps ADD COLUMN IF NOT EXISTS calendar_event_id VARCHAR(255);
