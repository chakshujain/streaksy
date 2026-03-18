import { Response } from 'express';
import { notesService } from '../service/notes.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const notesController = {
  async create(req: AuthRequest, res: Response) {
    const { problemId, content, visibility, groupId } = req.body;
    const note = await notesService.create(req.user!.userId, problemId, content, visibility, groupId);
    res.status(201).json({ note });
  },

  async update(req: AuthRequest, res: Response) {
    const note = await notesService.update(param(req, 'id'), req.user!.userId, req.body.content);
    res.json({ note });
  },

  async delete(req: AuthRequest, res: Response) {
    await notesService.delete(param(req, 'id'), req.user!.userId);
    res.json({ message: 'Note deleted' });
  },

  async getPersonalNotes(req: AuthRequest, res: Response) {
    const notes = await notesService.getPersonalNotes(req.user!.userId, param(req, 'problemId'));
    res.json({ notes });
  },

  async getGroupNotes(req: AuthRequest, res: Response) {
    const notes = await notesService.getGroupNotes(
      param(req, 'groupId'),
      param(req, 'problemId'),
      req.user!.userId
    );
    res.json({ notes });
  },
};
