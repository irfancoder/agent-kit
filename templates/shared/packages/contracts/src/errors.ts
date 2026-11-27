import * as v from 'valibot';

/** Every error the API returns has this shape, whatever went wrong. */
export const ErrorResponse = v.object({
  error: v.object({
    code: v.string(),
    message: v.string(),
    details: v.optional(v.array(v.object({ path: v.string(), message: v.string() }))),
  }),
});
export type ErrorResponse = v.InferOutput<typeof ErrorResponse>;

export const errorCodes = {
  badRequest: 'BAD_REQUEST',
  notFound: 'NOT_FOUND',
  internal: 'INTERNAL',
} as const;
