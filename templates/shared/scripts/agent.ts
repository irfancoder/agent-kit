// Compact view of the .agent/ state for the bot team, so runs don't read whole files.
// Usage: pnpm agent <status|show|pass|unpass|fail|log|pause> [args]
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type Feature = {
  id: string;
  description: string;
  passes: boolean;
  attempts: number;
  depends_on: string[];
  parallel_ok: boolean;
  priority: number;
};

const LIST = '.agent/feature_list.json';
const PROGRESS = '.agent/PROGRESS.md';
const REPLAN_AT = 3;

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
// Shared by every worktree of the repo and never committed.
const PAUSE = join(git('rev-parse', '--git-common-dir'), 'agent-pause');

function fail(message: string): never {
  console.error(message);
  process.exit(2);
}
const load = (): Feature[] => JSON.parse(readFileSync(LIST, 'utf8'));
const save = (features: Feature[]) => writeFileSync(LIST, `${JSON.stringify(features, null, 2)}\n`);
const find = (features: Feature[], id: string | undefined) =>
  features.find((f) => f.id === id) ?? fail(`unknown feature id: ${id ?? '(none)'}`);
const now = () => new Date().toISOString().slice(0, 16) + 'Z';
const log = (line: string) => appendFileSync(PROGRESS, `${now()} | ${line}\n`);

const [command = 'status', id, ...rest] = process.argv.slice(2);

switch (command) {
  case 'status': {
    const status = readFileSync('.agent/STATUS', 'utf8').trim();
    if (status === 'DONE' || status === 'BLOCKED') {
      console.log(`STOP: STATUS=${status}`);
      break;
    }
    if (existsSync(PAUSE)) {
      const until = readFileSync(PAUSE, 'utf8').trim();
      if (now() < until) {
        console.log(`STOP: paused for a model limit until ${until}`);
        break;
      }
      rmSync(PAUSE);
    }
    const features = load();
    const done = new Set(features.filter((f) => f.passes).map((f) => f.id));
    const ready = features
      .filter((f) => !f.passes && f.depends_on.every((d) => done.has(d)))
      .sort((a, b) => a.priority - b.priority);
    const retrying = features.filter((f) => !f.passes && f.attempts > 0);
    const recent = readFileSync(PROGRESS, 'utf8')
      .split('\n')
      .filter((l) => /^\d{4}-/.test(l))
      .slice(-5);
    console.log(`STATUS: ${status}`);
    console.log(`FEATURES: ${features.length} total, ${done.size} pass`);
    console.log(`NEXT: ${ready[0] ? `${ready[0].id} ${ready[0].description}` : 'none'}`);
    console.log(
      `READY: ${ready
        .slice(0, 10)
        .map((f) => f.id + (f.parallel_ok ? '*' : ''))
        .join(' ')}`,
    );
    console.log(`RETRYING: ${retrying.map((f) => `${f.id}(${f.attempts})`).join(' ')}`);
    console.log(`HEAD: ${git('log', '-1', '--format=%h %s')}`);
    console.log(['RECENT:', ...recent].join('\n'));
    break;
  }
  case 'show':
    console.log(JSON.stringify(find(load(), id), null, 2));
    break;
  case 'pass':
  case 'unpass': {
    const features = load();
    find(features, id).passes = command === 'pass';
    save(features);
    log(`evaluator | ${id} ${command}${rest.length ? ` | ${rest.join(' ')}` : ''}`);
    break;
  }
  case 'fail': {
    const features = load();
    const feature = find(features, id);
    feature.attempts += 1;
    save(features);
    console.log(`ATTEMPTS: ${feature.attempts}`);
    if (feature.attempts >= REPLAN_AT) console.log('REPLAN');
    break;
  }
  case 'log':
    log([id, ...rest].filter(Boolean).join(' '));
    break;
  case 'pause':
    if (!id || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(id)) fail('pause <reset time, ISO UTC>');
    writeFileSync(PAUSE, `${id}\n`);
    console.log(`Paused until ${id}`);
    break;
  default:
    fail('usage: pnpm agent <status|show|pass|unpass|fail|log|pause> [args]');
}
