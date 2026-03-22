import { pokeService } from '../../../modules/poke/service/poke.service';
import { pokeRepository } from '../../../modules/poke/repository/poke.repository';
import { groupRepository } from '../../../modules/group/repository/group.repository';
import { authRepository } from '../../../modules/auth/repository/auth.repository';
import { notificationHub } from '../../../modules/notification/service/notification-hub';
import { AppError } from '../../../common/errors/AppError';

jest.mock('../../../modules/poke/repository/poke.repository');
jest.mock('../../../modules/poke/service/humor', () => ({
  humorEngine: {
    friendPoke: jest.fn().mockReturnValue('Hey, get back to solving!'),
    streakRisk: jest.fn().mockReturnValue('Your streak is about to break!'),
    recovery: jest.fn().mockReturnValue('Solve 3 problems to recover your streak!'),
  },
}));
jest.mock('../../../modules/notification/service/notification-hub', () => ({
  notificationHub: {
    send: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../../modules/group/repository/group.repository');
jest.mock('../../../modules/auth/repository/auth.repository');
jest.mock('../../../config/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../config/env', () => ({
  env: { frontendUrl: 'http://localhost:3000' },
}));

const mockedPokeRepo = pokeRepository as jest.Mocked<typeof pokeRepository>;
const mockedGroupRepo = groupRepository as jest.Mocked<typeof groupRepository>;
const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>;

describe('pokeService', () => {
  const mockPoke = {
    id: 'poke-1',
    from_user_id: 'user-1',
    to_user_id: 'user-2',
    group_id: null,
    message: 'Hey, get back to solving!',
    poke_type: 'manual',
    escalation_level: 3,
    created_at: new Date(),
  };

  const mockUser = {
    id: 'user-2',
    display_name: 'User Two',
    email: 'u2@test.com',
    avatar_url: null,
    bio: null,
    password_hash: '',
    provider: 'local',
    provider_id: null,
    created_at: new Date(),
    updated_at: new Date(),
    email_verified: true,
    verification_token: null,
    reset_token: null,
    reset_token_expires: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pokeFriend', () => {
    it('should poke a friend successfully', async () => {
      mockedPokeRepo.recentPokeBetween.mockResolvedValue(false);
      mockedPokeRepo.pokessentToday.mockResolvedValue(0);
      mockedAuthRepo.findById.mockResolvedValue({ ...mockUser, id: 'user-1', display_name: 'User One' } as any);
      mockedAuthRepo.findById.mockResolvedValueOnce({ ...mockUser, id: 'user-1', display_name: 'User One' } as any);
      mockedAuthRepo.findById.mockResolvedValueOnce(mockUser as any);
      mockedPokeRepo.getEscalationLevel.mockResolvedValue(2);
      mockedPokeRepo.create.mockResolvedValue(mockPoke);

      const result = await pokeService.pokeFriend('user-1', 'user-2');

      expect(mockedPokeRepo.create).toHaveBeenCalled();
      expect(result).toEqual(mockPoke);
    });

    it('should throw badRequest when poking yourself', async () => {
      await expect(pokeService.pokeFriend('user-1', 'user-1')).rejects.toThrow(
        "You can't poke yourself!"
      );
      await expect(pokeService.pokeFriend('user-1', 'user-1')).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it('should verify group membership when groupId is provided', async () => {
      mockedGroupRepo.isMember.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
      mockedPokeRepo.recentPokeBetween.mockResolvedValue(false);
      mockedPokeRepo.pokessentToday.mockResolvedValue(0);
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedPokeRepo.getEscalationLevel.mockResolvedValue(0);
      mockedPokeRepo.create.mockResolvedValue(mockPoke);

      await pokeService.pokeFriend('user-1', 'user-2', 'group-1');

      expect(mockedGroupRepo.isMember).toHaveBeenCalledWith('group-1', 'user-1');
      expect(mockedGroupRepo.isMember).toHaveBeenCalledWith('group-1', 'user-2');
    });

    it('should throw forbidden when sender is not a group member', async () => {
      mockedGroupRepo.isMember.mockResolvedValueOnce(false);

      await expect(pokeService.pokeFriend('user-1', 'user-2', 'group-1')).rejects.toThrow(
        'You are not a member of this group'
      );
    });

    it('should throw forbidden when target is not a group member', async () => {
      mockedGroupRepo.isMember.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      await expect(pokeService.pokeFriend('user-1', 'user-2', 'group-1')).rejects.toThrow(
        'Target user is not a member of this group'
      );
    });

    it('should throw badRequest when recently poked', async () => {
      mockedPokeRepo.recentPokeBetween.mockResolvedValue(true);

      await expect(pokeService.pokeFriend('user-1', 'user-2')).rejects.toThrow(
        'You already poked them recently'
      );
    });

    it('should throw badRequest when daily limit reached', async () => {
      mockedPokeRepo.recentPokeBetween.mockResolvedValue(false);
      mockedPokeRepo.pokessentToday.mockResolvedValue(10);

      await expect(pokeService.pokeFriend('user-1', 'user-2')).rejects.toThrow(
        "You've reached the daily poke limit"
      );
    });

    it('should throw notFound when target user not found', async () => {
      mockedPokeRepo.recentPokeBetween.mockResolvedValue(false);
      mockedPokeRepo.pokessentToday.mockResolvedValue(0);
      mockedAuthRepo.findById.mockResolvedValueOnce({ ...mockUser, id: 'user-1' } as any);
      mockedAuthRepo.findById.mockResolvedValueOnce(null);

      await expect(pokeService.pokeFriend('user-1', 'user-2')).rejects.toThrow(
        'User not found'
      );
      await expect(pokeService.pokeFriend('user-1', 'user-2')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('getMyPokes', () => {
    it('should return received pokes', async () => {
      mockedPokeRepo.getReceivedPokes.mockResolvedValue([mockPoke]);

      const result = await pokeService.getMyPokes('user-2');

      expect(mockedPokeRepo.getReceivedPokes).toHaveBeenCalledWith('user-2', undefined, undefined);
      expect(result).toEqual([mockPoke]);
    });
  });

  describe('getInactiveMembers', () => {
    it('should return inactive group members', async () => {
      const inactive = [{ user_id: 'user-3', display_name: 'Slacker', days_inactive: 5, last_solve_date: null, current_streak: 0 }];
      mockedPokeRepo.getInactiveGroupMembers.mockResolvedValue(inactive);

      const result = await pokeService.getInactiveMembers('group-1', 3);

      expect(mockedPokeRepo.getInactiveGroupMembers).toHaveBeenCalledWith('group-1', 3);
      expect(result).toEqual(inactive);
    });
  });

  describe('checkStreakRisk', () => {
    it('should return streak risk info when user is at risk', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedPokeRepo.getStreakAtRiskUsers.mockResolvedValue([
        { user_id: 'user-2', email: 'u2@test.com', display_name: 'User Two', current_streak: 7 },
      ]);

      const result = await pokeService.checkStreakRisk('user-2');

      expect(result).not.toBeNull();
      expect(result!.atRisk).toBe(true);
      expect(result!.currentStreak).toBe(7);
    });

    it('should return null when user not found', async () => {
      mockedAuthRepo.findById.mockResolvedValue(null);

      const result = await pokeService.checkStreakRisk('user-999');

      expect(result).toBeNull();
    });

    it('should return null when user is not at risk', async () => {
      mockedAuthRepo.findById.mockResolvedValue(mockUser as any);
      mockedPokeRepo.getStreakAtRiskUsers.mockResolvedValue([]);

      const result = await pokeService.checkStreakRisk('user-2');

      expect(result).toBeNull();
    });
  });

  describe('createRecoveryChallenge', () => {
    it('should create a recovery challenge', async () => {
      const challenge = {
        id: 'ch-1',
        user_id: 'user-1',
        challenge_type: 'streak_recovery',
        target_count: 3,
        completed_count: 0,
        status: 'active',
        expires_at: new Date(),
        created_at: new Date(),
      };
      mockedPokeRepo.getActiveChallenge.mockResolvedValue(null);
      mockedPokeRepo.createChallenge.mockResolvedValue(challenge);

      const result = await pokeService.createRecoveryChallenge('user-1');

      expect(mockedPokeRepo.createChallenge).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });

    it('should return existing challenge if one is active', async () => {
      const existing = {
        id: 'ch-1',
        user_id: 'user-1',
        challenge_type: 'streak_recovery',
        target_count: 3,
        completed_count: 1,
        status: 'active',
        expires_at: new Date(),
        created_at: new Date(),
      };
      mockedPokeRepo.getActiveChallenge.mockResolvedValue(existing);

      const result = await pokeService.createRecoveryChallenge('user-1');

      expect(mockedPokeRepo.createChallenge).not.toHaveBeenCalled();
      expect(result).toEqual(existing);
    });
  });

  describe('progressRecoveryChallenge', () => {
    it('should increment a recovery challenge', async () => {
      const challenge = {
        id: 'ch-1',
        user_id: 'user-1',
        challenge_type: 'streak_recovery',
        target_count: 3,
        completed_count: 1,
        status: 'active',
        expires_at: new Date(),
        created_at: new Date(),
      };
      const updated = { ...challenge, completed_count: 2 };
      mockedPokeRepo.getActiveChallenge.mockResolvedValue(challenge);
      mockedPokeRepo.incrementChallenge.mockResolvedValue(updated);

      const result = await pokeService.progressRecoveryChallenge('user-1');

      expect(mockedPokeRepo.incrementChallenge).toHaveBeenCalledWith('ch-1');
      expect(result).toEqual(updated);
    });

    it('should return null when no active challenge exists', async () => {
      mockedPokeRepo.getActiveChallenge.mockResolvedValue(null);

      const result = await pokeService.progressRecoveryChallenge('user-1');

      expect(result).toBeNull();
    });
  });

  describe('getActiveChallenge', () => {
    it('should return active challenge for a user', async () => {
      const challenge = {
        id: 'ch-1',
        user_id: 'user-1',
        challenge_type: 'streak_recovery',
        target_count: 3,
        completed_count: 0,
        status: 'active',
        expires_at: new Date(),
        created_at: new Date(),
      };
      mockedPokeRepo.getActiveChallenge.mockResolvedValue(challenge);

      const result = await pokeService.getActiveChallenge('user-1');

      expect(result).toEqual(challenge);
    });
  });
});
