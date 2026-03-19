import type { NextFunction, Request, Response } from 'express';
import { getConfig } from '../config/env.js';

const config = getConfig();

export const requestTimeoutMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  req.setTimeout(config.REQUEST_TIMEOUT_MS);
  res.setTimeout(config.REQUEST_TIMEOUT_MS, () => {
    req.requestAbortController.abort('request_timeout');

    if (!res.headersSent) {
      res.status(408).json({
        error: {
          code: 'REQUEST_TIMEOUT',
          message: 'Request timed out. Please retry.'
        },
        requestId: req.requestId
      });
    }
  });

  req.on('aborted', () => {
    req.requestAbortController.abort('client_aborted');
  });

  res.on('close', () => {
    if (!res.writableEnded) {
      req.requestAbortController.abort('client_closed');
    }
  });

  next();
};
