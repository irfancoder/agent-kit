import { describe, expect, test } from '@rstest/core';
import { generateOpenApi } from './openapi.ts';

describe('generateOpenApi', () => {
  const doc = generateOpenApi({ title: 'Kit App', version: '0.0.0' }) as {
    paths: Record<
      string,
      Record<string, { operationId: string; responses: Record<string, unknown> }>
    >;
  };

  test('has every route from the route map', () => {
    expect(Object.keys(doc.paths).toSorted()).toEqual(['/healthz', '/items', '/items/{id}']);
    expect(doc.paths['/items']?.post?.operationId).toBe('createItem');
  });

  test('uses the route status for success', () => {
    expect(doc.paths['/items']?.post?.responses).toHaveProperty('201');
  });
});
