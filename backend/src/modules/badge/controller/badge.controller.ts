import { Request, Response } from 'express';
import { badgeService } from '../service/badge.service';
import { AuthRequest } from '../../../common/types';

export const badgeController = {
  async list(_req: Request, res: Response) {
    const badges = await badgeService.getAll();
    res.json({ badges });
  },

  async getUserBadges(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const badges = await badgeService.getUserBadges(user!.userId);
    res.json({ badges });
  },
};
