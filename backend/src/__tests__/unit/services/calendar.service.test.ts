import { calendarService } from '../../../modules/calendar/service/calendar.service';
import { calendarRepository } from '../../../modules/calendar/repository/calendar.repository';

jest.mock('../../../modules/calendar/repository/calendar.repository');
jest.mock('googleapis', () => {
  const mockInsert = jest.fn().mockResolvedValue({ data: { id: 'gcal-event-1' } });
  const mockDelete = jest.fn().mockResolvedValue({});
  return {
    google: {
      auth: {
        OAuth2: jest.fn().mockImplementation(() => ({
          generateAuthUrl: jest.fn().mockReturnValue('https://accounts.google.com/consent'),
          getToken: jest.fn().mockResolvedValue({ tokens: { refresh_token: 'refresh-123' } }),
          setCredentials: jest.fn(),
          getAccessToken: jest.fn().mockResolvedValue({ token: 'access-123' }),
          revokeToken: jest.fn().mockResolvedValue({}),
        })),
      },
      calendar: jest.fn().mockReturnValue({
        events: {
          insert: mockInsert,
          delete: mockDelete,
        },
      }),
    },
  };
});
jest.mock('../../../config/env', () => ({
  env: {
    google: {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      callbackUrl: 'http://localhost:3001/auth/google/callback',
    },
    frontendUrl: 'http://localhost:3000',
  },
}));

const mockedRepo = calendarRepository as jest.Mocked<typeof calendarRepository>;

