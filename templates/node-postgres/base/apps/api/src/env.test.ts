import { describe, expect, test } from '@rstest/core';
import { parseEnv } from './env.ts';

describe('parseEnv', () => {
  test('applies defaults', () => {
    const env = parseEnv({ DATABASE_URL: 'postgres://u:p@localhost:5432/db' });
    expect(env.PORT).toBe(3001);
    expect(env.NODE_ENV).toBe('development');
  });

  test('names a missing value', () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });
});
