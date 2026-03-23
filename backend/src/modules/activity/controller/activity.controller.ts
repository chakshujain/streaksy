import { Request, Response } from 'express';
import { activityService } from '../service/activity.service';
import { param, parseLimit, parseOffset } from '../../../common/utils/params';
import { AuthRequest } from '../../../common/types';
import { groupRepository } from '../../group/repository/group.repository';
import { AppError } from '../../../common/errors/AppError';

export const activityController = {
  async getGroupActivity(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'id');
    const isMember = await groupRepository.isMember(groupId, user!.userId);
    if (!isMember) throw AppError.forbidden('Not a member of this group');
    const limit = parseLimit(req, 30);
    const offset = parseOffset(req);
    const activity = await activityService.getForGroup(groupId, limit, offset);
    res.json({ activity });
  },
};
