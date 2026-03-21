import { Request, Response } from 'express';
import { inviteService } from '../service/invite.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const inviteController = {
  async resolveGroup(req: Request, res: Response) {
    const code = param(req, 'code');
    const data = await inviteService.resolveGroup(code);
    res.json(data);
  },

  async resolveRoom(req: Request, res: Response) {
    const code = param(req, 'code');
    const data = await inviteService.resolveRoom(code);
    res.json(data);
  },

  async joinGroup(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const code = param(req, 'code');
    const result = await inviteService.joinGroup(code, user!.userId);
    res.json({ group: result });
  },

  async joinRoom(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const code = param(req, 'code');
    const result = await inviteService.joinRoom(code, user!.userId);
    res.json({ room: result });
  },
};
