import type { NextFunction, Request, Response } from 'express';
import { maskIp } from '../utils/ip.js';
import { logger } from '../utils/logger.js';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    logger.info('request_completed', {
      requestId: req.requestId,
      method: req.method,
      route: req.path,
      statusCode: res.statusCode,
      latencyMs: Date.now() - req.startTime,
      ip: maskIp(req.ip)
    });
  });

  next();
};
