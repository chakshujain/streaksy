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
  async create(name: string, code: string, problemId: string, hostId: string, timeLimitMinutes: number): Promise<RoomRow> {
    const rows = await query<RoomRow>(
      `INSERT INTO rooms (name, code, problem_id, host_id, time_limit_minutes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, code, problemId, hostId, timeLimitMinutes]
    );
    return rows[0];
  },

  async findByCode(code: string): Promise<RoomRow | null> {
    return queryOne<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r JOIN problems p ON p.id = r.problem_id
       WHERE r.code = $1`,
      [code]
    );
  },

  async findById(id: string): Promise<RoomRow | null> {
    return queryOne<RoomRow>(
      `SELECT r.*, p.title as problem_title, p.slug as problem_slug, p.difficulty as problem_difficulty
       FROM rooms r JOIN problems p ON p.id = r.problem_id
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
       JOIN problems p ON p.id = r.problem_id
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
       JOIN problems p ON p.id = r.problem_id
       JOIN room_participants rp ON rp.room_id = r.id
       WHERE rp.user_id = $1
       ORDER BY r.created_at DESC LIMIT $2`,
      [userId, limit]
    );
  },
};
