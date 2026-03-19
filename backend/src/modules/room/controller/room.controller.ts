import { Request, Response } from 'express';
import { roomService } from '../service/room.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const roomController = {
  async create(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { name, problemId, timeLimitMinutes } = req.body;
    const room = await roomService.createRoom(user!.userId, name, problemId, timeLimitMinutes || 30);
    res.status(201).json({ room });
  },

  async join(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { code } = req.body;
    const room = await roomService.joinRoom(code, user!.userId);
    res.json({ room });
  },

  async get(req: Request, res: Response) {
    const roomId = param(req, 'id');
    const room = await roomService.getRoom(roomId);
    res.json({ room });
  },

  async start(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roomId = param(req, 'id');
    const room = await roomService.startRoom(roomId, user!.userId);
    res.json({ room });
  },

  async end(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roomId = param(req, 'id');
    const room = await roomService.endRoom(roomId, user!.userId);
    res.json({ room });
  },

  async solve(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roomId = param(req, 'id');
    const participants = await roomService.markSolved(roomId, user!.userId, req.body);
    res.json({ participants });
  },

  async myRooms(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const rooms = await roomService.getUserRooms(user!.userId);
    res.json({ rooms });
  },

  async activeRooms(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const rooms = await roomService.getActiveRooms(user!.userId);
    res.json({ rooms });
  },
};
