import { Request, Response } from 'express';
import { activityService } from '../service/activity.service';
import { param } from '../../../common/utils/params';
import { AuthRequest } from '../../../common/types';
import { groupRepository } from '../../group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';

export const activityController = {
  async getGroupActivity(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'id');
    const isMember = await groupRepository.isMember(groupId, user!.userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');
    const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const activity = await activityService.getForGroup(groupId, limit, offset);
    res.json({ activity });
  },
};
