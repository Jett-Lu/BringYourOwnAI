import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';
import { getConfig } from '../config/env.js';

const config = getConfig();

export const apiRateLimit = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please slow down.'
    }
  },
  keyGenerator: (req: Request) => req.ip ?? 'unknown',
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please slow down.'
      },
      requestId: req.requestId
    });
  }
});
