import { Response } from 'express';
import { streakService } from '../service/streak.service';
import { AuthRequest } from '../../../common/types';

export const streakController = {
  async getStreak(req: AuthRequest, res: Response) {
    const streak = await streakService.getStreak(req.user!.userId);
    res.json({ streak });
  },
};
