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
said. You'll pass it to the script in step 3.

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

Run this as **one** command, so the temp folder holding the brief and the kit is deleted
when it ends, whether kickstart succeeds or fails:

```bash
WORK="$(mktemp -d)" && trap 'rm -rf "$WORK"' EXIT && cat > "$WORK/brief.md" <<'AGENT_KIT_BRIEF'
<the owner's brief, word for word>
AGENT_KIT_BRIEF
gh repo clone irfancoder/agent-kit "$WORK/agent-kit" -- --depth 1 --branch "${AGENT_KIT_REF:-main}" \
  && bash "$WORK/agent-kit/scripts/kickstart.sh" --brief-file "$WORK/brief.md" \
     --name <name> --title "<Title>" --variant <variant> [--db d1] --reason "<why>" \
     [--dir <folder>] [--owner <owner>]
```

- **The clone** is `main` of the private repo `irfancoder/agent-kit`. `gh` must be signed
  in with read access, and the script needs the same login to create the project's
  repo. `AGENT_KIT_REF` picks another branch or tag, to try a change before it's merged.
- **A full checkout:** if the folder this `SKILL.md` is in also has
  `scripts/kickstart.sh` (someone's own machine), skip the clone and run
  `bash <that folder>/scripts/kickstart.sh` the same way.
- **Nothing to clean up:** the project is created in its own folder (`--dir`, default
  `~/projects/<name>`), outside the temp folder, so the cleanup never touches it.

It checks the machine first and stops before creating anything if something is
missing. Then it scaffolds the project with the brief in its first commit, creates the
private repo, pushes, and opens the Planner's issue. The last three lines it prints are
`KICKSTART_DIR=`, `KICKSTART_REPO=` and `KICKSTART_ISSUE=`. `kickstart.sh --help`
lists every option.

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
