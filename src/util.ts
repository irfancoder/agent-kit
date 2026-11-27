import { spawnSync, type SpawnSyncOptions } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The kit's root: the folder holding package.json, templates/ and dist/. */
export const KIT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
export const KIT_VERSION: string = JSON.parse(readFileSync(join(KIT_DIR, 'package.json'), 'utf8')).version;
/** The e2e replay cache, relative to a project. It's keyed by fixed ids, so it keeps the placeholders. */
export const E2E_CACHE = join('packages', 'e2e', '.e2e', 'cache');

export class KitError extends Error {}

/** Stops the run with a message for the user (no stack trace). */
export function fail(message: string): never {
  throw new KitError(message);
}

export function warn(message: string): void {
  console.error(`agent-kit: warning: ${message}`);
}

export function step(message: string): void {
  console.log(`==> ${message}`);
}

/** Runs a command, streaming its output. Fails the run if it exits non-zero. */
export function run(cmd: string, args: string[], options: SpawnSyncOptions = {}): void {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  if (result.error) fail(`${cmd} couldn't start: ${result.error.message}`);
  if (result.status !== 0) fail(`${cmd} ${args.join(' ')} failed (exit ${result.status})`);
}

/** Runs a command quietly and returns its stdout, or null if it failed or isn't installed. */
export function output(cmd: string, args: string[]): string | null {
  const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return result.status === 0 ? String(result.stdout).trim() : null;
}
