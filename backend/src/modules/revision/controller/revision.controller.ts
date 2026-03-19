import { Request, Response } from 'express';
import { revisionService } from '../service/revision.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const revisionController = {
  async list(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { tag, difficulty, limit, offset } = req.query;
    const notes = await revisionService.getRevisionCards(user!.userId, {
      tag: tag as string,
      difficulty: difficulty as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json({ notes });
  },

  async quiz(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const count = parseInt(req.query.count as string) || 10;
    const cards = await revisionService.getRevisionQuiz(user!.userId, count);
    res.json({ cards });
  },

  async getByProblem(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const problemId = param(req, 'problemId');
    const note = await revisionService.getByProblem(user!.userId, problemId);
    res.json({ note });
  },

  async createOrUpdate(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { problemId, keyTakeaway, approach, timeComplexity, spaceComplexity, tags, difficultyRating } = req.body;
    const note = await revisionService.createOrUpdate(user!.userId, problemId, {
      keyTakeaway, approach, timeComplexity, spaceComplexity, tags, difficultyRating,
    });
    res.status(201).json({ note });
  },

  async markRevised(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    await revisionService.markRevised(id, user!.userId);
    res.json({ message: 'Marked as revised' });
  },

  async delete(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    await revisionService.delete(id, user!.userId);
    res.json({ message: 'Deleted' });
  },
};
