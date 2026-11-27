---
name: agent-kit
description: Kickstart a new IRFANCODER project with agent-kit. It asks the owner for the brief and the few choices it needs, then scaffolds the project in the standard stack, creates its private GitHub repo and opens the Planner's first issue. Use when the owner wants to start, kick off or set up a new project or app. Not for work inside an existing project.
---

# agent-kit: kickstart a project

agent-kit is a CLI in the GitHub repo `irfancoder/agent-kit`. `pnpm dlx` fetches
and runs it straight from a release tag, so there's nothing to install. Ask the owner a
few questions, then run one command. You don't need to read the kit's templates.

## 1. Ask for the brief

Ask the owner for the brief in their own words: who it's for, what they should be able
to do, and anything they already know about hosting or data. Keep the reply **word for
word**: don't summarise, fix or add to it. The Planner works from exactly what the owner
said. You'll pass it to the CLI in step 3.

If the reply is only a line or two, that's fine. Don't interview them; the Planner asks
follow-up questions later, on the planning issue.

## 2. Propose the choices, and confirm them

From the brief, propose:

- **Name**: kebab-case, 2–4 words, the product's name if the brief gives one
  (`kedai-stock`). It becomes the repo name, the folder and the package scope, so make
  it short and lasting.
- **Title**: the app's display name (`Kedai Stock`). No quotes or backslashes.
- **Variant**:

  | The brief says | Variant |
  | --- | --- |
  | Nothing about hosting (the usual case) | `--variant node-postgres` (Fastify and Postgres) |
  | Cloudflare, Workers, edge | `--variant hono-cloudflare` (Postgres through Hyperdrive) |
  | Cloudflare plus D1, SQLite, or "no separate database" | `--variant hono-cloudflare --db d1` |

  Add a one-line reason. It's logged in the project's `.agent/DECISIONS.md`.
- **Components**, the headless component library:

  | Choice | When |
  | --- | --- |
  | `--ui base-ui` | The default: [Base UI](https://base-ui.com), stable |
  | `--ui ui-sdk` | Only if the owner asks for it: [ui-sdk](https://ui-sdk.dev), in beta and changing quickly |

- **Where:** the folder (default `~/projects/<name>`) and the GitHub owner (default: the
  signed-in `gh` user). The repo is always private.

Show the choices in one short message, including the component library (Base UI unless
they say otherwise), and ask the owner to confirm or change them. Don't
create anything before they say yes.

## 3. Run the CLI

One command. The brief goes in through stdin, word for word, so nothing is left behind
in a temp file:

```bash
pnpm --config.dlx-cache-max-age=0 dlx "github:irfancoder/agent-kit#${AGENT_KIT_REF:-semver:^0}" \
  <folder> --name <name> --title "<Title>" --variant <variant> [--db d1] --ui <base-ui|ui-sdk> \
  --reason "<why>" [--owner <owner>] --github --brief-file - <<'AGENT_KIT_BRIEF'
<the owner's brief, word for word>
AGENT_KIT_BRIEF
```

- `<folder>` is where the project goes (`~/projects/<name>` unless the owner chose
  another).
- `#semver:^0` runs the newest `v0.x` release. `--config.dlx-cache-max-age=0` makes pnpm
  look the release up each time instead of reusing a copy from an earlier run.
  `AGENT_KIT_REF` picks a branch or exact tag (`v0.1.0`) instead.
- `gh` must be signed in: `--github` uses it to create the project's private repo and
  its first issue.
- Passing `--brief-file -` means nobody is asked anything: anything left out uses its
  default.

It checks the machine first and stops before creating anything if something is
missing. Then it scaffolds the project with the brief in its first commit, creates the
private repo, pushes, and opens the Planner's issue. The last three lines it prints are
`PROJECT_DIR=`, `PROJECT_REPO=` and `PROJECT_ISSUE=`. `--help` lists every option.

If it fails, report the error as it is and stop. Never use `--no-verify`, delete folders
or repos, or edit agent-kit to get past a check. Pass on any warnings, such as Claude
Code not being signed in; it doesn't stop the run.

## 4. Report

Tell the owner, in a few lines:
- the repo link and the Planner's issue link;
- the name, title, variant and component library, and where the project is;
- any warnings, with the fix (for example, run `claude` and sign in);
- what happens next: the Planner picks up the issue and writes the goal, the spec and the
  feature list. The first ticket after that is the design language, which needs the
  Hallmark skill in this environment.
