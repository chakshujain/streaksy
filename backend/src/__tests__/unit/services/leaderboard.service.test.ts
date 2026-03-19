import { leaderboardService } from '../../../modules/leaderboard/service/leaderboard.service';

describe('leaderboardService', () => {
  describe('calculateScore', () => {
    it('should compute score as solvedCount * 10 + streak * 5', () => {
      expect(leaderboardService.calculateScore(10, 3)).toBe(115);
    });

    it('should return 0 for zero counts', () => {
      expect(leaderboardService.calculateScore(0, 0)).toBe(0);
    });

    it('should handle streak-only score', () => {
      expect(leaderboardService.calculateScore(0, 5)).toBe(25);
    });

    it('should handle solved-only score', () => {
      expect(leaderboardService.calculateScore(20, 0)).toBe(200);
    });

    it('should handle large numbers', () => {
      expect(leaderboardService.calculateScore(500, 365)).toBe(6825);
    });
  });
});
