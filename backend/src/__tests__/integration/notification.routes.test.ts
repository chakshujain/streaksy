import request from 'supertest';
import app from '../../app';
import { notificationRepository } from '../../modules/notification/repository/notification.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/notification/repository/notification.repository');
jest.mock('../../modules/notification/service/push.service', () => ({
  pushService: {
    subscribe: jest.fn().mockResolvedValue(undefined),
    unsubscribe: jest.fn().mockResolvedValue(undefined),
    getPublicKey: jest.fn().mockReturnValue('test-vapid-public-key'),
    sendToUser: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
    sendToMany: jest.fn().mockResolvedValue(undefined),
    getPreferences: jest.fn().mockResolvedValue({
      in_app_enabled: true,
      email_enabled: false,
      push_enabled: true,
      social: true,
      roadmap: true,
      room: true,
      achievement: true,
      smart: true,
    }),
    updatePreferences: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedRepo = notificationRepository as jest.Mocked<typeof notificationRepository>;

describe('Notification Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockNotification = {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'friend_request',
    title: 'New friend request',
    body: 'John sent you a friend request',
    data: {},
    read_at: null,
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/notifications/push/vapid-key', () => {
    it('should return VAPID public key without auth', async () => {
      const res = await request(app)
        .get('/api/notifications/push/vapid-key');

      expect(res.status).toBe(200);
      expect(res.body.publicKey).toBe('test-vapid-public-key');
    });
  });

  describe('GET /api/notifications', () => {
    it('should return notifications', async () => {
      mockedRepo.getForUser.mockResolvedValue([mockNotification]);

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notifications).toHaveLength(1);
      expect(res.body.notifications[0].title).toBe('New friend request');
    });

    it('should support pagination', async () => {
      mockedRepo.getForUser.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/notifications?limit=5&offset=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRepo.getForUser).toHaveBeenCalledWith('user-1', 5, 10);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/notifications');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/notifications/unread-count', () => {
    it('should return unread count', async () => {
      mockedRepo.getUnreadCount.mockResolvedValue(5);

      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(5);
    });

    it('should return zero when all read', async () => {
      mockedRepo.getUnreadCount.mockResolvedValue(0);

      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/notifications/unread-count');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      mockedRepo.markRead.mockResolvedValue();

      const res = await request(app)
        .patch('/api/notifications/notif-1/read')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Marked as read');
      expect(mockedRepo.markRead).toHaveBeenCalledWith('notif-1', 'user-1');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).patch('/api/notifications/notif-1/read');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      mockedRepo.markAllRead.mockResolvedValue();

      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('All marked as read');
      expect(mockedRepo.markAllRead).toHaveBeenCalledWith('user-1');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).patch('/api/notifications/read-all');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/notifications/push/subscribe', () => {
    it('should save push subscription', async () => {
      const res = await request(app)
        .post('/api/notifications/push/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send({
          subscription: {
            endpoint: 'https://push.example.com/abc',
            keys: {
              p256dh: 'test-p256dh-key',
              auth: 'test-auth-key',
            },
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Push subscription saved');
    });

    it('should return 400 for invalid subscription', async () => {
      const res = await request(app)
        .post('/api/notifications/push/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send({ subscription: { endpoint: 'https://test.com' } });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing subscription', async () => {
      const res = await request(app)
        .post('/api/notifications/push/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/notifications/push/subscribe')
        .send({ subscription: { endpoint: 'test', keys: { p256dh: 'a', auth: 'b' } } });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/notifications/push/unsubscribe', () => {
    it('should remove push subscription', async () => {
      const res = await request(app)
        .post('/api/notifications/push/unsubscribe')
        .set('Authorization', `Bearer ${token}`)
        .send({ endpoint: 'https://push.example.com/abc' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Push subscription removed');
    });

    it('should return 400 for missing endpoint', async () => {
      const res = await request(app)
        .post('/api/notifications/push/unsubscribe')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/notifications/push/unsubscribe')
        .send({ endpoint: 'test' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/notifications/preferences', () => {
    it('should return notification preferences', async () => {
      const res = await request(app)
        .get('/api/notifications/preferences')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.preferences).toBeDefined();
      expect(res.body.preferences.in_app_enabled).toBe(true);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/notifications/preferences');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/notifications/preferences', () => {
    it('should update notification preferences', async () => {
      const res = await request(app)
        .put('/api/notifications/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ push_enabled: false, social: false });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Preferences updated');
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .put('/api/notifications/preferences')
        .send({ push_enabled: false });

      expect(res.status).toBe(401);
    });
  });
});
