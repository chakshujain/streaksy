CREATE TABLE revision_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    key_takeaway TEXT NOT NULL,
    approach TEXT,
    time_complexity VARCHAR(50),
    space_complexity VARCHAR(50),
    tags TEXT[],
    difficulty_rating VARCHAR(10),
    last_revised_at TIMESTAMPTZ,
    revision_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);
CREATE INDEX idx_revision_notes_user ON revision_notes(user_id);
CREATE TRIGGER trg_revision_updated_at BEFORE UPDATE ON revision_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
