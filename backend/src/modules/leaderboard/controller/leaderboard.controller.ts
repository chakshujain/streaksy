import { Response } from 'express';
import { leaderboardService } from '../service/leaderboard.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';
import { roadmapsService } from '../../roadmaps/service/roadmaps.service';

export const leaderboardController = {
  async getGroupLeaderboard(req: AuthRequest, res: Response) {
    const leaderboard = await leaderboardService.getGroupLeaderboard(
      param(req, 'groupId'),
      req.user!.userId
    );
    res.json({ leaderboard });
  },

  async getGlobalLeaderboard(_req: AuthRequest, res: Response) {
    const leaderboard = await roadmapsService.getGlobalLeaderboard();
    res.json({ leaderboard });
  },
};
