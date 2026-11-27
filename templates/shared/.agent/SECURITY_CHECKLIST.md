# Security checklist

Every PR is checked against this list. A "no" blocks the merge.

> Starter version. Irfan supplies the final text.

## Secrets and config

- [ ] No secrets, tokens, keys or real personal data in the diff, the e2e cache, fixtures or logs.
- [ ] Every new env var is in the env schema (`apps/api/src/env.ts`) and `.env.example`, with no real value.

## Input and output

- [ ] Every new route is defined in `packages/contracts` and validates its params, query and body with Valibot.
- [ ] Responses are validated against the contract; errors use the one error shape and leak no stack traces or SQL.
- [ ] Database access goes through Kysely's query builder or `sql` template tags; no string-built SQL.
- [ ] User-supplied text is rendered as text, never through `dangerouslySetInnerHTML`.

## Access

- [ ] Any route that reads or changes a user's data checks who is asking, and only returns their data.
- [ ] Limits exist on list sizes and request bodies.

## Dependencies

- [ ] New dependencies are pinned in the pnpm catalog, are actively maintained, and were approved.
- [ ] No install scripts were allowed for a new package without a reason in DECISIONS.md.

## Process

- [ ] Hooks ran: nothing used `--no-verify`, and no hook was edited to get past a failure.
- [ ] Tests that changed were re-recorded on purpose, not deleted.
