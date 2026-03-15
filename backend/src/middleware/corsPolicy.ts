import cors from 'cors';
import { getConfig } from '../config/env.js';
import { AppError } from '../types/errors.js';

const config = getConfig();

export const corsPolicyMiddleware = cors({
  origin: (origin, callback) => {
    if (config.NODE_ENV === 'production' && !origin) {
      callback(new AppError('Origin header is required.', 403, 'validation_error'));
      return;
    }

    if (config.NODE_ENV !== 'production' && !origin) {
      callback(null, true);
      return;
    }

    if (origin === config.FRONTEND_ORIGIN) {
      callback(null, true);
      return;
    }

    callback(new AppError('Origin is not allowed.', 403, 'validation_error'));
  },
  methods: ['GET', 'POST'],
  credentials: false
});
