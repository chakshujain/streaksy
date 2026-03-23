import { query, queryOne } from '../../../config/database';

export interface RoomRow {
  id: string;
  name: string;
  code: string;
  problem_id: string;
  host_id: string;
  status: string;
  time_limit_minutes: number;
  started_at: Date | null;
  ended_at: Date | null;
  created_at: Date;
  scheduled_at: Date | null;
  sheet_id: string | null;
  mode: string;
  recurrence: string | null;
  meet_link: string | null;
  calendar_event_id: string | null;
  group_id: string | null;
  roadmap_id: string | null;
  problem_title?: string;
  problem_slug?: string;
  problem_difficulty?: string;
}

export interface ParticipantRow {
  room_id: string;
  user_id: string;
  status: string;
  solved_at: Date | null;
  code: string | null;
  language: string | null;
  runtime_ms: number | null;
  memory_kb: number | null;
  joined_at: Date;
  display_name?: string;
}

export interface MessageRow {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  display_name?: string;
}

export const roomRepository = {
  async create(
    name: string,
    code: string,
    problemId: string | null,
    hostId: string,
    timeLimitMinutes: number,
    opts?: { mode?: string; scheduledAt?: string | null; sheetId?: string | null; status?: string; recurrence?: string | null; meetLink?: string | null; calendarEventId?: string | null; groupId?: string | null; roadmapId?: string | null }
  ): Promise<RoomRow> {
    const rows = await query<RoomRow>(
      `INSERT INTO rooms (name, code, problem_id, host_id, time_limit_minutes, mode, scheduled_at, sheet_id, status, recurrence, meet_link, calendar_event_id, group_id, roadmap_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        name,
        code,
        problemId,
        hostId,
        timeLimitMinutes,
        opts?.mode || 'single',
        opts?.scheduledAt || null,
        opts?.sheetId || null,
        opts?.status || 'waiting',
        opts?.recurrence || null,
        opts?.meetLink || null,
        opts?.calendarEventId || null,
        opts?.groupId || null,
        opts?.roadmapId || null,
      ]
    );
    return rows[0];
  },

  async findByCode(code: string): Promise<RoomRow | null> {
    return queryOne<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r LEFT JOIN problems p ON p.id = r.problem_id
       WHERE r.code = $1`,
      [code]
    );
  },

  async findById(id: string): Promise<RoomRow | null> {
    return queryOne<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r LEFT JOIN problems p ON p.id = r.problem_id
       WHERE r.id = $1`,
      [id]
    );
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const extra = status === 'active' ? ', started_at = NOW()' : status === 'finished' ? ', ended_at = NOW()' : '';
    await query(`UPDATE rooms SET status = $1${extra} WHERE id = $2`, [status, id]);
  },

  async addParticipant(roomId: string, userId: string): Promise<void> {
    await query(
      `INSERT INTO room_participants (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [roomId, userId]
    );
  },

  async getParticipants(roomId: string): Promise<ParticipantRow[]> {
    return query<ParticipantRow>(
      `SELECT rp.*, u.display_name FROM room_participants rp
       JOIN users u ON u.id = rp.user_id
       WHERE rp.room_id = $1 ORDER BY rp.solved_at ASC NULLS LAST, rp.joined_at ASC`,
      [roomId]
    );
  },

  async markSolved(roomId: string, userId: string, code: string | null, language: string | null, runtimeMs: number | null, memoryKb: number | null): Promise<void> {
    await query(
      `UPDATE room_participants SET status = 'solved', solved_at = NOW(), code = $3, language = $4, runtime_ms = $5, memory_kb = $6
       WHERE room_id = $1 AND user_id = $2 AND solved_at IS NULL`,
      [roomId, userId, code, language, runtimeMs, memoryKb]
    );
  },

  async addMessage(roomId: string, userId: string, content: string): Promise<MessageRow> {
    const rows = await query<MessageRow>(
      `INSERT INTO room_messages (room_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [roomId, userId, content]
    );
    return rows[0];
  },

  async getMessages(roomId: string, limit = 100): Promise<MessageRow[]> {
    return query<MessageRow>(
      `SELECT m.*, u.display_name FROM room_messages m
       JOIN users u ON u.id = m.user_id
       WHERE m.room_id = $1 ORDER BY m.created_at ASC LIMIT $2`,
      [roomId, limit]
    );
  },

  async getUserActiveRooms(userId: string): Promise<RoomRow[]> {
    return query<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r
       LEFT JOIN problems p ON p.id = r.problem_id
       JOIN room_participants rp ON rp.room_id = r.id
       WHERE rp.user_id = $1 AND r.status IN ('waiting', 'active')
       ORDER BY r.created_at DESC`,
      [userId]
    );
  },

  async getRecentRooms(userId: string, limit = 20): Promise<RoomRow[]> {
    return query<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r
       LEFT JOIN problems p ON p.id = r.problem_id
       JOIN room_participants rp ON rp.room_id = r.id
       WHERE rp.user_id = $1
       ORDER BY r.created_at DESC LIMIT $2`,
      [userId, limit]
    );
  },

  async addProblems(roomId: string, problemIds: string[]): Promise<void> {
    for (let i = 0; i < problemIds.length; i++) {
      await query('INSERT INTO room_problems (room_id, problem_id, position) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [roomId, problemIds[i], i]);
    }
  },

  async getRoomProblems(roomId: string): Promise<{ problem_id: string; title: string; slug: string; difficulty: string; position: number }[]> {
    return query(
      `SELECT p.id as problem_id, p.title, p.slug, p.difficulty, rp.position
       FROM room_problems rp JOIN problems p ON p.id = rp.problem_id
       WHERE rp.room_id = $1 ORDER BY rp.position`,
      [roomId]
    );
  },

  async markProblemSolved(roomId: string, userId: string, problemId: string, code: string | null, language: string | null, runtimeMs: number | null, memoryKb: number | null): Promise<void> {
    await query(
      `INSERT INTO room_participant_solves (room_id, user_id, problem_id, code, language, runtime_ms, memory_kb)
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
      [roomId, userId, problemId, code, language, runtimeMs, memoryKb]
    );
  },

  async getParticipantSolves(roomId: string): Promise<{ user_id: string; problem_id: string; solved_at: Date; display_name?: string }[]> {
    return query(
      `SELECT rps.*, u.display_name FROM room_participant_solves rps
       JOIN users u ON u.id = rps.user_id WHERE rps.room_id = $1 ORDER BY rps.solved_at ASC`,
      [roomId]
    );
  },

  async getScheduledReady(): Promise<RoomRow[]> {
    return query<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r LEFT JOIN problems p ON p.id = r.problem_id
       WHERE r.status = 'scheduled' AND r.scheduled_at <= NOW()`,
      []
    );
  },

  async getUpcoming(limit = 10): Promise<RoomRow[]> {
    return query<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r LEFT JOIN problems p ON p.id = r.problem_id
       WHERE r.status = 'scheduled' AND r.scheduled_at > NOW()
       ORDER BY r.scheduled_at ASC LIMIT $1`,
      [limit]
    );
  },

  async updateStats(userId: string): Promise<void> {
    await query(
      `INSERT INTO room_user_stats (user_id, rooms_participated, rooms_won, total_solves, avg_solve_time_seconds)
       SELECT
         $1,
         (SELECT COUNT(DISTINCT room_id) FROM room_participants WHERE user_id = $1),
         (SELECT COUNT(*) FROM (
           SELECT rp.room_id FROM room_participants rp
           WHERE rp.user_id = $1 AND rp.solved_at IS NOT NULL
           AND rp.solved_at = (SELECT MIN(rp2.solved_at) FROM room_participants rp2 WHERE rp2.room_id = rp.room_id AND rp2.solved_at IS NOT NULL)
         ) wins),
         (SELECT COUNT(*) FROM room_participants WHERE user_id = $1 AND solved_at IS NOT NULL),
         NULL
       ON CONFLICT (user_id) DO UPDATE SET
         rooms_participated = EXCLUDED.rooms_participated,
         rooms_won = EXCLUDED.rooms_won,
         total_solves = EXCLUDED.total_solves,
         updated_at = NOW()`,
      [userId]
    );
  },

  async getLeaderboard(limit = 20): Promise<{ user_id: string; display_name: string; rooms_participated: number; rooms_won: number; total_solves: number }[]> {
    return query(
      `SELECT rus.*, u.display_name FROM room_user_stats rus
       JOIN users u ON u.id = rus.user_id
       ORDER BY rus.rooms_won DESC, rus.total_solves DESC LIMIT $1`,
      [limit]
    );
  },

  async getNextUnsolved(userId: string, sheetId: string, count: number): Promise<{ id: string; title: string; slug: string; difficulty: string; url: string }[]> {
    return query(
      `SELECT p.id, p.title, p.slug, p.difficulty, p.url
       FROM problems p
       JOIN sheet_problems sp ON sp.problem_id = p.id
       LEFT JOIN user_problem_status ups ON ups.problem_id = p.id AND ups.user_id = $1
       WHERE sp.sheet_id = $2 AND (ups.status IS NULL OR ups.status != 'solved')
       ORDER BY sp.position ASC LIMIT $3`,
      [userId, sheetId, count]
    );
  },

  async getRandomFromSheet(userId: string, sheetId: string, count: number): Promise<{ id: string; title: string; slug: string; difficulty: string; url: string }[]> {
    return query(
      `SELECT p.id, p.title, p.slug, p.difficulty, p.url
       FROM problems p
       JOIN sheet_problems sp ON sp.problem_id = p.id
       LEFT JOIN user_problem_status ups ON ups.problem_id = p.id AND ups.user_id = $1
       WHERE sp.sheet_id = $2 AND (ups.status IS NULL OR ups.status != 'solved')
       ORDER BY RANDOM() LIMIT $3`,
      [userId, sheetId, count]
    );
  },

  async getRandomFromAll(userId: string, count: number): Promise<{ id: string; title: string; slug: string; difficulty: string; url: string }[]> {
    return query(
      `SELECT p.id, p.title, p.slug, p.difficulty, p.url
       FROM problems p
       LEFT JOIN user_problem_status ups ON ups.problem_id = p.id AND ups.user_id = $1
       WHERE ups.status IS NULL OR ups.status != 'solved'
       ORDER BY RANDOM() LIMIT $2`,
      [userId, count]
    );
  },

  async updateCalendarEventId(roomId: string, eventId: string): Promise<void> {
    await query('UPDATE rooms SET calendar_event_id = $1 WHERE id = $2', [eventId, roomId]);
  },

  async getRoomsByGroupId(groupId: string): Promise<RoomRow[]> {
    return query<RoomRow>(
      `SELECT r.*, u.display_name AS host_name
       FROM rooms r
       LEFT JOIN users u ON u.id = r.host_id
       WHERE r.group_id = $1
       ORDER BY r.created_at DESC
       LIMIT 20`,
      [groupId]
    );
  },
};
