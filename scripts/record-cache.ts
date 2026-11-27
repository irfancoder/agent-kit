// Records the template's e2e replay cache and copies it into
// templates/shared/packages/e2e/.e2e/cache, so every new project's pre-push hook
// (--strict-cache) replays its agent steps without running an agent.
//
//   pnpm record-cache
//
// Records on Claude Code with your `claude` login (the Claude Max plan): run `claude`
// and sign in first. Run it again after changing the example UI or its e2e tests.
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { E2E_CACHE, KIT_DIR, output, run } from '../src/util.ts';

if (!/"loggedIn":\s*true/.test(output('claude', ['auth', 'status']) ?? '')) {
  console.error("record-cache: Claude Code isn't signed in. Run `claude` and sign in with your Max account.");
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'agent-kit-record-'));
try {
  const app = join(work, 'app');
  // node-sqlite needs no database server. The web app, and so the recording, is the
  // same in every variant.
  run('node', [join(KIT_DIR, 'src/index.ts'), app, '--name', 'record-app', '--variant', 'node-sqlite', '--yes'], {
    stdio: 'ignore',
  });
  const e2e = join(app, 'packages/e2e');
  rmSync(join(app, E2E_CACHE), { recursive: true, force: true });

  console.log('Recording (runs Claude Code on your plan)…');
  run('pnpm', ['e2e:record'], { cwd: e2e });

  console.log('Checking the recording replays with no agent…');
  const noLogin = join(work, 'no-claude-login');
  mkdirSync(noLogin);
  run('pnpm', ['e2e', '--strict-cache'], { cwd: e2e, env: { ...process.env, CI: '1', CLAUDE_CONFIG_DIR: noLogin } });

  const dest = join(KIT_DIR, 'templates/shared', E2E_CACHE);
  rmSync(dest, { recursive: true, force: true });
  cpSync(join(app, E2E_CACHE), dest, { recursive: true });
  writeFileSync(join(dest, '.gitkeep'), '');
  console.log(`Saved the replay cache to ${dest}. Commit it.`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
