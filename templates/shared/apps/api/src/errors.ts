import { errorCodes, type ErrorResponse } from '@kitapp/contracts';
import type * as v from 'valibot';

export class HttpError extends Error {
  readonly status: 400 | 404 | 500;
  readonly code: string;
  readonly details: ErrorResponse['error']['details'];

  constructor(
    status: 400 | 404 | 500,
    code: string,
    message: string,
    details?: ErrorResponse['error']['details'],
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  toBody(): ErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}

export const notFound = (message = 'Not found') => new HttpError(404, errorCodes.notFound, message);

export function validationError(issues: v.BaseIssue<unknown>[]): HttpError {
  return new HttpError(
    400,
    errorCodes.badRequest,
    'Request is invalid',
    issues.map((issue) => ({
      path: issue.path?.map((p) => String(p.key)).join('.') ?? '',
      message: issue.message,
    })),
  );
}
