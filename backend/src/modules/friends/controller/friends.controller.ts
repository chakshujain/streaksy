import { Response } from 'express';
import { friendsService } from '../service/friends.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const friendsController = {
  async list(req: AuthRequest, res: Response) {
    const friends = await friendsService.getFriends(req.user!.userId);
    res.json({ friends });
  },

  async requests(req: AuthRequest, res: Response) {
    const requests = await friendsService.getPendingRequests(req.user!.userId);
    res.json(requests);
  },

  async search(req: AuthRequest, res: Response) {
    const q = (req.query.q as string) || '';
    const users = await friendsService.searchUsers(q, req.user!.userId);
    res.json({ users });
  },

  async sendRequest(req: AuthRequest, res: Response) {
    const { userId } = req.body;
    const friendship = await friendsService.sendRequest(req.user!.userId, userId);
    res.status(201).json({ friendship });
  },

  async accept(req: AuthRequest, res: Response) {
    const id = param(req, 'id');
    const friendship = await friendsService.acceptRequest(id, req.user!.userId);
    res.json({ friendship });
  },

  async remove(req: AuthRequest, res: Response) {
    const id = param(req, 'id');
    // id is a friendship_id — works for both pending (reject/cancel) and accepted (remove)
    await friendsService.removeByFriendshipId(id, req.user!.userId);
    res.json({ message: 'Removed' });
  },
};
