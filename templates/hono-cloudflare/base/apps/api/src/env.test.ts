import { describe, expect, test } from '@rstest/core';
import { parseEnv, parseVars } from './env.ts';

describe('env', () => {
  test('applies defaults to plain vars', () => {
    expect(parseVars({}).LOG_LEVEL).toBe('info');
  });

  test('rejects a bad value', () => {
    expect(() => parseVars({ LOG_LEVEL: 'loud' })).toThrow(/LOG_LEVEL/);
  });

  test('names a missing binding', () => {
    expect(() => parseEnv({})).toThrow(/Invalid environment/);
  });
});
