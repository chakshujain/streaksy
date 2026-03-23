import { Request, Response } from 'express';
import { friendsService } from '../service/friends.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';
import { sendEmail } from '../../../config/email';
import { friendInviteEmail } from '../../auth/service/email.templates';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';

export const friendsController = {
  async getEnriched(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const friends = await friendsService.getFriendsEnriched(user!.userId);
    res.json({ friends });
  },

  async getFriendIds(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const friendIds = await friendsService.getFriendIds(user!.userId);
    res.json({ friendIds });
  },

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

  async inviteByEmail(req: AuthRequest, res: Response) {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw AppError.badRequest('Valid email address is required');
    }

    const inviterName = req.user!.userId;
    // Get the inviter's display name
    const { authRepository } = await import('../../auth/repository/auth.repository');
    const inviter = await authRepository.findById(inviterName);
    const displayName = inviter?.display_name || 'A friend';

    // Check if user already exists
    const existing = await authRepository.findByEmail(email.trim().toLowerCase());
    if (existing) {
      throw AppError.conflict('This user is already on Streaksy. Search for them by name instead!');
    }

    const signupUrl = `${env.frontendUrl}/auth/signup`;
    const tpl = friendInviteEmail(displayName, signupUrl);
    const sent = await sendEmail(email.trim().toLowerCase(), tpl.subject, tpl.html);

    if (!sent) {
      throw AppError.badRequest('Failed to send invite email. Please try again later.');
    }

    res.json({ message: 'Invite sent!' });
  },
};
