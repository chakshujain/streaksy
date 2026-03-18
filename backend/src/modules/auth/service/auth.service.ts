import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';
import { authRepository } from '../repository/auth.repository';

export const authService = {
  async signup(email: string, password: string, displayName: string) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw AppError.conflict('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await authRepository.create(email, passwordHash, displayName);

    return {
      user: { id: user.id, email: user.email, displayName: user.display_name },
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
      user: { id: user.id, email: user.email, displayName: user.display_name },
      token: this.generateToken(user.id, user.email),
    };
  },

  async connectLeetcode(userId: string, leetcodeUsername: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    await authRepository.connectLeetcode(userId, leetcodeUsername);
  },

  generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    } as jwt.SignOptions);
  },
};
