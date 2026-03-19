import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authService } from '../service/auth.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

// Multer setup for avatar uploads
const uploadsDir = path.join(__dirname, '..', '..', '..', '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

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

  // Password reset
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  },

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ message: 'Password reset successfully' });
  },

  // Email verification
  async verifyEmail(req: Request, res: Response) {
    const { token } = req.body;
    await authService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  },

  async resendVerification(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    await authService.resendVerification(user!.userId);
    res.json({ message: 'Verification email sent' });
  },

  // Profile
  async changePassword(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(user!.userId, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  },

  async getProfile(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const profile = await authService.getProfile(user!.userId);
    res.json({ profile });
  },

  async updateProfile(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const profile = await authService.updateProfile(user!.userId, req.body);
    res.json({ profile });
  },

  async getPublicProfile(req: Request, res: Response) {
    const userId = param(req, 'userId');
    const profile = await authService.getPublicProfile(userId);
    res.json({ profile });
  },

  async exportData(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const userId = user!.userId;

    const [profile, progress, submissions, revisions, streakData] = await Promise.all([
      authService.getProfile(userId),
      import('../../progress/repository/progress.repository').then(m => m.progressRepository.getUserProgress(userId)),
      import('../../sync/repository/submission.repository').then(m => m.submissionRepository.getForUser(userId, 1000)),
      import('../../revision/repository/revision.repository').then(m => m.revisionRepository.getForUser(userId, { limit: 1000 })),
      import('../../streak/service/streak.service').then(m => m.streakService.getStreak(userId)),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile,
      streak: streakData,
      progress,
      submissions,
      revisions,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=streaksy-export.json');
    res.json(exportData);
  },

  async uploadAvatar(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const avatarUrl = await authService.uploadAvatar(user!.userId, req.file.filename);
    res.json({ avatarUrl });
  },
};
