import { Request, Response } from 'express';
import { prepService } from '../service/prep.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const prepController = {
  async create(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { answers, days, totalDays, groupId } = req.body;
    const roadmap = await prepService.create(user!.userId, answers, days, totalDays, groupId);
    res.status(201).json({ roadmap });
  },

  async getActive(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roadmap = await prepService.getActive(user!.userId);
    res.json({ roadmap });
  },

  async getById(req: Request, res: Response) {
    const id = param(req, 'id');
    const roadmap = await prepService.getById(id);
    res.json({ roadmap });
  },

  async getByShareCode(req: Request, res: Response) {
    const code = param(req, 'code');
    const roadmap = await prepService.getByShareCode(code);
    res.json({ roadmap });
  },

  async updateProgress(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const { day, completed } = req.body;
    const progress = await prepService.updateProgress(id, user!.userId, day, completed);
    res.json({ progress });
  },

  async getProgress(req: Request, res: Response) {
    const id = param(req, 'id');
    const progress = await prepService.getProgress(id);
    res.json({ progress });
  },

  async linkGroup(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const { groupId } = req.body;
    await prepService.linkGroup(id, user!.userId, groupId);
    res.json({ message: 'Group linked' });
  },

  async getLeaderboard(req: Request, res: Response) {
    const id = param(req, 'id');
    const leaderboard = await prepService.getLeaderboard(id);
    res.json({ leaderboard });
  },
};
