import { checkMachine } from './checks.ts';
import { publish } from './github.ts';
import { getOptions } from './options.ts';
import { scaffold } from './scaffold.ts';
import { fail, KitError, step } from './util.ts';

async function main(): Promise<void> {
  const o = await getOptions(process.argv.slice(2));
  if (!o) return;

  step('Checking the machine');
  const owner = checkMachine(o);
  if (o.check) return;

  scaffold(o);
  let repo = '';
  let issue = '';
  if (o.github) {
    ({ repo, issue } = publish(o, owner ?? fail('no GitHub owner')));
    if (!issue) fail(`the repo was created (${repo}) but the Planner's issue wasn't`);
  }

  console.log(`
Done: ${o.dir} (${o.title})
${o.github ? '' : `
Next: cd ${o.dir} && ./.agent/init.sh, then read AGENTS.md.
`}
PROJECT_DIR=${o.dir}
PROJECT_REPO=${repo}
PROJECT_ISSUE=${issue}`);
}

main().catch((error: unknown) => {
  console.error(`agent-kit: ${error instanceof KitError ? error.message : String(error)}`);
  process.exit(1);
});
