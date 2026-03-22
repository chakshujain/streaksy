import { ratingService } from '../../../modules/rating/service/rating.service';
import { ratingRepository } from '../../../modules/rating/repository/rating.repository';
import { redis } from '../../../config/redis';

jest.mock('../../../modules/rating/repository/rating.repository');
jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));
jest.mock('../../../config/redis', () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    expire: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
    scanIterator: jest.fn().mockReturnValue((async function* () {})()),
  },
  connectRedis: jest.fn(),
}));

const mockedRepo = ratingRepository as jest.Mocked<typeof ratingRepository>;
const mockedRedis = redis as jest.Mocked<typeof redis>;

describe('ratingService', () => {
  const mockRating = {
    user_id: 'user-1',
    problem_id: 'prob-1',
    difficulty_rating: 4,
    created_at: '2024-06-01',
    updated_at: '2024-06-01',
  };

  const mockStats = {
    problem_id: 'prob-1',
    avg_rating: 3.5,
    rating_count: 10,
  };

  const mockDistribution = [
    { rating: 1, count: 1 },
    { rating: 3, count: 4 },
    { rating: 5, count: 5 },
  ];

  const mockCompanyTag = {
    id: 'ct-1',
    name: 'Google',
  };

  const mockProblemCompany = {
    problem_id: 'prob-1',
    company_tag_id: 'ct-1',
    company_name: 'Google',
    report_count: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rate', () => {
    it('should upsert a rating and invalidate cache', async () => {
      mockedRepo.upsert.mockResolvedValue(mockRating);

      const result = await ratingService.rate('user-1', 'prob-1', 4);

      expect(mockedRepo.upsert).toHaveBeenCalledWith('user-1', 'prob-1', 4);
      expect(result).toEqual(mockRating);
    });

    it('should not throw even if cache invalidation fails', async () => {
      mockedRepo.upsert.mockResolvedValue(mockRating);
      // scanIterator may throw; rate should still succeed
      (mockedRedis.scanIterator as jest.Mock).mockReturnValue((async function* () {
        throw new Error('Redis down');
      })());

      const result = await ratingService.rate('user-1', 'prob-1', 4);

      expect(result).toEqual(mockRating);
    });
  });

  describe('getUserRating', () => {
    it('should return rating for a user/problem pair', async () => {
      mockedRepo.getUserRating.mockResolvedValue(mockRating);

      const result = await ratingService.getUserRating('user-1', 'prob-1');

      expect(mockedRepo.getUserRating).toHaveBeenCalledWith('user-1', 'prob-1');
      expect(result).toEqual(mockRating);
    });

    it('should return null when no rating exists', async () => {
      mockedRepo.getUserRating.mockResolvedValue(null);

      const result = await ratingService.getUserRating('user-1', 'prob-1');

      expect(result).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return stats from cache when available', async () => {
      const cachedData = { stats: mockStats, distribution: mockDistribution };
      (mockedRedis.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedData));

      const result = await ratingService.getStats('prob-1');

      expect(result).toEqual(cachedData);
      expect(mockedRepo.getStats).not.toHaveBeenCalled();
    });

    it('should fetch from repo and cache when cache miss', async () => {
      (mockedRedis.get as jest.Mock).mockResolvedValue(null);
      mockedRepo.getStats.mockResolvedValue(mockStats);
      mockedRepo.getRatingDistribution.mockResolvedValue(mockDistribution);

      const result = await ratingService.getStats('prob-1');

      expect(mockedRepo.getStats).toHaveBeenCalledWith('prob-1');
      expect(mockedRepo.getRatingDistribution).toHaveBeenCalledWith('prob-1');
      expect(result).toEqual({ stats: mockStats, distribution: mockDistribution });
      expect(mockedRedis.set).toHaveBeenCalled();
    });
  });

  describe('getStatsMultiple', () => {
    it('should return stats for multiple problems', async () => {
      mockedRepo.getStatsMultiple.mockResolvedValue([mockStats]);

      const result = await ratingService.getStatsMultiple(['prob-1']);

      expect(mockedRepo.getStatsMultiple).toHaveBeenCalledWith(['prob-1']);
      expect(result).toEqual([mockStats]);
    });
  });

  describe('listCompanyTags', () => {
    it('should return cached company tags', async () => {
      (mockedRedis.get as jest.Mock).mockResolvedValue(JSON.stringify([mockCompanyTag]));

      const result = await ratingService.listCompanyTags();

      expect(result).toEqual([mockCompanyTag]);
      expect(mockedRepo.listCompanyTags).not.toHaveBeenCalled();
    });

    it('should fetch from repo on cache miss', async () => {
      (mockedRedis.get as jest.Mock).mockResolvedValue(null);
      mockedRepo.listCompanyTags.mockResolvedValue([mockCompanyTag]);

      const result = await ratingService.listCompanyTags();

      expect(mockedRepo.listCompanyTags).toHaveBeenCalled();
      expect(result).toEqual([mockCompanyTag]);
    });
  });

  describe('getCompanyTags', () => {
    it('should return cached company tags for a problem', async () => {
      (mockedRedis.get as jest.Mock).mockResolvedValue(JSON.stringify([mockProblemCompany]));

      const result = await ratingService.getCompanyTags('prob-1');

      expect(result).toEqual([mockProblemCompany]);
    });

    it('should fetch from repo on cache miss', async () => {
      (mockedRedis.get as jest.Mock).mockResolvedValue(null);
      mockedRepo.getCompanyTagsForProblem.mockResolvedValue([mockProblemCompany]);

      const result = await ratingService.getCompanyTags('prob-1');

      expect(mockedRepo.getCompanyTagsForProblem).toHaveBeenCalledWith('prob-1');
      expect(result).toEqual([mockProblemCompany]);
    });
  });

  describe('reportCompanyTag', () => {
    it('should report a company tag and invalidate cache', async () => {
      mockedRepo.reportCompanyTag.mockResolvedValue();

      await ratingService.reportCompanyTag('prob-1', 'ct-1', 'user-1');

      expect(mockedRepo.reportCompanyTag).toHaveBeenCalledWith('prob-1', 'ct-1', 'user-1');
    });

    it('should not throw if cache invalidation fails', async () => {
      mockedRepo.reportCompanyTag.mockResolvedValue();
      (mockedRedis.scanIterator as jest.Mock).mockReturnValue((async function* () {
        throw new Error('Redis down');
      })());

      await expect(
        ratingService.reportCompanyTag('prob-1', 'ct-1', 'user-1')
      ).resolves.not.toThrow();
    });
  });
});
