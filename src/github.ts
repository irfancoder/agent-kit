import type { Options } from './options.ts';
import { output, run, step } from './util.ts';

const PLAN_ISSUE = `Read \`AGENTS.md\`, then \`.agent/BRIEF.md\`.

- Write \`.agent/GOAL.md\` (frozen once merged), \`.agent/SPEC.md\` and \`.agent/feature_list.json\` (\`pnpm check:agent\` validates it).
- Open the design-language ticket first, labelled \`ready\`: run the \`design-language\` skill before any UI feature.
- Open one issue per feature in \`feature_list.json\`, labelled \`ready\` once nothing it depends on is still open.
- A question only the owner can answer: comment on this issue with your recommendation and add \`needs-decision\`.

Work on a branch and open a PR; never commit to \`main\`.`;

/** Creates the private repo, pushes main (through the pre-push hook), and opens the Planner's issue. */
export function publish(o: Options, owner: string): { repo: string; issue: string } {
  const here = { cwd: o.dir };
  step('Installing the e2e browser for the pre-push hook (cached per machine)');
  run('pnpm', ['--dir', 'packages/e2e', 'exec', 'e2e-web', 'install', 'chromium'], { ...here, stdio: ['ignore', 'ignore', 'inherit'] });

  const slug = `${owner}/${o.name}`;
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
  const issue =
    output('gh', ['issue', 'create', '--repo', slug, '--label', 'ready', '--title', 'Plan the project from the brief', '--body', PLAN_ISSUE]) ?? '';
  return { repo: `https://github.com/${slug}`, issue };
}
