import { Request, Response } from 'express';
import { syncService } from '../service/sync.service';
import { AuthRequest } from '../../../common/types';

export const syncController = {
  async syncLeetcode(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { problemSlug, status, ...extra } = req.body;
    const result = await syncService.syncLeetcode(user!.userId, problemSlug, status, extra);
    res.json(result);
  },
};
