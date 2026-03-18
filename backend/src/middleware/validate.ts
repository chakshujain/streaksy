import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validates request body/params/query against a Zod schema.
 */
export function validate(schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const issues = (result as any).error?.issues ?? [];
      res.status(400).json({
        error: 'Validation failed',
        details: issues.map((e: any) => ({
          field: e.path?.join('.') ?? '',
          message: e.message ?? 'Invalid',
        })),
      });
      return;
    }
    req[source] = result.data;
    next();
  };
}
