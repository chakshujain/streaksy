import { Response } from 'express';
import { groupService } from '../service/group.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const groupController = {
  async create(req: AuthRequest, res: Response) {
    const { name, description } = req.body;
    const group = await groupService.create(name, description, req.user!.userId);
    res.status(201).json({ group });
  },

  async join(req: AuthRequest, res: Response) {
    const { inviteCode } = req.body;
    const group = await groupService.join(inviteCode, req.user!.userId);
    res.json({ group });
  },

  async getDetails(req: AuthRequest, res: Response) {
    const group = await groupService.getDetails(param(req, 'id'), req.user!.userId);
    res.json({ group });
  },

  async getUserGroups(req: AuthRequest, res: Response) {
    const groups = await groupService.getUserGroups(req.user!.userId);
    res.json({ groups });
  },
};
