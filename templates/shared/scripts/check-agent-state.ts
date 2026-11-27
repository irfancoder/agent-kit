// Checks the .agent/ coordination files: feature_list.json against
// feature_list.schema.json's rules, and STATUS against its allowed values.
// Runs in the pre-commit hook: node scripts/check-agent-state.ts
import { readFileSync } from 'node:fs';
import * as v from 'valibot';

const FeatureId = v.pipe(v.string(), v.regex(/^F-\d{3,}$/, 'must look like F-012'));

/** Mirrors .agent/feature_list.schema.json. Keep the two in step. */
const Feature = v.strictObject({
  id: FeatureId,
  category: v.pipe(v.string(), v.minLength(1)),
  description: v.pipe(v.string(), v.minLength(1)),
  steps: v.pipe(v.array(v.pipe(v.string(), v.minLength(1))), v.minLength(1)),
  passes: v.boolean(),
  attempts: v.pipe(v.number(), v.integer(), v.minValue(0)),
  depends_on: v.array(FeatureId),
  parallel_ok: v.boolean(),
  priority: v.pipe(v.number(), v.integer(), v.minValue(1)),
  kind: v.picklist(['feature', 'design-polish']),
});
const FeatureList = v.array(Feature);
const Status = v.picklist(['RUNNING', 'PAUSED_LIMIT', 'DONE', 'BLOCKED']);

const problems: string[] = [];

const features = v.safeParse(
  FeatureList,
  JSON.parse(readFileSync('.agent/feature_list.json', 'utf8')),
);
if (!features.success) {
  for (const issue of features.issues) {
    problems.push(`feature_list.json ${v.getDotPath(issue) ?? ''}: ${issue.message}`);
  }
} else {
  const ids = new Set<string>();
  for (const f of features.output) {
    if (ids.has(f.id)) problems.push(`feature_list.json: duplicate id ${f.id}`);
    ids.add(f.id);
  }
  for (const f of features.output) {
    for (const dep of f.depends_on) {
      if (!ids.has(dep)) problems.push(`feature_list.json: ${f.id} depends on unknown ${dep}`);
    }
  }
}

const status = v.safeParse(Status, readFileSync('.agent/STATUS', 'utf8').trim());
if (!status.success) problems.push(`STATUS must be one of ${Status.options.join(', ')}`);

if (problems.length) {
  console.error(`.agent/ check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
console.log('.agent/ files are valid');
