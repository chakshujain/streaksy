import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';
import { authRepository } from '../repository/auth.repository';
import { sendEmail } from '../../../config/email';
import { welcomeEmail, passwordResetEmail, verificationEmail } from './email.templates';

export const authService = {
  async signup(email: string, password: string, displayName: string) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw AppError.conflict('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await authRepository.create(email, passwordHash, displayName);

    // Send welcome email (non-blocking)
    const welcome = welcomeEmail(displayName);
    sendEmail(email, welcome.subject, welcome.html).catch(() => {});

    // Generate email verification token
    this.sendVerificationEmail(user.id, email, displayName).catch(() => {});

    // Auto-join "Streaksy Global" group so new users see feed content
    import('../../group/repository/group.repository').then(m => {
      m.groupRepository.joinByInviteCode?.('STREAKSY', user.id).catch(() => {});
    }).catch(() => {});

    return {
      user: { id: user.id, email: user.email, displayName: user.display_name, emailVerified: false },
      token: this.generateToken(user.id, user.email),
    };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw AppError.unauthorized('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw AppError.unauthorized('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        emailVerified: user.email_verified ?? false,
        avatarUrl: user.avatar_url,
      },
      token: this.generateToken(user.id, user.email),
    };
  },

  async connectLeetcode(userId: string, leetcodeUsername: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    await authRepository.connectLeetcode(userId, leetcodeUsername);
  },

  // Password reset
  async forgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authRepository.createPasswordResetToken(user.id, tokenHash, expiresAt);

    const resetUrl = `${env.frontendUrl}/auth/reset-password?token=${token}`;
    const tpl = passwordResetEmail(user.display_name, resetUrl);
    sendEmail(email, tpl.subject, tpl.html).catch(() => {});
  },

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await authRepository.findValidResetToken(tokenHash);
    if (!resetToken) throw AppError.badRequest('Invalid or expired reset token');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await authRepository.updatePassword(resetToken.user_id, passwordHash);
    await authRepository.markResetTokenUsed(resetToken.id);
  },

  // Email verification
  async sendVerificationEmail(userId: string, email: string, displayName: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await authRepository.setVerificationToken(userId, token, expires);

    const verifyUrl = `${env.frontendUrl}/auth/verify-email?token=${token}`;
    const tpl = verificationEmail(displayName, verifyUrl);
    sendEmail(email, tpl.subject, tpl.html).catch(() => {});
  },

  async verifyEmail(token: string) {
    const user = await authRepository.findByVerificationToken(token);
    if (!user) throw AppError.badRequest('Invalid or expired verification token');
    await authRepository.markEmailVerified(user.id);
  },

  async resendVerification(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    if (user.email_verified) throw AppError.badRequest('Email already verified');
    await this.sendVerificationEmail(userId, user.email, user.display_name);
  },

  // Profile
  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      leetcodeUsername: user.leetcode_username,
      emailVerified: user.email_verified ?? false,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      location: user.location,
      githubUrl: user.github_url,
      linkedinUrl: user.linkedin_url,
    };
  },

  async updateProfile(userId: string, data: {
    displayName?: string;
    bio?: string;
    location?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  }) {
    const user = await authRepository.updateProfile(userId, data);
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      location: user.location,
      githubUrl: user.github_url,
      linkedinUrl: user.linkedin_url,
    };
  },

  async uploadAvatar(userId: string, filename: string) {
    const avatarUrl = `/uploads/avatars/${filename}`;
    await authRepository.updateAvatar(userId, avatarUrl);
    return avatarUrl;
  },

  generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    } as jwt.SignOptions);
  },
};
