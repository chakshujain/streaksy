import { Request, Response } from 'express';
import { submissionRepository } from '../repository/submission.repository';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';
import { groupRepository } from '../../group/repository/group.repository';

export const submissionController = {
  async getMySubmissions(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const submissions = await submissionRepository.getForUser(user!.userId, limit, offset);
    res.json({ submissions });
  },

  async getForProblem(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const problemId = param(req, 'problemId');
    const submissions = await submissionRepository.getForProblem(user!.userId, problemId);
    res.json({ submissions });
  },

  async getStats(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const stats = await submissionRepository.getStats(user!.userId);
    res.json({ stats });
  },

  async getPeerSolutions(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const problemId = param(req, 'problemId');
    // Only return solutions from users who share at least one group with the requester
    const userGroups = await groupRepository.getUserGroups(user!.userId);
    const groupIds = userGroups.map(g => g.id);
    const solutions = await submissionRepository.getPeerSolutions(problemId, user!.userId, 10, groupIds);
    res.json({ solutions });
  },
};
