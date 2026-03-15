import { app } from './app.js';
import { getConfig } from './config/env.js';
import { logger } from './utils/logger.js';

const config = getConfig();

app.listen(config.PORT, () => {
  logger.info('server_started', {
    port: config.PORT,
    nodeEnv: config.NODE_ENV
  });
});
