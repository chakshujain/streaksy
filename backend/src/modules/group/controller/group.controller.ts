import { Request, Response } from 'express';
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

  async updatePlan(req: AuthRequest, res: Response) {
    const groupId = param(req, 'id');
    const group = await groupService.updatePlan(groupId, req.user!.userId, req.body);
    res.json({ group });
  },

  async assignSheet(req: AuthRequest, res: Response) {
    const groupId = param(req, 'id');
    const { sheetId } = req.body;
    await groupService.assignSheet(groupId, req.user!.userId, sheetId);
    res.json({ message: 'Sheet assigned' });
  },

  async removeSheet(req: AuthRequest, res: Response) {
    const groupId = param(req, 'id');
    const sheetId = param(req, 'sheetId');
    await groupService.removeSheet(groupId, req.user!.userId, sheetId);
    res.json({ message: 'Sheet removed' });
  },

  async getGroupSheets(req: AuthRequest, res: Response) {
    const groupId = param(req, 'id');
    const sheets = await groupService.getGroupSheets(groupId, req.user!.userId);
    res.json({ sheets });
  },

  async getMemberSheetProgress(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'id');
    const sheetId = param(req, 'sheetId');
    const progress = await groupService.getMemberSheetProgress(groupId, sheetId, user!.userId);
    res.json({ progress });
  },

  async leaveGroup(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'id');
    await groupService.leaveGroup(groupId, user!.userId);
    res.json({ message: 'Left the group' });
  },

  async deleteGroup(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'id');
    await groupService.deleteGroup(groupId, user!.userId);
    res.json({ message: 'Group deleted' });
  },

  async getGroupRoadmaps(req: Request, res: Response) {
    const groupId = param(req, 'id');
    const roadmaps = await groupService.getGroupRoadmaps(groupId);
    res.json({ roadmaps });
  },

  async inviteFriends(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'id');
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds must be a non-empty array' });
    }
    await groupService.inviteFriends(groupId, user!.userId, userIds);
    res.json({ message: 'Invitations sent' });
  },
};
