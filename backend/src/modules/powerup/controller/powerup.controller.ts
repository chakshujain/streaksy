import { Request, Response } from 'express';
import { AuthRequest } from '../../../common/types';
import { powerupService } from '../service/powerup.service';

export const powerupController = {
  async getInventory(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const inventory = await powerupService.getInventory(user!.userId);
    res.json(inventory);
  },

  async getLog(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const log = await powerupService.getLog(user!.userId);
    res.json({ log });
  },

  async purchase(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { type } = req.body;
    const result = await powerupService.purchasePowerup(user!.userId, type);
    res.status(201).json(result);
  },

  async useFreeze(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const result = await powerupService.useStreakFreeze(user!.userId);
    res.json(result);
  },

  async getCosts(req: Request, res: Response) {
    res.json({ costs: powerupService.getPowerupCosts() });
  },
};
