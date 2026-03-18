import { Response } from 'express';
import { leaderboardService } from '../service/leaderboard.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const leaderboardController = {
  async getGroupLeaderboard(req: AuthRequest, res: Response) {
    const leaderboard = await leaderboardService.getGroupLeaderboard(
      param(req, 'groupId'),
      req.user!.userId
    );
    res.json({ leaderboard });
  },
};
