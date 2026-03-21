-- ============================================
-- Problem Difficulty Ratings (Community-Sourced)
-- ============================================

CREATE TABLE problem_ratings (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    difficulty_rating INT NOT NULL CHECK (difficulty_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, problem_id)
);

CREATE INDEX idx_ratings_problem ON problem_ratings(problem_id);

-- Company tags for problems
CREATE TABLE company_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE problem_company_tags (
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    company_tag_id UUID NOT NULL REFERENCES company_tags(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    report_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (problem_id, company_tag_id)
);

CREATE INDEX idx_pct_problem ON problem_company_tags(problem_id);

-- Seed popular company tags
INSERT INTO company_tags (name) VALUES
('Google'), ('Amazon'), ('Meta'), ('Apple'), ('Microsoft'),
('Netflix'), ('Uber'), ('Airbnb'), ('Bloomberg'), ('Goldman Sachs'),
('Adobe'), ('Oracle'), ('Salesforce'), ('LinkedIn'), ('Twitter'),
('Snap'), ('Stripe'), ('Coinbase'), ('Databricks'), ('ByteDance');

CREATE TRIGGER trg_ratings_updated_at BEFORE UPDATE ON problem_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
