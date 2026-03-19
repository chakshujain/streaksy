import { Request, Response } from 'express';
import { problemService } from '../service/problem.service';
import { param } from '../../../common/utils/params';

export const problemController = {
  async list(req: Request, res: Response) {
    const { difficulty, limit, offset } = req.query;
    const [problems, total] = await Promise.all([
      problemService.list(
        difficulty as string | undefined,
        limit ? Number(limit) : 50,
        offset ? Number(offset) : 0
      ),
      problemService.count(difficulty as string | undefined),
    ]);
    res.json({ problems, total });
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

  async search(req: Request, res: Response) {
    const q = req.query.q as string;
    if (!q || q.trim().length === 0) {
      res.json({ problems: [] });
      return;
    }
    const limit = parseInt(req.query.limit as string) || 20;
    const problems = await problemService.search(q, limit);
    res.json({ problems });
  },
};
