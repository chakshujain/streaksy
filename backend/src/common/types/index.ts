import { Request } from 'express';
import type pino from 'pino';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Augment Express Request globally
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      log?: pino.Logger;
    }
  }
}

export type ProblemStatus = 'not_started' | 'attempted' | 'solved';
export type GroupRole = 'admin' | 'member';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type NoteVisibility = 'personal' | 'group';
