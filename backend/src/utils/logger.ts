import { redactSecrets } from './redaction.js';

type Level = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const sanitize = (context?: LogContext): LogContext | undefined => {
  if (!context) return undefined;

  const output: LogContext = {};
  for (const [key, rawValue] of Object.entries(context)) {
    if (/authorization|api.?key|token|secret/i.test(key)) {
      output[key] = '[REDACTED]';
      continue;
    }

    const value = typeof rawValue === 'string' ? redactSecrets(rawValue) : rawValue;
    output[key] = value;
  }

  return output;
};

const log = (level: Level, message: string, context?: LogContext): void => {
  const event = {
    level,
    message: redactSecrets(message),
    timestamp: new Date().toISOString(),
    context: sanitize(context)
  };

  const line = JSON.stringify(event);
  if (level === 'error') {
    console.error(line);
    return;
  }

  console.log(line);
};

export const logger = {
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context)
};
