import { Request, Response } from 'express';
import { dailyService } from '../service/daily.service';
import { AuthRequest } from '../../../common/types';

export const dailyController = {
  async getDailyProblems(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const count = parseInt(req.query.count as string) || 4;
    const problems = await dailyService.getDailyProblems(user!.userId, count);
    res.json({ problems, date: new Date().toISOString().split('T')[0] });
  },
};
