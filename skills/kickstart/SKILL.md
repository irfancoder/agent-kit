---
name: kickstart
description: Start a new IRFANCODER project from an owner's brief with agent-kit. It scaffolds the project, records the brief, creates the private GitHub repo and opens the Planner's first issue. Use when the owner hands over a brief for a new app or says to start, kick off or set up a project. Not for work inside an existing project.
---

# Kickstart a project

You turn the owner's brief into a project the agent team can pick up: a private GitHub
repo scaffolded from agent-kit, the brief in `.agent/BRIEF.md`, and a `ready` issue
for the Planner. One script does the mechanical part. Your job is the three choices
it needs, and reporting back.

## 1. Get the brief

The brief is the owner's own words: pasted in the conversation, a file, or a GitHub
issue's body. Save it **word for word** to a temp file. Don't summarise it, fix it or
add to it: the Planner works from exactly what the owner said.

## 2. Make three choices from the brief

- **Name**: kebab-case, 2–4 words, the product's name if the brief gives one
  (`budget-tracker`, `kedai-stock`). It becomes the repo name, the folder
  (`~/projects/<name>`) and the package scope, so make it short and lasting.
- **Title**: the app's display name, as the brief writes it (`Budget Tracker`).
- **Variant**:

  | The brief says | Variant |
  | --- | --- |
  | Nothing about hosting (the usual case) | `--variant node-postgres` |
  | Cloudflare, Workers, edge | `--variant hono-cloudflare` (Postgres through Hyperdrive) |
  | Cloudflare plus D1, SQLite, or "no separate database" | `--variant hono-cloudflare --db d1` |

  Write a one-line reason for the choice (`--reason`). It goes in `.agent/DECISIONS.md`.

Ask the owner only when the brief contradicts itself on hosting, or names no product and
you can't find a fitting name. Otherwise decide, and say what you decided in the report.

## 3. Run it

From this skill's real folder (it's a link into the agent-kit checkout):

```bash
KIT="$(cd "<this skill's folder>" && pwd -P)/../.."
"$KIT/scripts/kickstart.sh" --name <name> --title "<Title>" --brief-file <file> \
  --variant <variant> [--db d1] --reason "<why>"
```

It checks the machine first and stops before creating anything if something is
missing. Then it scaffolds into `~/projects/<name>`, with the brief in the first commit.
It creates the private repo, pushes, and opens the Planner's issue. The last three lines
it prints are `KICKSTART_DIR=`, `KICKSTART_REPO=` and `KICKSTART_ISSUE=`.
`kickstart.sh --help` lists every option.

If it fails, report the error as it is and stop. Never use `--no-verify`, delete folders
or repos, or edit agent-kit to get past a check. Warnings don't stop it (Claude Code not
signed in, Hallmark not installed), but pass them on: the team needs both.

## 4. Report

Tell the owner, in a few lines:
- the repo link and the Planner's issue link;
- the name, title and variant you chose, and why;
- any warnings, with the fix (`claude` to sign in; `scripts/install-skills.sh` for
  Hallmark);
- what happens next: the Planner picks up the issue and writes the goal, the spec and
  the feature list. The first feature ticket is the design language.
