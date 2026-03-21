import { Response } from 'express';
import { streakService } from '../service/streak.service';
import { streaksEngine } from '../service/streaks-engine';
import { AuthRequest } from '../../../common/types';

export const streakController = {
  async getStreak(req: AuthRequest, res: Response) {
    const streak = await streakService.getStreak(req.user!.userId);
    res.json({ streak });
  },

  async getMultiplierPreview(req: AuthRequest, res: Response) {
    const groupId = (req.query.groupId as string) || null;
    const preview = await streaksEngine.getMultiplierPreview(req.user!.userId, groupId);
    res.json({ preview });
  },
};
