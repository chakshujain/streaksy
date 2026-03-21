-- Roadmap participants (who's on a roadmap template)
CREATE TABLE IF NOT EXISTS roadmap_participants (
  template_id UUID NOT NULL REFERENCES roadmap_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES user_roadmaps(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (template_id, user_id)
);

-- Roadmap discussions (per-template chat)
CREATE TABLE IF NOT EXISTS roadmap_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES roadmap_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES roadmap_discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmap_participants_template ON roadmap_participants(template_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_discussions_template ON roadmap_discussions(template_id, created_at DESC);