describe('calendarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConsentUrl', () => {
    it('should return a Google OAuth consent URL', () => {
      const url = calendarService.getConsentUrl('user-1');

      expect(url).toBe('https://accounts.google.com/consent');
    });
  });

  describe('handleCallback', () => {
    it('should exchange code for tokens and store refresh token', async () => {
      mockedRepo.setGoogleRefreshToken.mockResolvedValue();

      await calendarService.handleCallback('auth-code-123', 'user-1');

      expect(mockedRepo.setGoogleRefreshToken).toHaveBeenCalledWith('user-1', 'refresh-123');
    });
  });

  describe('getCalendarClient', () => {
    it('should return null when user has no refresh token', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue(null);

      const client = await calendarService.getCalendarClient('user-1');

      expect(client).toBeNull();
    });

    it('should return a calendar client when user has a valid refresh token', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue('refresh-123');

      const client = await calendarService.getCalendarClient('user-1');

      expect(client).not.toBeNull();
    });
  });

  describe('createRoadmapEvents', () => {
    it('should return null when user has no calendar connected', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue(null);

      const result = await calendarService.createRoadmapEvents('user-1', {
        id: 'rm-1',
        name: 'My Roadmap',
        startDate: '2026-01-01',
        durationDays: 30,
      });

      expect(result).toBeNull();
    });

    it('should create a calendar event when connected', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue('refresh-123');
      mockedRepo.create.mockResolvedValue({
        id: 'evt-1',
        user_id: 'user-1',
        google_event_id: 'gcal-event-1',
        event_type: 'roadmap_study',
        reference_id: 'rm-1',
        created_at: new Date(),
      });

      const result = await calendarService.createRoadmapEvents('user-1', {
        id: 'rm-1',
        name: 'My Roadmap',
        startDate: '2026-01-01',
        durationDays: 30,
        hoursPerDay: 2,
      });

      expect(result).toBe('gcal-event-1');
      expect(mockedRepo.create).toHaveBeenCalledWith('user-1', 'gcal-event-1', 'roadmap_study', 'rm-1');
    });
  });

  describe('createRoomEvent', () => {
    it('should return null when user has no calendar connected', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue(null);

      const result = await calendarService.createRoomEvent('user-1', {
        id: 'room-1',
        name: 'DSA Battle',
        scheduledAt: '2026-01-15T10:00:00Z',
        timeLimitMinutes: 30,
      });

      expect(result).toBeNull();
    });

    it('should create a calendar event for a room', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue('refresh-123');
      mockedRepo.create.mockResolvedValue({
        id: 'evt-2',
        user_id: 'user-1',
        google_event_id: 'gcal-event-1',
        event_type: 'war_room',
        reference_id: 'room-1',
        created_at: new Date(),
      });

      const result = await calendarService.createRoomEvent('user-1', {
        id: 'room-1',
        name: 'DSA Battle',
        scheduledAt: '2026-01-15T10:00:00Z',
        timeLimitMinutes: 30,
      });

      expect(result).toBe('gcal-event-1');
    });
  });

  describe('deleteEventsForReference', () => {
    it('should delete calendar events for a reference', async () => {
      mockedRepo.findByReference.mockResolvedValue([
        { id: 'evt-1', user_id: 'user-1', google_event_id: 'gcal-1', event_type: 'roadmap_study', reference_id: 'rm-1', created_at: new Date() },
      ]);
      mockedRepo.getGoogleRefreshToken.mockResolvedValue('refresh-123');
      mockedRepo.deleteByReference.mockResolvedValue();

      await calendarService.deleteEventsForReference('user-1', 'rm-1');

      expect(mockedRepo.deleteByReference).toHaveBeenCalledWith('user-1', 'rm-1');
    });

    it('should still delete local records when no calendar client', async () => {
      mockedRepo.findByReference.mockResolvedValue([]);
      mockedRepo.getGoogleRefreshToken.mockResolvedValue(null);
      mockedRepo.deleteByReference.mockResolvedValue();

      await calendarService.deleteEventsForReference('user-1', 'rm-1');

      expect(mockedRepo.deleteByReference).toHaveBeenCalledWith('user-1', 'rm-1');
    });
  });

  describe('disconnect', () => {
    it('should disconnect calendar and clean up', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue('refresh-123');
      mockedRepo.deleteByUser.mockResolvedValue();
      mockedRepo.disconnectCalendar.mockResolvedValue();

      await calendarService.disconnect('user-1');

      expect(mockedRepo.deleteByUser).toHaveBeenCalledWith('user-1');
      expect(mockedRepo.disconnectCalendar).toHaveBeenCalledWith('user-1');
    });

    it('should disconnect even when no refresh token exists', async () => {
      mockedRepo.getGoogleRefreshToken.mockResolvedValue(null);
      mockedRepo.deleteByUser.mockResolvedValue();
      mockedRepo.disconnectCalendar.mockResolvedValue();

      await calendarService.disconnect('user-1');

      expect(mockedRepo.deleteByUser).toHaveBeenCalledWith('user-1');
      expect(mockedRepo.disconnectCalendar).toHaveBeenCalledWith('user-1');
    });
  });

  describe('isConnected', () => {
    it('should return true when calendar is connected', async () => {
      mockedRepo.isCalendarConnected.mockResolvedValue(true);

      const result = await calendarService.isConnected('user-1');

      expect(result).toBe(true);
    });

    it('should return false when calendar is not connected', async () => {
      mockedRepo.isCalendarConnected.mockResolvedValue(false);

      const result = await calendarService.isConnected('user-1');

      expect(result).toBe(false);
    });
  });

  describe('createRoomEventForParticipants', () => {
    it('should create events for connected participants only', async () => {
      mockedRepo.isCalendarConnected.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      mockedRepo.getGoogleRefreshToken.mockResolvedValue('refresh-123');
      mockedRepo.create.mockResolvedValue({
        id: 'evt-1',
        user_id: 'user-1',
        google_event_id: 'gcal-event-1',
        event_type: 'war_room',
        reference_id: 'room-1',
        created_at: new Date(),
      });

      await calendarService.createRoomEventForParticipants(
        { id: 'room-1', name: 'Room', scheduledAt: '2026-01-15T10:00:00Z', timeLimitMinutes: 30 },
        ['user-1', 'user-2']
      );

      // Only user-1 is connected, so only 1 getGoogleRefreshToken call for the actual event creation
      expect(mockedRepo.isCalendarConnected).toHaveBeenCalledTimes(2);
    });
  });
});
