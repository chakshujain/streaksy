-- Multi-problem support
CREATE TABLE room_problems (
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id),
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (room_id, problem_id)
);
CREATE INDEX idx_room_problems_room ON room_problems(room_id);

-- Per-problem solve tracking
CREATE TABLE room_participant_solves (
    room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    problem_id UUID NOT NULL REFERENCES problems(id),
    solved_at TIMESTAMPTZ DEFAULT NOW(),
    code TEXT,
    language VARCHAR(30),
    runtime_ms INT,
    memory_kb INT,
    PRIMARY KEY (room_id, user_id, problem_id)
);

-- Room enhancements
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS sheet_id UUID REFERENCES sheets(id);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS mode VARCHAR(20) NOT NULL DEFAULT 'single';
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE rooms ALTER COLUMN problem_id DROP NOT NULL;

-- Room stats for leaderboard
CREATE TABLE room_user_stats (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
    rooms_participated INT NOT NULL DEFAULT 0,
    rooms_won INT NOT NULL DEFAULT 0,
    total_solves INT NOT NULL DEFAULT 0,
    avg_solve_time_seconds INT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backfill existing rooms into room_problems
INSERT INTO room_problems (room_id, problem_id, position)
SELECT id, problem_id, 0 FROM rooms WHERE problem_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Backfill existing solves
INSERT INTO room_participant_solves (room_id, user_id, problem_id, solved_at, code, language, runtime_ms, memory_kb)
SELECT rp.room_id, rp.user_id, r.problem_id, rp.solved_at, rp.code, rp.language, rp.runtime_ms, rp.memory_kb
FROM room_participants rp JOIN rooms r ON r.id = rp.room_id
WHERE rp.solved_at IS NOT NULL AND r.problem_id IS NOT NULL
ON CONFLICT DO NOTHING;
