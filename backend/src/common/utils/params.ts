import { Request } from 'express';

/**
 * Safely extract a route param as a string (Express v5 params can be string | string[]).
 */
export function param(req: Request, name: string): string {
  const val = req.params[name];
  return Array.isArray(val) ? val[0] : val;
}

/**
 * Safely parse a pagination limit from query params.
 * Returns a positive integer clamped to [1, max], or the default value.
 */
export function parseLimit(req: Request, defaultVal = 20, max = 100): number {
  const raw = parseInt(req.query.limit as string);
  if (isNaN(raw) || raw < 1) return defaultVal;
  return Math.min(raw, max);
}

/**
 * Safely parse a pagination offset from query params.
 * Returns a non-negative integer, or 0.
 */
export function parseOffset(req: Request): number {
  const raw = parseInt(req.query.offset as string);
  return isNaN(raw) || raw < 0 ? 0 : raw;
}
