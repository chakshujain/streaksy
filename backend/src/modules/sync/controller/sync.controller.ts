import { Request, Response } from 'express';
import { syncService } from '../service/sync.service';

export const syncController = {
  async syncLeetcode(req: Request, res: Response) {
    const { userId, problemSlug, status, ...extra } = req.body;
    const result = await syncService.syncLeetcode(userId, problemSlug, status, extra);
    res.json(result);
  },
};
