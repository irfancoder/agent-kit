import type { Options } from './options.ts';
import { fail, output, run, step } from './util.ts';

// Only what the issue adds; AGENTS.md holds the rules.
const PLAN_ISSUE = `Read \`AGENTS.md\`, then plan the project from \`.agent/BRIEF.md\`: \`GOAL.md\`, \`SPEC.md\` and \`feature_list.json\`.

Then open the issues the team works from, each labelled \`ready\` once nothing it depends on is still open: the design-language ticket first, then one per feature. For a question only the owner can answer, comment here with your recommendation and add \`needs-decision\`.`;

/** Creates the private repo, pushes main (through the pre-push hook), and opens the Planner's issue. */
export function publish(o: Options): { repo: string; issue: string } {
  const here = { cwd: o.dir };
  step('Installing the e2e browser for the pre-push hook (cached per machine)');
  run('pnpm', ['--dir', 'packages/e2e', 'exec', 'e2e-web', 'install', 'chromium'], { ...here, stdio: ['ignore', 'ignore', 'inherit'] });

  const slug = `${o.owner}/${o.name}`;
  step(`Creating github.com/${slug}`);
  run('gh', ['repo', 'create', slug, '--private', '--source', '.', '--remote', 'origin', '--push'], here);
  for (const [label, color, description] of [
    ['ready', '0e8a16', 'Can be picked up now'],
    ['needs-decision', 'd93f0b', 'Waiting on the owner'],
  ]) {
    run('gh', ['label', 'create', label, '--repo', slug, '--color', color, '--description', description, '--force'], {
      stdio: 'ignore',
    });
  }
  const repo = `https://github.com/${slug}`;
  const issue =
    output('gh', ['issue', 'create', '--repo', slug, '--label', 'ready', '--title', 'Plan the project from the brief', '--body', PLAN_ISSUE]) ??
    fail(`the repo was created (${repo}) but the Planner's issue wasn't`);
  return { repo, issue };
}
