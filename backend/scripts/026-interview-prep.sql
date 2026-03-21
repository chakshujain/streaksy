CREATE TABLE interview_roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  answers JSONB NOT NULL,
  days JSONB NOT NULL,
  total_days INT NOT NULL,
  share_code VARCHAR(12) UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roadmap_progress (
  roadmap_id UUID NOT NULL REFERENCES interview_roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (roadmap_id, user_id, day_number)
);

CREATE INDEX idx_roadmaps_user ON interview_roadmaps(user_id);
CREATE INDEX idx_roadmaps_group ON interview_roadmaps(group_id);
CREATE INDEX idx_roadmaps_share ON interview_roadmaps(share_code);
