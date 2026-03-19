import { query, queryOne } from '../../../config/database';

export interface ContestRow {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  starts_at: Date;
  ends_at: Date;
  created_by: string;
  created_at: Date;
}

export interface ContestProblemRow {
  problem_id: string;
  title: string;
  slug: string;
  difficulty: string;
  position: number;
}

export interface SubmissionRow {
  id: string;
  contest_id: string;
  user_id: string;
  problem_id: string;
  submitted_at: Date;
}

export interface StandingRow {
  user_id: string;
  display_name: string;
  solved_count: number;
  last_submission: Date;
}

export const contestRepository = {
  async create(groupId: string, title: string, description: string | null, startsAt: string, endsAt: string, createdBy: string): Promise<ContestRow> {
    const rows = await query<ContestRow>(
      `INSERT INTO contests (group_id, title, description, starts_at, ends_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [groupId, title, description, startsAt, endsAt, createdBy]
    );
    return rows[0];
  },

  async addProblem(contestId: string, problemId: string, position: number): Promise<void> {
    await query(
      `INSERT INTO contest_problems (contest_id, problem_id, position)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [contestId, problemId, position]
    );
  },

  async getForGroup(groupId: string): Promise<ContestRow[]> {
    return query<ContestRow>(
      'SELECT * FROM contests WHERE group_id = $1 ORDER BY starts_at DESC',
      [groupId]
    );
  },

  async findById(id: string): Promise<ContestRow | null> {
    return queryOne<ContestRow>('SELECT * FROM contests WHERE id = $1', [id]);
  },

  async getProblems(contestId: string): Promise<ContestProblemRow[]> {
    return query<ContestProblemRow>(
      `SELECT p.id as problem_id, p.title, p.slug, p.difficulty, cp.position
       FROM contest_problems cp
       JOIN problems p ON p.id = cp.problem_id
       WHERE cp.contest_id = $1 ORDER BY cp.position`,
      [contestId]
    );
  },

  async submit(contestId: string, userId: string, problemId: string): Promise<SubmissionRow> {
    const rows = await query<SubmissionRow>(
      `INSERT INTO contest_submissions (contest_id, user_id, problem_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (contest_id, user_id, problem_id) DO UPDATE SET submitted_at = NOW()
       RETURNING *`,
      [contestId, userId, problemId]
    );
    return rows[0];
  },

  async getStandings(contestId: string): Promise<StandingRow[]> {
    return query<StandingRow>(
      `SELECT cs.user_id, u.display_name,
              COUNT(*)::int as solved_count,
              MAX(cs.submitted_at) as last_submission
       FROM contest_submissions cs
       JOIN users u ON u.id = cs.user_id
       WHERE cs.contest_id = $1
       GROUP BY cs.user_id, u.display_name
       ORDER BY solved_count DESC, last_submission ASC`,
      [contestId]
    );
  },
};
