import { describe, expect, test } from '@rstest/core';
import { parseEnv } from './env.ts';

describe('parseEnv', () => {
  test('applies defaults', () => {
    const env = parseEnv({});
    expect(env.PORT).toBe(3001);
    expect(env.NODE_ENV).toBe('development');
    expect(env.DATABASE_PATH).toBe('data/kitapp.sqlite');
  });

  test('names a bad value', () => {
    expect(() => parseEnv({ PORT: 'nope' })).toThrow(/PORT/);
  });
});
