#!/usr/bin/env bash
# Starts a project from an owner's brief, end to end: checks the machine, scaffolds
# with the brief in the first commit, creates the private GitHub repo, pushes, and
# opens the Planner's first issue. The kickstart skill (skills/kickstart) decides the
# name, title and variant from the brief and calls this; people can call it directly.
#
#   kickstart.sh --name <kebab-name> --brief-file <path> [--title "App Title"]
#                [--variant node-postgres|hono-cloudflare] [--db hyperdrive|d1]
#                [--reason "why this variant"] [--dir <path>] [--owner <github-owner>]
#                [--no-remote]
#
# --dir defaults to ~/projects/<name>, --owner to the signed-in gh user.
# --no-remote stops after the local commit (no GitHub repo, no push, no issue).
# The last lines it prints are KICKSTART_DIR=, KICKSTART_REPO= and KICKSTART_ISSUE=.
set -euo pipefail

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
die() { echo "kickstart: $*" >&2; exit 1; }
warn() { echo "kickstart: warning: $*" >&2; }

NAME="" DIR="" OWNER="" REMOTE=1 SCAFFOLD_ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) NAME="${2:-}"; SCAFFOLD_ARGS+=("$1" "${2:-}"); shift 2 ;;
    --title|--variant|--db|--brief-file|--reason) SCAFFOLD_ARGS+=("$1" "${2:-}"); shift 2 ;;
    --dir) DIR="${2:-}"; shift 2 ;;
    --owner) OWNER="${2:-}"; shift 2 ;;
    --no-remote) REMOTE=0; shift ;;
    -h|--help) sed -n '2,/^set /{/^#/s/^# \{0,1\}//p;}' "$0"; exit 0 ;;
    *) die "unknown argument $1" ;;
  esac
done
[[ -n "$NAME" ]] || die "--name is required"
[[ " ${SCAFFOLD_ARGS[*]} " == *" --brief-file "* ]] || die "--brief-file is required"
DIR="${DIR:-$HOME/projects/$NAME}"

# 1. Check everything before creating anything.
echo "==> Checking the machine"
"$KIT_DIR/scaffold.sh" "$DIR" "${SCAFFOLD_ARGS[@]}" --check
if [[ $REMOTE == 1 ]]; then
  OWNER="${OWNER:-$(gh api user -q .login 2>/dev/null)}" || die "gh isn't installed or signed in (gh auth login)"
  gh repo view "$OWNER/$NAME" >/dev/null 2>&1 && die "github.com/$OWNER/$NAME already exists"
  # The first push runs the pre-push e2e hook, which replays agent steps from the cache.
  compgen -G "$KIT_DIR/templates/shared/packages/e2e/.e2e/cache/*.json" >/dev/null \
    || die "agent-kit's e2e replay cache isn't recorded yet, so the first push would fail (irfancoder/agent-kit#1)"
fi
claude auth status 2>/dev/null | grep -Eq '"loggedIn": *true' \
  || warn "Claude Code isn't signed in; the Builder can't record e2e steps until you run \`claude\` and sign in"
"$KIT_DIR/scripts/install-hallmark.sh" --check \
  || warn "Hallmark isn't installed at agent-kit's pin; the design-language ticket needs $KIT_DIR/scripts/install-skills.sh"

# 2. Scaffold, with the brief and the variant decision in the first commit.
"$KIT_DIR/scaffold.sh" "$DIR" "${SCAFFOLD_ARGS[@]}"
cd "$DIR"
DIR="$(pwd)"

REPO="" ISSUE=""
if [[ $REMOTE == 1 ]]; then
  echo "==> Installing the e2e browser for the pre-push hook (cached per machine)"
  pnpm --dir packages/e2e exec e2e-web install chromium >/dev/null

  # 3. Create the private repo and push main (runs the pre-push hook).
  echo "==> Creating github.com/$OWNER/$NAME"
  gh repo create "$OWNER/$NAME" --private --source . --remote origin --push
  REPO="https://github.com/$OWNER/$NAME"
  gh label create ready --repo "$OWNER/$NAME" --color 0e8a16 --description "Can be picked up now" --force >/dev/null
  gh label create needs-decision --repo "$OWNER/$NAME" --color d93f0b --description "Waiting on the owner" --force >/dev/null

  # 4. The Planner's first ticket.
  ISSUE="$(gh issue create --repo "$OWNER/$NAME" --label ready --title "Plan the project from the brief" --body "$(cat <<'BODY'
Read `AGENTS.md`, then `.agent/BRIEF.md`.

- Write `.agent/GOAL.md` (frozen once merged), `.agent/SPEC.md` and `.agent/feature_list.json` (`pnpm check:agent` validates it).
- Open the design-language ticket first, labelled `ready`: run the `design-language` skill before any UI feature.
- Open one issue per feature in `feature_list.json`, labelled `ready` once nothing it depends on is still open.
- A question only the owner can answer: comment on this issue with your recommendation and add `needs-decision`.

Work on a branch and open a PR; never commit to `main`.
BODY
)")"
fi

echo
echo "KICKSTART_DIR=$DIR"
echo "KICKSTART_REPO=$REPO"
echo "KICKSTART_ISSUE=$ISSUE"
