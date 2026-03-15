const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{16,}/g,
  /Bearer\s+[A-Za-z0-9._-]{10,}/gi,
  /api[_-]?key["'\s:=]+[A-Za-z0-9._-]{8,}/gi
];

export const redactSecrets = (value: string): string => {
  return SECRET_PATTERNS.reduce((acc, pattern) => acc.replace(pattern, '[REDACTED]'), value);
};
