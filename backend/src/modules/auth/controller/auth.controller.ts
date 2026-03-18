import { Request, Response } from 'express';
import { authService } from '../service/auth.service';
import { AuthRequest } from '../../../common/types';

export const authController = {
  async signup(req: Request, res: Response) {
    const { email, password, displayName } = req.body;
    const result = await authService.signup(email, password, displayName);
    res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  },

  async connectLeetcode(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { leetcodeUsername } = req.body;
    await authService.connectLeetcode(user!.userId, leetcodeUsername);
    res.json({ message: 'LeetCode account connected' });
  },
};
