-- Add AI revision fields to revision_notes
ALTER TABLE revision_notes ADD COLUMN IF NOT EXISTS intuition TEXT;
ALTER TABLE revision_notes ADD COLUMN IF NOT EXISTS points_to_remember TEXT[];
ALTER TABLE revision_notes ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE;
