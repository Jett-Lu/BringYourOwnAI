import express from 'express';
import { getConfig } from './config/env.js';
import { corsPolicyMiddleware } from './middleware/corsPolicy.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimit } from './middleware/rateLimit.js';
import { requestContextMiddleware } from './middleware/requestContext.js';
import { requestLoggerMiddleware } from './middleware/requestLogger.js';
import { securityHeadersMiddleware } from './middleware/securityHeaders.js';
import { requestTimeoutMiddleware } from './middleware/timeout.js';
import { registerRoutes } from './routes/index.js';

const config = getConfig();
export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', config.TRUST_PROXY);

// Request context first so every response path gets a request ID.
app.use(requestContextMiddleware);
app.use(securityHeadersMiddleware);
app.use(corsPolicyMiddleware);
app.use(requestTimeoutMiddleware);
app.use(express.json({ limit: config.REQUEST_BODY_LIMIT, strict: true, type: 'application/json' }));
app.use(requestLoggerMiddleware);

app.use('/api', apiRateLimit);
registerRoutes(app);

app.use('/api', (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`
    },
    requestId: req.requestId
  });
});

app.use(errorHandler);
