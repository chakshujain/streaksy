import { query, queryOne } from '../../../config/database';

interface CalendarEventRow {
  id: string;
  user_id: string;
  google_event_id: string;
  event_type: string;
  reference_id: string;
  created_at: Date;
}

export const calendarRepository = {
  async create(userId: string, googleEventId: string, eventType: string, referenceId: string): Promise<CalendarEventRow> {
    const rows = await query<CalendarEventRow>(
      `INSERT INTO calendar_events (user_id, google_event_id, event_type, reference_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, googleEventId, eventType, referenceId]
    );
    return rows[0];
  },

  async findByReference(userId: string, referenceId: string): Promise<CalendarEventRow[]> {
    return query<CalendarEventRow>(
      'SELECT * FROM calendar_events WHERE user_id = $1 AND reference_id = $2',
      [userId, referenceId]
    );
  },

  async deleteByReference(userId: string, referenceId: string): Promise<void> {
    await query('DELETE FROM calendar_events WHERE user_id = $1 AND reference_id = $2', [userId, referenceId]);
  },

  async deleteByUser(userId: string): Promise<void> {
    await query('DELETE FROM calendar_events WHERE user_id = $1', [userId]);
  },

  // Google refresh token storage on users table
  async setGoogleRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await query(
      'UPDATE users SET google_refresh_token = $1, google_calendar_connected = true WHERE id = $2',
      [refreshToken, userId]
    );
  },

  async getGoogleRefreshToken(userId: string): Promise<string | null> {
    const row = await queryOne<{ google_refresh_token: string | null }>(
      'SELECT google_refresh_token FROM users WHERE id = $1',
      [userId]
    );
    return row?.google_refresh_token || null;
  },

  async isCalendarConnected(userId: string): Promise<boolean> {
    const row = await queryOne<{ google_calendar_connected: boolean }>(
      'SELECT google_calendar_connected FROM users WHERE id = $1',
      [userId]
    );
    return row?.google_calendar_connected || false;
  },

  async disconnectCalendar(userId: string): Promise<void> {
    await query(
      'UPDATE users SET google_refresh_token = NULL, google_calendar_connected = false WHERE id = $1',
      [userId]
    );
  },
};
