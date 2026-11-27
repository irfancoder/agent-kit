import { checkMachine } from './checks.ts';
import { publish } from './github.ts';
import { getOptions } from './options.ts';
import { scaffold } from './scaffold.ts';
import { KitError, step } from './util.ts';

async function main(): Promise<void> {
  const o = await getOptions(process.argv.slice(2));
  if (!o) return;

  step('Checking the machine');
  checkMachine(o);
  if (o.check) return;

  scaffold(o);
  const { repo, issue } = o.github ? publish(o) : { repo: '', issue: '' };

  console.log(`\nDone: ${o.dir} (${o.title})`);
  if (!o.github) console.log(`Next: cd ${o.dir} && ./.agent/init.sh, then read AGENTS.md.`);
  console.log(`\nPROJECT_DIR=${o.dir}\nPROJECT_REPO=${repo}\nPROJECT_ISSUE=${issue}`);
}

main().catch((error: unknown) => {
  // Ctrl+C or Ctrl+D at a question.
  if (error instanceof Error && error.name === 'AbortError') error = new KitError('cancelled');
  console.error(`agent-kit: ${error instanceof KitError ? error.message : String(error)}`);
  process.exit(1);
});
