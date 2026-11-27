#!/usr/bin/env bash
# Creates a new project from the agent-kit templates.
#
#   scaffold.sh <dir> --name <kebab-name> [--title "App Title"]
#               [--variant node-postgres|hono-cloudflare] [--db hyperdrive|d1]
#
# --db applies to the hono-cloudflare variant only (default: hyperdrive).
set -euo pipefail

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_VERSION="$(cat "$KIT_DIR/VERSION")"

usage() {
  sed -n '2,7p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-2}"
}
die() { echo "scaffold: $*" >&2; exit 1; }

DIR="" NAME="" TITLE="" VARIANT="node-postgres" DB=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) NAME="${2:-}"; shift 2 ;;
    --title) TITLE="${2:-}"; shift 2 ;;
    --variant) VARIANT="${2:-}"; shift 2 ;;
    --db) DB="${2:-}"; shift 2 ;;
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

for cmd in git pnpm node rsync; do command -v "$cmd" >/dev/null || die "$cmd is not installed"; done

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
