import { Response } from 'express';
import { preferencesService } from '../service/preferences.service';
import { AuthRequest } from '../../../common/types';

export const preferencesController = {
  async get(req: AuthRequest, res: Response) {
    const preferences = await preferencesService.get(req.user!.userId);
    res.json({ preferences });
  },

  async update(req: AuthRequest, res: Response) {
    const preferences = await preferencesService.update(req.user!.userId, req.body);
    res.json({ preferences });
  },
};
