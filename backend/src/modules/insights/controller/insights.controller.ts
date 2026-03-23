import { Response } from 'express';
import { insightsService } from '../service/insights.service';
import { AuthRequest } from '../../../common/types';

export const insightsController = {
  async getOverview(req: AuthRequest, res: Response) {
    const data = await insightsService.getOverview(req.user!.userId);
    res.json(data);
  },

  async getWeekly(req: AuthRequest, res: Response) {
    const weeks = await insightsService.getWeekly(req.user!.userId);
    res.json({ weeks });
  },

  async getTags(req: AuthRequest, res: Response) {
    const tags = await insightsService.getTagStats(req.user!.userId);
    res.json({ tags });
  },

  async getDifficultyTrend(req: AuthRequest, res: Response) {
    const trend = await insightsService.getDifficultyTrend(req.user!.userId);
    res.json({ trend });
  },

  async getAICoach(req: AuthRequest, res: Response) {
    const tip = await insightsService.getAICoachTip(req.user!.userId);
    res.json({ tip });
  },
};
