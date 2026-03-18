import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type ProblemStatus = 'not_started' | 'attempted' | 'solved';
export type GroupRole = 'admin' | 'member';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type NoteVisibility = 'personal' | 'group';
