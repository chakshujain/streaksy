import { Request, Response } from 'express';
import { discussionService } from '../service/discussion.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const discussionController = {
  async getComments(req: Request, res: Response) {
    const slug = param(req, 'slug');
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const comments = await discussionService.getComments(slug, limit, offset);
    res.json({ comments });
  },

  async createComment(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const slug = param(req, 'slug');
    const { content, parentId } = req.body;
    const comment = await discussionService.createComment(slug, user!.userId, content, parentId);
    res.status(201).json({ comment });
  },

  async getReplies(req: Request, res: Response) {
    const id = param(req, 'id');
    const replies = await discussionService.getReplies(id);
    res.json({ replies });
  },

  async updateComment(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const { content } = req.body;
    await discussionService.updateComment(id, user!.userId, content);
    res.json({ message: 'Comment updated' });
  },

  async deleteComment(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    await discussionService.deleteComment(id, user!.userId);
    res.json({ message: 'Comment deleted' });
  },
};
