import type { NextFunction, Request, Response } from 'express';
import { createRequestId } from '../utils/requestId.js';

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string;
    startTime: number;
    requestAbortController: AbortController;
    requestSignal: AbortSignal;
  }
}

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  req.requestId = createRequestId();
  req.startTime = Date.now();
  req.requestAbortController = new AbortController();
  req.requestSignal = req.requestAbortController.signal;
  res.setHeader('x-request-id', req.requestId);
  next();
};
