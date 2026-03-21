import { Request, Response } from 'express';
import { pokeService } from '../service/poke.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';
import { groupRepository } from '../../group/repository/group.repository';

export const pokeController = {
  async pokeFriend(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { toUserId, groupId, message } = req.body;
    const poke = await pokeService.pokeFriend(user!.userId, toUserId, groupId, message);
    res.status(201).json({ poke });
  },

  async getMyPokes(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const pokes = await pokeService.getMyPokes(user!.userId, limit, offset);
    res.json({ pokes });
  },

  async getInactiveMembers(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const groupId = param(req, 'groupId');
    const isMember = await groupRepository.isMember(groupId, user!.userId);
    if (!isMember) {
      res.status(403).json({ error: 'Not a member of this group' });
      return;
    }
    const days = parseInt(req.query.days as string) || 2;
    const members = await pokeService.getInactiveMembers(groupId, days);
    res.json({ members });
  },

  async checkStreakRisk(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const risk = await pokeService.checkStreakRisk(user!.userId);
    res.json({ risk });
  },

  async getActiveChallenge(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const challenge = await pokeService.getActiveChallenge(user!.userId);
    res.json({ challenge });
  },
};
