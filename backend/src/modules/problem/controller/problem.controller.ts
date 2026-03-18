import { Request, Response } from 'express';
import { problemService } from '../service/problem.service';
import { param } from '../../../common/utils/params';

export const problemController = {
  async list(req: Request, res: Response) {
    const { difficulty, limit, offset } = req.query;
    const problems = await problemService.list(
      difficulty as string | undefined,
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );
    res.json({ problems });
  },

  async getBySlug(req: Request, res: Response) {
    const problem = await problemService.getBySlug(param(req, 'slug'));
    res.json({ problem });
  },

  async getSheets(_req: Request, res: Response) {
    const sheets = await problemService.getSheets();
    res.json({ sheets });
  },

  async getSheetProblems(req: Request, res: Response) {
    const problems = await problemService.getSheetProblems(param(req, 'slug'));
    res.json({ problems });
  },
};
