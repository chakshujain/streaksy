import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';

// Mock the calendar service (dynamically imported in auth routes)
jest.mock('../../modules/calendar/service/calendar.service', () => ({
  calendarService: {
    getConsentUrl: jest.fn().mockReturnValue('https://accounts.google.com/o/oauth2/auth?scope=calendar&state=placeholder'),
    handleCallback: jest.fn().mockResolvedValue(undefined),
    isConnected: jest.fn().mockResolvedValue(false),
    disconnect: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('Calendar Routes (Auth module)', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/auth/calendar/status', () => {
    it('should return calendar connection status', async () => {
      const { calendarService } = require('../../modules/calendar/service/calendar.service');
      calendarService.isConnected.mockResolvedValue(false);

      const res = await request(app)
        .get('/api/auth/calendar/status')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.connected).toBe(false);
    });

    it('should return connected=true when calendar is linked', async () => {
      const { calendarService } = require('../../modules/calendar/service/calendar.service');
      calendarService.isConnected.mockResolvedValue(true);

      const res = await request(app)
        .get('/api/auth/calendar/status')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.connected).toBe(true);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/calendar/status');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/calendar/disconnect', () => {
    it('should disconnect Google Calendar', async () => {
      const { calendarService } = require('../../modules/calendar/service/calendar.service');
      calendarService.disconnect.mockResolvedValue(undefined);

      const res = await request(app)
        .post('/api/auth/calendar/disconnect')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Google Calendar disconnected');
      expect(calendarService.disconnect).toHaveBeenCalledWith('user-1');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/auth/calendar/disconnect');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/google/calendar', () => {
    it('should return OAuth consent URL', async () => {
      const res = await request(app)
        .get('/api/auth/google/calendar')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.url).toBeDefined();
      expect(res.body.url).toContain('accounts.google.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/google/calendar');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/google/calendar/callback', () => {
    it('should redirect to settings on missing state', async () => {
      const res = await request(app)
        .get('/api/auth/google/calendar/callback');

      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('calendar=error');
    });

    it('should redirect to settings on invalid state', async () => {
      const res = await request(app)
        .get('/api/auth/google/calendar/callback?state=invalid-jwt&code=test-code');

      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('calendar=error');
    });
  });
});
