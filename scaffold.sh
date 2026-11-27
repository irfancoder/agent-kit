#!/usr/bin/env bash
# Creates a new project from the agent-kit templates.
#
#   scaffold.sh <dir> --name <kebab-name> [--title "App Title"]
#               [--variant node-postgres|hono-cloudflare] [--db hyperdrive|d1]
#               [--brief-file <path> [--reason "why this variant"]] [--check]
#
# --db applies to the hono-cloudflare variant only (default: hyperdrive).
# --brief-file puts the owner's brief in .agent/BRIEF.md, word for word, and logs the
#   variant (with --reason) in DECISIONS.md and the run in PROGRESS.md.
# --check validates the options and the machine, then exits without creating anything.
set -euo pipefail

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_VERSION="$(cat "$KIT_DIR/VERSION")"

usage() {
  sed -n '2,/^set /{/^#/s/^# \{0,1\}//p;}' "$0"
  exit "${1:-2}"
}
die() { echo "scaffold: $*" >&2; exit 1; }

DIR="" NAME="" TITLE="" VARIANT="node-postgres" DB="" BRIEF="" REASON="" CHECK=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) NAME="${2:-}"; shift 2 ;;
    --title) TITLE="${2:-}"; shift 2 ;;
    --variant) VARIANT="${2:-}"; shift 2 ;;
    --db) DB="${2:-}"; shift 2 ;;
    --brief-file) BRIEF="${2:-}"; shift 2 ;;
    --reason) REASON="${2:-}"; shift 2 ;;
    --check) CHECK=1; shift ;;
    -h|--help) usage 0 ;;
    -*) die "unknown option $1" ;;
    *) [[ -z "$DIR" ]] || die "only one <dir> allowed"; DIR="$1"; shift ;;
  esac
done

[[ -n "$DIR" ]] || usage
[[ -n "$NAME" ]] || die "--name is required"
[[ "$NAME" =~ ^[a-z][a-z0-9]*(-[a-z0-9]+)*$ ]] || die "--name must be kebab-case (for example budget-tracker)"
[[ "$NAME" != "kitapp" ]] || die "--name can't be the template placeholder 'kitapp'"
[[ ${#NAME} -le 50 ]] || die "--name must be 50 characters or fewer"
[[ -e "$DIR" ]] && die "$DIR already exists"
case "$VARIANT" in
  node-postgres) [[ -z "$DB" ]] || die "--db only applies to --variant hono-cloudflare" ;;
  hono-cloudflare) DB="${DB:-hyperdrive}"; [[ "$DB" == hyperdrive || "$DB" == d1 ]] || die "--db must be hyperdrive or d1" ;;
  *) die "--variant must be node-postgres or hono-cloudflare" ;;
esac
if [[ -z "$TITLE" ]]; then
  # budget-tracker -> Budget Tracker
  TITLE="$(echo "$NAME" | tr '-' ' ' | awk '{for (i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1')"
fi
# The title lands inside TS and JSON string literals.
[[ "$TITLE" != *$'\n'* && "$TITLE" != *\'* && "$TITLE" != *'"'* && "$TITLE" != *'\'* ]] || die "--title can't contain quotes, backslashes or newlines"

[[ -z "$BRIEF" || -s "$BRIEF" ]] || die "--brief-file must name a non-empty file"

# The machine: the tools, and the versions the template declares in its package.json.
for cmd in git pnpm node rsync; do command -v "$cmd" >/dev/null || die "$cmd is not installed"; done
node -e '
  const pkg = require(process.argv[1]);
  const need = pkg.engines.node.replace(/[^0-9.]/g, "").split(".").map(Number);
  const have = process.versions.node.split(".").map(Number);
  if (have[0] < need[0] || (have[0] === need[0] && have[1] < (need[1] ?? 0)))
    { console.error(`Node.js ${pkg.engines.node} is needed (found ${process.version})`); process.exit(1); }
  const pnpmMajor = pkg.packageManager.split("@")[1].split(".")[0];
  if (process.argv[2].split(".")[0] !== pnpmMajor)
    { console.error(`pnpm ${pnpmMajor} is needed (found ${process.argv[2]})`); process.exit(1); }
' "$KIT_DIR/templates/shared/package.json" "$(pnpm --version)" || die "wrong tool version"
# Variants with a local database run it in Docker.
if [[ -f "$KIT_DIR/templates/$VARIANT/base/docker-compose.yml" || -f "$KIT_DIR/templates/$VARIANT/db-$DB/docker-compose.yml" ]]; then
  docker info >/dev/null 2>&1 || die "Docker isn't running (the project's database needs it)"
fi
[[ $CHECK == 0 ]] || exit 0

echo "Scaffolding $NAME ($VARIANT${DB:+, $DB}) into $DIR"
mkdir -p "$DIR"
DIR="$(cd "$DIR" && pwd)"

copy() { rsync -a --exclude node_modules --exclude .turbo --exclude dist "$1/" "$DIR/"; }
copy "$KIT_DIR/templates/shared"
copy "$KIT_DIR/templates/$VARIANT/base"
[[ -z "$DB" ]] || copy "$KIT_DIR/templates/$VARIANT/db-$DB"

# Replace the placeholder tokens in paths (deepest first), then in file contents.
find "$DIR" -depth -name '*kitapp*' -not -path '*/packages/e2e/.e2e/cache/*' | while read -r path; do
  mv "$path" "$(dirname "$path")/$(basename "$path" | sed "s/kitapp/$NAME/g")"
done
# Title first: it is the only token with a capital letter.
# The e2e replay cache is keyed by fixed ids and is left untouched.
grep -rlI --exclude-dir=.git -e 'kitapp' -e 'Kit App' "$DIR" | grep -v '/packages/e2e/.e2e/cache/' | while read -r file; do
  TITLE="$TITLE" NAME="$NAME" perl -pi -e 's/Kit App/$ENV{TITLE}/g; s/kitapp/$ENV{NAME}/g' "$file"
done

cd "$DIR"
cp .env.example .env
git init -q -b main
pnpm install
pnpm exec oxfmt >/dev/null
if [[ -n "$BRIEF" ]]; then
  today="$(date +%F)"
  { printf '# Brief\n\n<!-- The owner'"'"'s brief, word for word. Received %s. -->\n\n' "$today"; cat "$BRIEF"; } > .agent/BRIEF.md
  echo "$today — variant: $VARIANT${DB:+ with $DB} — ${REASON:-the default}" >> .agent/DECISIONS.md
  echo "$today | lead | kickstart | scaffolded via agent-kit $KIT_VERSION with the brief | Planner: GOAL, SPEC and feature list" >> .agent/PROGRESS.md
fi
git add -A
git commit -q -m "chore: scaffold via agent-kit $KIT_VERSION"

cat <<NEXT

Done: $DIR ($TITLE)

Next steps:
  cd $DIR
  ./.agent/init.sh          # install, start the database and dev servers, wait for /healthz
  pnpm --dir packages/e2e exec e2e-web install chromium   # once per machine: the e2e browser

Then read AGENTS.md. Work on a branch (feat/<id>), never on main.
NEXT
