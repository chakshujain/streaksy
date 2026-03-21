-- Roadmap categories
CREATE TABLE IF NOT EXISTS roadmap_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10),
  color VARCHAR(20),
  position INT DEFAULT 0
);

-- Roadmap templates (pre-curated blueprints)
CREATE TABLE IF NOT EXISTS roadmap_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES roadmap_categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(20),
  duration_days INT NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  is_featured BOOLEAN DEFAULT false,
  participant_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template tasks (the actual day-by-day content)
CREATE TABLE IF NOT EXISTS template_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES roadmap_templates(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  task_type VARCHAR(30) DEFAULT 'custom',
  link VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  position INT DEFAULT 0
);

-- User's active roadmap instances
CREATE TABLE IF NOT EXISTS user_roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES roadmap_templates(id),
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES roadmap_categories(id),
  duration_days INT NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  custom_tasks JSONB,
  share_code VARCHAR(12) UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Day-by-day progress tracking
CREATE TABLE IF NOT EXISTS roadmap_day_progress (
  roadmap_id UUID NOT NULL REFERENCES user_roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  PRIMARY KEY (roadmap_id, user_id, day_number)
);

-- Per-roadmap streak tracking
CREATE TABLE IF NOT EXISTS roadmap_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES user_roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  UNIQUE (roadmap_id, user_id)
);

-- Add total_points to user_streaks if not exists
ALTER TABLE user_streaks ADD COLUMN IF NOT EXISTS total_points INT DEFAULT 0;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_user ON user_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_group ON user_roadmaps(group_id);
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_status ON user_roadmaps(user_id, status);
CREATE INDEX IF NOT EXISTS idx_template_tasks_template ON template_tasks(template_id, day_number);
CREATE INDEX IF NOT EXISTS idx_roadmap_day_progress_user ON roadmap_day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_streaks_user ON roadmap_streaks(user_id);
