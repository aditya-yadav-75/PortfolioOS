import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          issues: error.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        });
        return;
      }
      res.status(400).json({ success: false, error: 'Malformed request payload' });
    }
  };
}
