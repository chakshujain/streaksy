import request from 'supertest';
import app from '../../app';
import { preferencesRepository } from '../../modules/preferences/repository/preferences.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/preferences/repository/preferences.repository');
const mockedRepo = preferencesRepository as jest.Mocked<typeof preferencesRepository>;

describe('Preferences Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const defaultPrefs = {
    user_id: 'user-1',
    theme: 'default',
    accent_color: '#10b981',
    dashboard_layout: 'default',
    show_streak_animation: true,
    show_heatmap: true,
    weekly_goal: 7,
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/preferences', () => {
    it('should return user preferences', async () => {
      mockedRepo.get.mockResolvedValue(defaultPrefs);

      const res = await request(app)
        .get('/api/preferences')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.preferences.theme).toBe('default');
      expect(res.body.preferences.accentColor).toBe('#10b981');
      expect(res.body.preferences.weeklyGoal).toBe(7);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/preferences');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/preferences', () => {
    it('should update preferences', async () => {
      const updated = { ...defaultPrefs, theme: 'dark', weekly_goal: 14 };
      mockedRepo.upsert.mockResolvedValue(updated);

      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ theme: 'dark', weekly_goal: 14 });

      expect(res.status).toBe(200);
      expect(res.body.preferences.theme).toBe('dark');
      expect(res.body.preferences.weeklyGoal).toBe(14);
    });

    it('should return 400 for invalid hex color', async () => {
      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ accent_color: 'not-hex' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for weekly_goal out of range', async () => {
      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ weekly_goal: 0 });

      expect(res.status).toBe(400);
    });

    it('should accept empty body (all optional fields)', async () => {
      mockedRepo.upsert.mockResolvedValue(defaultPrefs);

      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(200);
    });
  });
});
