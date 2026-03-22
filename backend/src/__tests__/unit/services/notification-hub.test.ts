import { notificationHub } from '../../../modules/notification/service/notification-hub';
import { notificationRepository } from '../../../modules/notification/repository/notification.repository';
import { pushService } from '../../../modules/notification/service/push.service';
import { sendEmail } from '../../../config/email';

jest.mock('../../../modules/notification/repository/notification.repository');
jest.mock('../../../modules/notification/service/push.service', () => ({
  pushService: {
    sendPush: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../../config/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../config/env', () => ({
  env: {
    frontendUrl: 'http://localhost:3000',
    vapid: { subject: '', publicKey: '', privateKey: '' },
  },
}));
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));
jest.mock('../../../config/socket', () => ({
  pushNotification: jest.fn(),
}));

const mockedNotifRepo = notificationRepository as jest.Mocked<typeof notificationRepository>;
const mockedPushService = pushService as jest.Mocked<typeof pushService>;
const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
const { queryOne: mockedQueryOne } = require('../../../config/database');

describe('notificationHub', () => {
  const mockNotification = {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'poke',
    title: 'You got poked!',
    body: 'Someone poked you',
    data: {},
    read_at: null,
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: no notification preferences row (uses defaults)
    mockedQueryOne.mockResolvedValue(null);
  });

  describe('send', () => {
    it('should create an in-app notification', async () => {
      mockedNotifRepo.create.mockResolvedValue(mockNotification);

      await notificationHub.send('user-1', 'poke', 'You got poked!', 'Someone poked you');

      expect(mockedNotifRepo.create).toHaveBeenCalledWith(
        'user-1', 'poke', 'You got poked!', 'Someone poked you', undefined
      );
    });

    it('should not send notification when category is disabled', async () => {
      mockedQueryOne.mockResolvedValue({
        in_app_enabled: true,
        email_enabled: true,
        push_enabled: true,
        social_enabled: false, // poke is a social notification
        roadmap_enabled: true,
        room_enabled: true,
        achievement_enabled: true,
        smart_enabled: true,
        quiet_start: '22:00',
        quiet_end: '07:00',
      });

      await notificationHub.send('user-1', 'poke', 'You got poked!');

      expect(mockedNotifRepo.create).not.toHaveBeenCalled();
    });

    it('should not create in-app notification when in_app_enabled is false', async () => {
      mockedQueryOne.mockResolvedValue({
        in_app_enabled: false,
        email_enabled: false,
        push_enabled: false,
        social_enabled: true,
        roadmap_enabled: true,
        room_enabled: true,
        achievement_enabled: true,
        smart_enabled: true,
        quiet_start: '22:00',
        quiet_end: '07:00',
      });

      await notificationHub.send('user-1', 'poke', 'Title');

      expect(mockedNotifRepo.create).not.toHaveBeenCalled();
    });

    it('should pass data to notification', async () => {
      mockedNotifRepo.create.mockResolvedValue(mockNotification);

      await notificationHub.send('user-1', 'room_join', 'Someone joined!', 'body', { roomId: 'room-1' });

      expect(mockedNotifRepo.create).toHaveBeenCalledWith(
        'user-1', 'room_join', 'Someone joined!', 'body', { roomId: 'room-1' }
      );
    });
  });

  describe('sendToMany', () => {
    it('should send to all provided user IDs', async () => {
      mockedNotifRepo.create.mockResolvedValue(mockNotification);

      await notificationHub.sendToMany(['user-1', 'user-2', 'user-3'], 'room_start', 'Room started!');

      // Should be called for each user
      expect(mockedNotifRepo.create).toHaveBeenCalledTimes(3);
    });

    it('should exclude specified user', async () => {
      mockedNotifRepo.create.mockResolvedValue(mockNotification);

      await notificationHub.sendToMany(
        ['user-1', 'user-2', 'user-3'],
        'room_start',
        'Room started!',
        undefined,
        undefined,
        { excludeUserId: 'user-1' }
      );

      expect(mockedNotifRepo.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('shouldSendEmail', () => {
    it('should return true for email-worthy notification types', () => {
      expect(notificationHub.shouldSendEmail('poke')).toBe(true);
      expect(notificationHub.shouldSendEmail('friend_request')).toBe(true);
      expect(notificationHub.shouldSendEmail('room_start')).toBe(true);
      expect(notificationHub.shouldSendEmail('badge_earned')).toBe(true);
      expect(notificationHub.shouldSendEmail('streak_milestone')).toBe(true);
      expect(notificationHub.shouldSendEmail('lagging_behind')).toBe(true);
      expect(notificationHub.shouldSendEmail('roadmap_complete')).toBe(true);
    });

    it('should return false for non-email notification types', () => {
      expect(notificationHub.shouldSendEmail('room_join')).toBe(false);
      expect(notificationHub.shouldSendEmail('room_end')).toBe(false);
      expect(notificationHub.shouldSendEmail('room_solve')).toBe(false);
      expect(notificationHub.shouldSendEmail('feed_like')).toBe(false);
      expect(notificationHub.shouldSendEmail('feed_comment')).toBe(false);
    });
  });

  describe('getPreferences', () => {
    it('should return default preferences when none are set', async () => {
      mockedQueryOne.mockResolvedValue(null);

      const prefs = await notificationHub.getPreferences('user-1');

      expect(prefs.in_app_enabled).toBe(true);
      expect(prefs.email_enabled).toBe(true);
      expect(prefs.push_enabled).toBe(true);
    });

    it('should return stored preferences', async () => {
      const storedPrefs = {
        in_app_enabled: true,
        email_enabled: false,
        push_enabled: false,
        social_enabled: true,
        roadmap_enabled: true,
        room_enabled: true,
        achievement_enabled: true,
        smart_enabled: true,
        quiet_start: '23:00',
        quiet_end: '08:00',
      };
      mockedQueryOne.mockResolvedValue(storedPrefs);

      const prefs = await notificationHub.getPreferences('user-1');

      expect(prefs.email_enabled).toBe(false);
      expect(prefs.push_enabled).toBe(false);
    });
  });

  describe('updatePreferences', () => {
    it('should update notification preferences', async () => {
      const { query: mockedQuery } = require('../../../config/database');
      mockedQuery.mockResolvedValue([]);

      await notificationHub.updatePreferences('user-1', { email_enabled: false });

      expect(mockedQuery).toHaveBeenCalled();
    });

    it('should do nothing when no valid fields provided', async () => {
      const { query: mockedQuery } = require('../../../config/database');

      await notificationHub.updatePreferences('user-1', {} as any);

      expect(mockedQuery).not.toHaveBeenCalled();
    });
  });
});
