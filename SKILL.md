---
name: agent-kit
description: Kickstart a new IRFANCODER project with agent-kit. It asks the owner for the brief and the few choices it needs, then scaffolds the project in the standard stack, creates its private GitHub repo and opens the Planner's first issue. Use when the owner wants to start, kick off or set up a new project or app. Not for work inside an existing project.
---

# agent-kit: kickstart a project

agent-kit (the project template, `scaffold.sh` and `scripts/kickstart.sh`) lives in the
private GitHub repo `irfancoder/agent-kit`. This skill fetches it when it runs, so it's
always the version on `main`. Ask the owner a few questions, fetch the kit, then run one
script from it. You don't need to read the templates.

## 1. Ask for the brief

Ask the owner for the brief in their own words: who it's for, what they should be able
to do, and anything they already know about hosting or data. Keep the reply **word for
word**: don't summarise, fix or add to it. The Planner works from exactly what the owner
said. Save it to a temp file.

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
- **Where:** the folder (default `~/projects/<name>`) and the GitHub owner (default: the
  signed-in `gh` user). The repo is always private.

Show the choices in one short message and ask the owner to confirm or change them. Don't
create anything before they say yes.

## 3. Fetch the kit and run it

If the folder this `SKILL.md` is in also has `scripts/kickstart.sh` (a full checkout, on
someone's own machine), use that folder as `<kit>`. Otherwise fetch it:

```bash
KIT="$(mktemp -d)/agent-kit"
gh repo clone irfancoder/agent-kit "$KIT" -- --depth 1 --branch "${AGENT_KIT_REF:-main}"
```

`gh` must be signed in with read access to the repo; the script needs the same login to
create the project's repo. If the clone fails, report it and stop. `AGENT_KIT_REF` picks
another branch or tag, for trying a change before it's merged.

Then run the script, with `bash`:

```bash
bash "<kit>/scripts/kickstart.sh" --name <name> --title "<Title>" --brief-file <file> \
  --variant <variant> [--db d1] --reason "<why>" [--dir <folder>] [--owner <owner>]
```

It checks the machine first and stops before creating anything if something is
missing. Then it scaffolds the project with the brief in its first commit, creates the
private repo, pushes, and opens the Planner's issue. The last three lines it prints are
`KICKSTART_DIR=`, `KICKSTART_REPO=` and `KICKSTART_ISSUE=`. Run
`bash <kit>/scripts/kickstart.sh --help` for every option. The clone is a temp folder;
leave it, as it isn't part of the project.

If it fails, report the error as it is and stop. Never use `--no-verify`, delete folders
or repos, or edit agent-kit to get past a check. Pass on any warnings, such as Claude
Code not being signed in; it doesn't stop the run.

## 4. Report

Tell the owner, in a few lines:
- the repo link and the Planner's issue link;
- the name, title and variant, and where the project is;
- any warnings, with the fix (for example, run `claude` and sign in);
- what happens next: the Planner picks up the issue and writes the goal, the spec and the
  feature list. The first ticket after that is the design language, which needs the
  Hallmark skill in this environment.
