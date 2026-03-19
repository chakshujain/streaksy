-- Recurring room schedule
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS recurrence VARCHAR(20);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS meet_link VARCHAR(500);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS calendar_event_id VARCHAR(255);

-- recurrence values: null (one-time), 'daily', 'weekdays', 'weekends', 'weekly', 'monthly'
