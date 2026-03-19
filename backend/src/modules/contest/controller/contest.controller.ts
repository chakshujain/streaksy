import { Request, Response } from 'express';
import { contestService } from '../service/contest.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const contestController = {
  async create(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'id');
    const contest = await contestService.create(groupId, user!.userId, req.body);
    res.status(201).json({ contest });
  },

  async getForGroup(req: Request, res: Response) {
    const groupId = param(req, 'id');
    const contests = await contestService.getForGroup(groupId);
    res.json({ contests });
  },

  async getDetails(req: Request, res: Response) {
    const contestId = param(req, 'id');
    const contest = await contestService.getDetails(contestId);
    res.json({ contest });
  },

  async submit(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const contestId = param(req, 'id');
    const { problemId } = req.body;
    const submission = await contestService.submit(contestId, user!.userId, problemId);
    res.status(201).json({ submission });
  },
};
