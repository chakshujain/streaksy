CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    language VARCHAR(30) NOT NULL,
    code TEXT,
    runtime_ms INT,
    runtime_percentile NUMERIC(5,2),
    memory_kb INT,
    memory_percentile NUMERIC(5,2),
    time_spent_seconds INT,
    leetcode_submission_id VARCHAR(50),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_submissions_user ON submissions(user_id, submitted_at DESC);
CREATE INDEX idx_submissions_problem ON submissions(user_id, problem_id);
CREATE INDEX idx_submissions_leetcode_id ON submissions(leetcode_submission_id);
