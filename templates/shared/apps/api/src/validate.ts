import * as v from 'valibot';
import { validationError } from './errors.ts';

/** Validates one part of a request (params, query or body); a failure becomes a 400 in the error shape. */
export function parseRequest(schema: v.GenericSchema | undefined, value: unknown): unknown {
  if (!schema) return undefined;
  const result = v.safeParse(schema, value);
  if (!result.success) throw validationError(result.issues);
  return result.output;
}

/** Validates the environment, or throws one error that lists every bad or missing value. */
export function parseEnvWith<S extends v.GenericSchema>(
  schema: S,
  source: unknown,
): v.InferOutput<S> {
  const result = v.safeParse(schema, source);
  if (result.success) return result.output;
  const lines = result.issues.map(
    (issue) => `  - ${v.getDotPath(issue) ?? '(root)'}: ${issue.message}`,
  );
  throw new Error(`Invalid environment. Check .env against .env.example:\n${lines.join('\n')}`);
}

/** For entry points: validate the environment, or print why and exit. */
export function parseEnvOrExit<S extends v.GenericSchema>(
  schema: S,
  source: unknown,
): v.InferOutput<S> {
  try {
    return parseEnvWith(schema, source);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}
