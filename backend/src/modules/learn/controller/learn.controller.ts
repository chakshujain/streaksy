import { Response } from 'express';
import { learnService } from '../service/learn.service';
import { AuthRequest } from '../../../common/types';

export const learnController = {
  async askAI(req: AuthRequest, res: Response) {
    const { topic, lesson, question } = req.body;
    const answer = await learnService.askAI(req.user!.userId, topic, lesson, question);
    res.json({ answer });
  },
};
