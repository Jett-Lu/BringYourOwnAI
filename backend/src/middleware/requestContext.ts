import type { NextFunction, Request, Response } from 'express';
import { createRequestId } from '../utils/requestId.js';

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string;
    startTime: number;
  }
}

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  req.requestId = createRequestId();
  req.startTime = Date.now();
  res.setHeader('x-request-id', req.requestId);
  next();
};
