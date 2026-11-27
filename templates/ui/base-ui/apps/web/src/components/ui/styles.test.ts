import { readFileSync } from 'node:fs';
import { describe, expect, it } from '@rstest/core';
import { cn } from './styles.ts';

// cn only merges radius and shadow utilities it knows the names of, and styles.ts lists
// the token names by hand. This fails when tokens.css gains or renames one, so the list
// stays in step with the design language.
const tokens = readFileSync(new URL('../../styles/tokens.css', import.meta.url), 'utf8');
const names = (prefix: string) =>
  [...tokens.matchAll(new RegExp(`--${prefix}-([a-z0-9-]+):`, 'g'))].map((m) => m[1]);

describe('cn knows every token', () => {
  it.each(names('radius'))('radius %s', (name) => {
    expect(cn('rounded-none', `rounded-${name}`)).toBe(`rounded-${name}`);
  });

  // --shadow-color is the shadows' colour, not a shadow.
  it.each(names('shadow').filter((name) => name !== 'color'))('shadow %s', (name) => {
    expect(cn('shadow-none', `shadow-${name}`)).toBe(`shadow-${name}`);
  });
});
