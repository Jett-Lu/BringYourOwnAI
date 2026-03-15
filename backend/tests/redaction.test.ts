import { describe, expect, it } from 'vitest';
import { redactSecrets } from '../src/utils/redaction.js';

describe('redactSecrets', () => {
  it('redacts common secret patterns', () => {
    const input = 'token sk-test-12345678901234567890 and Bearer mysupersecrettoken';
    const result = redactSecrets(input);

    expect(result).toContain('[REDACTED]');
    expect(result).not.toContain('sk-test-12345678901234567890');
    expect(result).not.toContain('mysupersecrettoken');
  });
});
