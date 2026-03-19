-- Group plans/objectives and assigned sheets
ALTER TABLE groups ADD COLUMN IF NOT EXISTS plan TEXT;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS objective VARCHAR(255);
ALTER TABLE groups ADD COLUMN IF NOT EXISTS target_date DATE;

CREATE TABLE group_sheets (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    sheet_id UUID NOT NULL REFERENCES sheets(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, sheet_id)
);
CREATE INDEX idx_group_sheets ON group_sheets(group_id);
