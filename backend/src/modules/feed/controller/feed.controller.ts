import { Request, Response } from 'express';
import { feedService } from '../service/feed.service';
import { AuthRequest } from '../../../common/types';
import { param, parseLimit, parseOffset } from '../../../common/utils/params';

export const feedController = {
  async getFeed(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const limit = parseLimit(req, 30);
    const offset = parseOffset(req);
    const events = await feedService.getFeed(user!.userId, limit, offset);
    res.json({ events });
  },

  async getUserFeed(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const userId = param(req, 'userId');
    const limit = parseLimit(req, 20);
    const offset = parseOffset(req);
    const events = await feedService.getUserFeed(userId, user!.userId, limit, offset);
    res.json({ events });
  },

  async toggleLike(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const eventId = param(req, 'id');
    const result = await feedService.toggleLike(eventId, user!.userId);
    res.json(result);
  },

  async addComment(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const eventId = param(req, 'id');
    const { content } = req.body;
    const comment = await feedService.addComment(eventId, user!.userId, content);
    res.status(201).json({ comment });
  },

  async getComments(req: Request, res: Response) {
    const eventId = param(req, 'id');
    const comments = await feedService.getComments(eventId);
    res.json({ comments });
  },

  async deleteComment(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const commentId = param(req, 'id');
    await feedService.deleteComment(commentId, user!.userId);
    res.json({ message: 'Deleted' });
  },

  async createPost(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { content } = req.body;
    const event = await feedService.postEvent(user!.userId, 'post', content, undefined, { type: 'user_post' });
    res.status(201).json({ event });
  },
};
