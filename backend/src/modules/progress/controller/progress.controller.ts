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
};
