import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { notificationRepository } from '../../modules/notification/repository/notification.repository';
import { digestRepository } from '../../modules/digest/repository/digest.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/notification/repository/notification.repository');
jest.mock('../../modules/digest/repository/digest.repository');
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedNotifRepo = notificationRepository as jest.Mocked<typeof notificationRepository>;
const mockedDigestRepo = digestRepository as jest.Mocked<typeof digestRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Notification & Digest', () => {
  const userId = 'user-notif';
  const email = 'notif@test.com';
  const token = generateTestToken(userId, email);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: View notifications', () => {
    it('should list user notifications', async () => {
      mockedNotifRepo.getForUser.mockResolvedValue([
        {
          id: 'notif-1', user_id: userId, type: 'poke',
          title: 'Alice poked you!', body: 'Keep your streak going!',
          data: {}, read_at: null, created_at: new Date(),
        },
        {
          id: 'notif-2', user_id: userId, type: 'badge_earned',
          title: 'New badge earned!', body: 'You earned the 7-Day Streak badge',
          data: { badge_id: 'badge-streak-7' }, read_at: null, created_at: new Date(),
        },
        {
          id: 'notif-3', user_id: userId, type: 'friend_request',
          title: 'New friend request', body: 'Bob wants to be your friend',
          data: {}, read_at: new Date(), created_at: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notifications).toHaveLength(3);
    });

    it('should return unread notification count', async () => {
      mockedNotifRepo.getUnreadCount.mockResolvedValue(2);

      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
    });
  });

  describe('Step 2: Mark notifications as read', () => {
    it('should mark a single notification as read', async () => {
      mockedNotifRepo.markRead.mockResolvedValue();

      const res = await request(app)
        .patch('/api/notifications/notif-1/read')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedNotifRepo.markRead).toHaveBeenCalledWith('notif-1', userId);
    });

    it('should mark all notifications as read', async () => {
      mockedNotifRepo.markAllRead.mockResolvedValue();

      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedNotifRepo.markAllRead).toHaveBeenCalledWith(userId);
    });

    it('should show zero unread after marking all read', async () => {
      mockedNotifRepo.getUnreadCount.mockResolvedValue(0);

      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(0);
    });
  });

  describe('Step 3: Notification pagination', () => {
    it('should paginate notifications with limit and offset', async () => {
      mockedNotifRepo.getForUser.mockResolvedValue([
        {
          id: 'notif-4', user_id: userId, type: 'roadmap_reminder',
          title: 'Time to study!', body: 'Day 5 of your roadmap is waiting',
          data: {}, read_at: null, created_at: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/notifications?limit=1&offset=3')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notifications).toHaveLength(1);
      expect(mockedNotifRepo.getForUser).toHaveBeenCalledWith(userId, 1, 3);
    });
  });

  describe('Step 4: Get VAPID key for push notifications', () => {
    it('should return the VAPID public key', async () => {
      const res = await request(app)
        .get('/api/notifications/push/vapid-key');

      expect(res.status).toBe(200);
      expect(res.body.publicKey).toBeDefined();
    });
  });

  describe('Step 5: Configure digest preferences', () => {
    it('should get default digest preferences', async () => {
      mockedDigestRepo.getDigestPreferences.mockResolvedValue({
        user_id: userId,
        email: email,
        display_name: 'Notif User',
        digest_enabled: true,
        digest_time: '08:00',
        digest_frequency: 'daily',
        evening_reminder: true,
        weekly_report: true,
      });

      const res = await request(app)
        .get('/api/digest/preferences')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.preferences.digest_enabled).toBe(true);
      expect(res.body.preferences.digest_frequency).toBe('daily');
    });

    it('should update digest preferences', async () => {
      mockedDigestRepo.updateDigestPreferences.mockResolvedValue();
      mockedDigestRepo.getDigestPreferences.mockResolvedValue({
        user_id: userId,
        email: email,
        display_name: 'Notif User',
        digest_enabled: true,
        digest_time: '09:30',
        digest_frequency: 'weekly',
        evening_reminder: false,
        weekly_report: true,
      });

      const res = await request(app)
        .put('/api/digest/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          digest_time: '09:30',
          digest_frequency: 'weekly',
          evening_reminder: false,
        });

      expect(res.status).toBe(200);
    });

    it('should disable digests entirely', async () => {
      mockedDigestRepo.updateDigestPreferences.mockResolvedValue();
      mockedDigestRepo.getDigestPreferences.mockResolvedValue({
        user_id: userId,
        email: email,
        display_name: 'Notif User',
        digest_enabled: false,
        digest_time: '08:00',
        digest_frequency: 'off',
        evening_reminder: false,
        weekly_report: false,
      });

      const res = await request(app)
        .put('/api/digest/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          digest_enabled: false,
          digest_frequency: 'off',
          evening_reminder: false,
          weekly_report: false,
        });

      expect(res.status).toBe(200);
    });
  });

  describe('Step 6: Preview digest content', () => {
    it('should preview morning digest', async () => {
      mockedDigestRepo.getUserStats.mockResolvedValue({
        current_streak: 7,
        longest_streak: 14,
        points: 350,
        total_solved: 25,
        week_solved: 5,
        friends_solved_yesterday: 3,
      });
      mockedDigestRepo.hasNoActivityToday.mockResolvedValue(true);
      mockedQuery.mockResolvedValue([]); // today's tasks

      const res = await request(app)
        .post('/api/digest/preview?type=morning')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.sent).toBeDefined();
    });

    it('should preview weekly report', async () => {
      mockedDigestRepo.getUserStats.mockResolvedValue({
        current_streak: 7,
        longest_streak: 14,
        points: 350,
        total_solved: 25,
        week_solved: 5,
        friends_solved_yesterday: 3,
      });
      mockedDigestRepo.getWeekStats.mockResolvedValue({
        solvedByDay: [
          { day: 'Mon', count: 3 },
          { day: 'Tue', count: 2 },
        ],
        difficultyBreakdown: [
          { difficulty: 'easy', count: 3 },
          { difficulty: 'medium', count: 2 },
        ],
      });

      const res = await request(app)
        .post('/api/digest/preview?type=weekly')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.sent).toBeDefined();
    });
  });
});
