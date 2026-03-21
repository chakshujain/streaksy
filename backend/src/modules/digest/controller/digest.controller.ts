import { Request, Response } from 'express';
import { AuthRequest } from '../../../common/types';
import { digestService } from '../service/digest.service';

export const digestController = {
  async getPreferences(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const prefs = await digestService.getPreferences(user!.userId);
    res.json({ preferences: prefs });
  },

  async updatePreferences(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    await digestService.updatePreferences(user!.userId, req.body);
    res.json({ success: true });
  },

  async triggerMorning(req: Request, res: Response) {
    const sent = await digestService.runMorningDigests();
    res.json({ sent });
  },

  async triggerEvening(req: Request, res: Response) {
    const sent = await digestService.runEveningReminders();
    res.json({ sent });
  },

  async triggerWeekly(req: Request, res: Response) {
    const sent = await digestService.runWeeklyReports();
    res.json({ sent });
  },

  async preview(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { type } = req.query;
    let sent = false;
    if (type === 'morning') sent = await digestService.sendMorningDigest(user!.userId);
    else if (type === 'evening') sent = await digestService.sendEveningReminder(user!.userId);
    else if (type === 'weekly') sent = await digestService.sendWeeklyReport(user!.userId);
    res.json({ sent });
  },
};
