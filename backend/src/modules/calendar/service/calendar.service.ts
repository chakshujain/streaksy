import { google } from 'googleapis';
import { env } from '../../../config/env';
import { calendarRepository } from '../repository/calendar.repository';
import { logger } from '../../../config/logger';

const log = logger.child({ module: 'calendar' });

function createOAuth2Client() {
  return new google.auth.OAuth2(
    env.google.clientId,
    env.google.clientSecret,
    `${env.google.callbackUrl.replace('/google/callback', '/google/calendar/callback')}`
  );
}

export const calendarService = {
  /**
   * Build the Google OAuth consent URL for calendar access
   */
  getConsentUrl(userId: string): string {
    const oauth2 = createOAuth2Client();
    return oauth2.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
      state: userId, // We'll sign this in the route handler
    });
  },

  /**
   * Exchange authorization code for tokens, store the refresh token
   */
  async handleCallback(code: string, userId: string): Promise<void> {
    const oauth2 = createOAuth2Client();
    const { tokens } = await oauth2.getToken(code);

    if (!tokens.refresh_token) {
      throw new Error('No refresh token received. User may need to revoke access and try again.');
    }

    await calendarRepository.setGoogleRefreshToken(userId, tokens.refresh_token);
    log.info({ userId }, 'Google Calendar connected');
  },

  /**
   * Get an authenticated Google Calendar client for a user
   * Returns null if user hasn't connected calendar
   */
  async getCalendarClient(userId: string) {
    const refreshToken = await calendarRepository.getGoogleRefreshToken(userId);
    if (!refreshToken) return null;

    const oauth2 = createOAuth2Client();
    oauth2.setCredentials({ refresh_token: refreshToken });

    try {
      // Test the token is still valid
      await oauth2.getAccessToken();
    } catch (err) {
      // Token revoked or expired — mark as disconnected
      log.warn({ userId }, 'Google Calendar token invalid, disconnecting');
      await calendarRepository.disconnectCalendar(userId);
      return null;
    }

    return google.calendar({ version: 'v3', auth: oauth2 });
  },

  /**
   * Create a recurring daily study event for a roadmap
   */
  async createRoadmapEvents(userId: string, roadmap: {
    id: string;
    name: string;
    startDate: string;
    durationDays: number;
    hoursPerDay?: number;
  }): Promise<string | null> {
    const calendar = await this.getCalendarClient(userId);
    if (!calendar) return null;

    const startDate = new Date(roadmap.startDate);
    const hours = roadmap.hoursPerDay || 2;

    // Default study time: 9:00 AM
    const startTime = new Date(startDate);
    startTime.setHours(9, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(9 + hours, 0, 0, 0);

    // End date for recurrence
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + roadmap.durationDays);
    const untilStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: `📚 Streaksy: ${roadmap.name}`,
          description: `Daily study session for your "${roadmap.name}" roadmap on Streaksy.\n\nTrack your progress: ${env.frontendUrl}/roadmaps/${roadmap.id}`,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'UTC',
          },
          recurrence: [
            `RRULE:FREQ=DAILY;UNTIL=${untilStr}`,
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 15 },
            ],
          },
          colorId: '2', // Sage green
        },
      });

      const eventId = event.data.id;
      if (eventId) {
        await calendarRepository.create(userId, eventId, 'roadmap_study', roadmap.id);
        // Also store on the roadmap itself
        const { query: dbQuery } = await import('../../../config/database');
        await dbQuery('UPDATE user_roadmaps SET calendar_event_id = $1 WHERE id = $2', [eventId, roadmap.id]);
        log.info({ userId, roadmapId: roadmap.id, eventId }, 'Roadmap calendar event created');
      }

      return eventId || null;
    } catch (err) {
      log.error({ userId, err }, 'Failed to create roadmap calendar event');
      return null;
    }
  },

  /**
   * Create a calendar event for a scheduled war room
   */
  async createRoomEvent(userId: string, room: {
    id: string;
    name: string;
    scheduledAt: string;
    timeLimitMinutes: number;
    meetLink?: string;
    recurrence?: string;
  }): Promise<string | null> {
    const calendar = await this.getCalendarClient(userId);
    if (!calendar) return null;

    const startTime = new Date(room.scheduledAt);
    const endTime = new Date(startTime.getTime() + room.timeLimitMinutes * 60 * 1000);

    // Map recurrence to RRULE
    const recurrenceRules: string[] = [];
    if (room.recurrence) {
      const rruleMap: Record<string, string> = {
        daily: 'RRULE:FREQ=DAILY',
        weekdays: 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
        weekends: 'RRULE:FREQ=WEEKLY;BYDAY=SA,SU',
        weekly: 'RRULE:FREQ=WEEKLY',
        monthly: 'RRULE:FREQ=MONTHLY',
      };
      if (rruleMap[room.recurrence]) {
        recurrenceRules.push(rruleMap[room.recurrence]);
      }
    }

    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: `⚔️ War Room: ${room.name}`,
          description: `Collaborative problem-solving session on Streaksy.\n\nJoin: ${env.frontendUrl}/rooms/${room.id}`,
          location: room.meetLink || undefined,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'UTC',
          },
          recurrence: recurrenceRules.length > 0 ? recurrenceRules : undefined,
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 10 },
            ],
          },
          colorId: '11', // Tomato red
        },
      });

      const eventId = event.data.id;
      if (eventId) {
        await calendarRepository.create(userId, eventId, 'war_room', room.id);
        log.info({ userId, roomId: room.id, eventId }, 'Room calendar event created');
      }

      return eventId || null;
    } catch (err) {
      log.error({ userId, err }, 'Failed to create room calendar event');
      return null;
    }
  },

  /**
   * Create room events for all participants who have calendar connected
   */
  async createRoomEventForParticipants(room: {
    id: string;
    name: string;
    scheduledAt: string;
    timeLimitMinutes: number;
    meetLink?: string;
    recurrence?: string;
  }, participantIds: string[]): Promise<void> {
    for (const userId of participantIds) {
      const connected = await calendarRepository.isCalendarConnected(userId);
      if (connected) {
        await this.createRoomEvent(userId, room).catch(() => {});
      }
    }
  },

  /**
   * Delete all calendar events for a reference (roadmap/room)
   */
  async deleteEventsForReference(userId: string, referenceId: string): Promise<void> {
    const events = await calendarRepository.findByReference(userId, referenceId);
    const calendar = await this.getCalendarClient(userId);

    if (calendar) {
      for (const evt of events) {
        try {
          await calendar.events.delete({
            calendarId: 'primary',
            eventId: evt.google_event_id,
          });
        } catch {
          // Event may already be deleted from Google Calendar
        }
      }
    }

    await calendarRepository.deleteByReference(userId, referenceId);
  },

  /**
   * Disconnect calendar — revoke token and clean up
   */
  async disconnect(userId: string): Promise<void> {
    const refreshToken = await calendarRepository.getGoogleRefreshToken(userId);
    if (refreshToken) {
      try {
        const oauth2 = createOAuth2Client();
        oauth2.setCredentials({ refresh_token: refreshToken });
        await oauth2.revokeToken(refreshToken);
      } catch {
        // Best-effort revocation
      }
    }
    await calendarRepository.deleteByUser(userId);
    await calendarRepository.disconnectCalendar(userId);
    log.info({ userId }, 'Google Calendar disconnected');
  },

  /**
   * Check if a user has calendar connected
   */
  async isConnected(userId: string): Promise<boolean> {
    return calendarRepository.isCalendarConnected(userId);
  },
};
