-- Link rooms to groups and roadmaps
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id) ON DELETE SET NULL;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS roadmap_id UUID REFERENCES user_roadmaps(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_rooms_group ON rooms(group_id);
CREATE INDEX IF NOT EXISTS idx_rooms_roadmap ON rooms(roadmap_id);
