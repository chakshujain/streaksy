import { Response } from 'express';
import { progressService } from '../service/progress.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const progressController = {
  async getUserProgress(req: AuthRequest, res: Response) {
    const progress = await progressService.getUserProgress(req.user!.userId);
    res.json({ progress });
  },

  async getSheetProgress(req: AuthRequest, res: Response) {
    const progress = await progressService.getUserProgressForSheet(
      req.user!.userId,
      param(req, 'sheetSlug')
    );
    res.json({ progress });
  },

  async updateStatus(req: AuthRequest, res: Response) {
    const { problemId, status } = req.body;
    const result = await progressService.updateStatus(req.user!.userId, problemId, status);
    res.json({ progress: result });
  },
};
