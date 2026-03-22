import { digestService } from '../../../modules/digest/service/digest.service';
import { digestRepository } from '../../../modules/digest/repository/digest.repository';
import { sendEmail } from '../../../config/email';

jest.mock('../../../modules/digest/repository/digest.repository');
jest.mock('../../../config/email');

const mockedRepo = digestRepository as jest.Mocked<typeof digestRepository>;
const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

describe('digestService', () => {
  const mockUser = {
    user_id: 'user-1',
    email: 'test@example.com',
    display_name: 'Test User',
    digest_enabled: true,
    digest_time: '08:00',
    digest_frequency: 'daily',
    evening_reminder: true,
    weekly_report: true,
  };

  const mockStats = {
    current_streak: 5,
    longest_streak: 10,
    points: 200,
    total_solved: 50,
    week_solved: 7,
    friends_solved_yesterday: 3,
  };

  const mockWeekData = {
    solvedByDay: [
      { day: '2025-01-01', count: 2 },
      { day: '2025-01-02', count: 3 },
    ],
    difficultyBreakdown: [
      { difficulty: 'easy', count: 3 },
      { difficulty: 'medium', count: 2 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMorningDigest', () => {
    it('should send a morning digest email', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      const result = await digestService.sendMorningDigest('user-1');

      expect(result).toBe(true);
      expect(mockedSendEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.stringContaining('5-day streak'),
        expect.stringContaining('Good morning')
      );
      expect(mockedRepo.logDigest).toHaveBeenCalledWith('user-1', 'morning');
    });

    it('should return false when user not found', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(null);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);

      const result = await digestService.sendMorningDigest('user-1');

      expect(result).toBe(false);
      expect(mockedSendEmail).not.toHaveBeenCalled();
    });

    it('should return false when stats not found', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(null);

      const result = await digestService.sendMorningDigest('user-1');

      expect(result).toBe(false);
    });

    it('should return false when digest was already sent today', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.wasDigestSentToday.mockResolvedValue(true);

      const result = await digestService.sendMorningDigest('user-1');

      expect(result).toBe(false);
      expect(mockedSendEmail).not.toHaveBeenCalled();
    });

    it('should not log when email fails to send', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(false);

      const result = await digestService.sendMorningDigest('user-1');

      expect(result).toBe(false);
      expect(mockedRepo.logDigest).not.toHaveBeenCalled();
    });

    it('should include friends activity text when friends solved yesterday', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      await digestService.sendMorningDigest('user-1');

      const htmlArg = mockedSendEmail.mock.calls[0][2];
      expect(htmlArg).toContain('3 friends');
    });

    it('should show fallback text when no friends solved yesterday', async () => {
      const noFriendsStats = { ...mockStats, friends_solved_yesterday: 0 };
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(noFriendsStats);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      await digestService.sendMorningDigest('user-1');

      const htmlArg = mockedSendEmail.mock.calls[0][2];
      expect(htmlArg).toContain('Be the first');
    });
  });

  describe('sendEveningReminder', () => {
    it('should send an evening reminder when user has no activity today', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.hasNoActivityToday.mockResolvedValue(true);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      const result = await digestService.sendEveningReminder('user-1');

      expect(result).toBe(true);
      expect(mockedSendEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.stringContaining('streak'),
        expect.stringContaining('Evening check-in')
      );
      expect(mockedRepo.logDigest).toHaveBeenCalledWith('user-1', 'evening');
    });

    it('should return false when user had activity today', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.hasNoActivityToday.mockResolvedValue(false);

      const result = await digestService.sendEveningReminder('user-1');

      expect(result).toBe(false);
      expect(mockedSendEmail).not.toHaveBeenCalled();
    });

    it('should return false when user not found', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(null);
      mockedRepo.hasNoActivityToday.mockResolvedValue(true);

      const result = await digestService.sendEveningReminder('user-1');

      expect(result).toBe(false);
    });

    it('should return false when evening reminder already sent', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.hasNoActivityToday.mockResolvedValue(true);
      mockedRepo.wasDigestSentToday.mockResolvedValue(true);

      const result = await digestService.sendEveningReminder('user-1');

      expect(result).toBe(false);
    });

    it('should return false when stats not found', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.hasNoActivityToday.mockResolvedValue(true);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedRepo.getUserStats.mockResolvedValue(null);

      const result = await digestService.sendEveningReminder('user-1');

      expect(result).toBe(false);
    });

    it('should include streak warning when user has active streak', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.hasNoActivityToday.mockResolvedValue(true);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      await digestService.sendEveningReminder('user-1');

      const htmlArg = mockedSendEmail.mock.calls[0][2];
      expect(htmlArg).toContain('5-day streak');
      expect(htmlArg).toContain('will break');
    });
  });

  describe('sendWeeklyReport', () => {
    it('should send a weekly report email', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.getWeekStats.mockResolvedValue(mockWeekData);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      const result = await digestService.sendWeeklyReport('user-1');

      expect(result).toBe(true);
      expect(mockedSendEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.stringContaining('Weekly Report'),
        expect.stringContaining('Weekly Report')
      );
      expect(mockedRepo.logDigest).toHaveBeenCalledWith('user-1', 'weekly');
    });

    it('should return false when user not found', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(null);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.getWeekStats.mockResolvedValue(mockWeekData);

      const result = await digestService.sendWeeklyReport('user-1');

      expect(result).toBe(false);
    });

    it('should return false when already sent today', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.getWeekStats.mockResolvedValue(mockWeekData);
      mockedRepo.wasDigestSentToday.mockResolvedValue(true);

      const result = await digestService.sendWeeklyReport('user-1');

      expect(result).toBe(false);
    });

    it('should include difficulty breakdown in email', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.getWeekStats.mockResolvedValue(mockWeekData);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      await digestService.sendWeeklyReport('user-1');

      const htmlArg = mockedSendEmail.mock.calls[0][2];
      expect(htmlArg).toContain('Easy');
      expect(htmlArg).toContain('Medium');
    });
  });

  describe('runMorningDigests', () => {
    it('should send digests to all eligible users', async () => {
      mockedRepo.getDigestUsers.mockResolvedValue([
        { ...mockUser, user_id: 'user-1' },
        { ...mockUser, user_id: 'user-2' },
      ]);
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      const sent = await digestService.runMorningDigests();

      expect(mockedRepo.getDigestUsers).toHaveBeenCalledWith('morning');
      expect(sent).toBe(2);
    });

    it('should return 0 when no users to send to', async () => {
      mockedRepo.getDigestUsers.mockResolvedValue([]);

      const sent = await digestService.runMorningDigests();

      expect(sent).toBe(0);
    });

    it('should continue processing when one user fails', async () => {
      mockedRepo.getDigestUsers.mockResolvedValue([
        { ...mockUser, user_id: 'user-1' },
        { ...mockUser, user_id: 'user-2' },
      ]);
      // First call throws, second succeeds
      mockedRepo.getDigestPreferences
        .mockRejectedValueOnce(new Error('DB error'))
        .mockResolvedValueOnce(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      const sent = await digestService.runMorningDigests();

      expect(sent).toBe(1);
    });
  });

  describe('runEveningReminders', () => {
    it('should send reminders to all eligible users', async () => {
      mockedRepo.getDigestUsers.mockResolvedValue([mockUser]);
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.hasNoActivityToday.mockResolvedValue(true);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      const sent = await digestService.runEveningReminders();

      expect(mockedRepo.getDigestUsers).toHaveBeenCalledWith('evening');
      expect(sent).toBe(1);
    });
  });

  describe('runWeeklyReports', () => {
    it('should send weekly reports to all eligible users', async () => {
      mockedRepo.getDigestUsers.mockResolvedValue([mockUser]);
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);
      mockedRepo.getUserStats.mockResolvedValue(mockStats);
      mockedRepo.getWeekStats.mockResolvedValue(mockWeekData);
      mockedRepo.wasDigestSentToday.mockResolvedValue(false);
      mockedSendEmail.mockResolvedValue(true);
      mockedRepo.logDigest.mockResolvedValue();

      const sent = await digestService.runWeeklyReports();

      expect(mockedRepo.getDigestUsers).toHaveBeenCalledWith('weekly');
      expect(sent).toBe(1);
    });
  });

  describe('getPreferences', () => {
    it('should return user digest preferences', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(mockUser);

      const result = await digestService.getPreferences('user-1');

      expect(mockedRepo.getDigestPreferences).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      mockedRepo.getDigestPreferences.mockResolvedValue(null);

      const result = await digestService.getPreferences('bad-id');

      expect(result).toBeNull();
    });
  });

  describe('updatePreferences', () => {
    it('should update digest preferences', async () => {
      mockedRepo.updateDigestPreferences.mockResolvedValue();

      const result = await digestService.updatePreferences('user-1', {
        digest_enabled: false,
        evening_reminder: false,
      });

      expect(mockedRepo.updateDigestPreferences).toHaveBeenCalledWith('user-1', {
        digest_enabled: false,
        evening_reminder: false,
      });
      expect(result).toEqual({ success: true });
    });
  });
});
