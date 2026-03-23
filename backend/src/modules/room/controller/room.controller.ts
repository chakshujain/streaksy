import { Request, Response } from 'express';
import { roomService } from '../service/room.service';
import { roomRepository } from '../repository/room.repository';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const roomController = {
  async create(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { name, problemId, timeLimitMinutes, problemIds, sheetId, scheduledAt, mode, recurrence, meetLink } = req.body;
    const room = await roomService.createRoom(user!.userId, name, problemId || null, timeLimitMinutes || 30, {
      problemIds,
      sheetId,
      scheduledAt,
      mode,
      recurrence,
      meetLink,
    });
    res.status(201).json({ room });
  },

  async join(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { code } = req.body;
    const room = await roomService.joinRoom(code, user!.userId);
    res.json({ room });
  },

  async get(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roomId = param(req, 'id');
    const room = await roomService.getRoom(roomId, user!.userId);
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

  async upcoming(req: Request, res: Response) {
    const rooms = await roomService.getUpcoming();
    res.json({ rooms });
  },

  async leaderboard(req: Request, res: Response) {
    const leaderboard = await roomService.getLeaderboard();
    res.json({ leaderboard });
  },

  async suggestProblems(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const mode = req.query.mode as string;
    const sheetId = req.query.sheetId as string;
    const count = parseInt(req.query.count as string) || 4;
    const problems = await roomService.suggestProblems(user!.userId, mode, count, sheetId);
    res.json({ problems });
  },

  async getProblems(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roomId = param(req, 'id');
    const participants = await roomRepository.getParticipants(roomId);
    const isParticipant = participants.some(p => p.user_id === user!.userId);
    if (!isParticipant) {
      res.status(403).json({ error: 'You are not a participant of this room' });
      return;
    }
    const problems = await roomRepository.getRoomProblems(roomId);
    res.json({ problems });
  },

  async inviteFriends(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roomId = param(req, 'id');
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds must be a non-empty array' });
    }
    await roomService.inviteFriends(roomId, user!.userId, userIds);
    res.json({ message: 'Invitations sent' });
  },
};
