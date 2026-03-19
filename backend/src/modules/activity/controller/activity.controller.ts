import { Request, Response } from 'express';
import { activityService } from '../service/activity.service';
import { param } from '../../../common/utils/params';

export const activityController = {
  async getGroupActivity(req: Request, res: Response) {
    const groupId = param(req, 'id');
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = parseInt(req.query.offset as string) || 0;
    const activity = await activityService.getForGroup(groupId, limit, offset);
    res.json({ activity });
  },
};
