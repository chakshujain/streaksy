import { Request, Response } from 'express';
import { AuthRequest } from '../../../common/types';
import { ratingService } from '../service/rating.service';
import { param } from '../../../common/utils/params';

export const ratingController = {
  async rate(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { problemId, rating } = req.body;
    const result = await ratingService.rate(user!.userId, problemId, rating);
    res.status(201).json({ rating: result });
  },

  async getUserRating(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const problemId = param(req, 'problemId');
    const rating = await ratingService.getUserRating(user!.userId, problemId);
    res.json({ rating });
  },

  async getStats(req: Request, res: Response) {
    const problemId = param(req, 'problemId');
    const data = await ratingService.getStats(problemId);
    res.json(data);
  },

  async listCompanyTags(req: Request, res: Response) {
    const tags = await ratingService.listCompanyTags();
    res.json({ tags });
  },

  async getCompanyTags(req: Request, res: Response) {
    const problemId = param(req, 'problemId');
    const tags = await ratingService.getCompanyTags(problemId);
    res.json({ tags });
  },

  async reportCompanyTag(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const problemId = param(req, 'problemId');
    const { companyTagId } = req.body;
    await ratingService.reportCompanyTag(problemId, companyTagId, user!.userId);
    res.status(201).json({ success: true });
  },
};
