import { describe, expect, test } from '@rstest/core';
import { en } from './en.ts';
import { locales, translate, translateCount } from './index.tsx';

describe('messages', () => {
  test('every locale has every key', () => {
    for (const messages of Object.values(locales)) {
      expect(Object.keys(messages).toSorted()).toEqual(Object.keys(en).toSorted());
    }
  });

  test('fills params', () => {
    expect(translate('en', 'items.createError', { message: 'offline' })).toContain('offline');
  });

  test('picks the plural form', () => {
    expect(translateCount('en', 'items.count', 1)).toBe('1 item');
    expect(translateCount('en', 'items.count', 3)).toBe('3 items');
    expect(translateCount('ms', 'items.count', 3)).toBe('3 item');
  });
});
