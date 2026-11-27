#!/usr/bin/env bash
# Records the template's e2e replay cache and copies it into
# templates/shared/packages/e2e/.e2e/cache, so every scaffolded project's
# pre-push hook (--strict-cache) replays agent steps without a model.
#
# Records on Claude Code with your `claude` login (the Claude Max plan): run `claude`
# and sign in first. Run it again after changing the example UI or tests.
set -euo pipefail
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if ! claude auth status 2>/dev/null | grep -Eq '"loggedIn": *true'; then
  echo "record-e2e-cache: Claude Code isn't signed in. Run \`claude\` and sign in with your Max account." >&2
  exit 1
fi
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
"$KIT_DIR/scaffold.sh" "$WORK/app" --name record-app >/dev/null
cd "$WORK/app/packages/e2e"
rm -rf .e2e/cache
echo "Recording (runs Claude Code on your plan)…"
pnpm e2e:record
echo "Checking the recording replays with no agent…"
NO_LOGIN="$WORK/no-claude-login"
mkdir -p "$NO_LOGIN"
CLAUDE_CONFIG_DIR="$NO_LOGIN" CI=1 pnpm e2e --strict-cache
DEST="$KIT_DIR/templates/shared/packages/e2e/.e2e/cache"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R .e2e/cache/. "$DEST/"
touch "$DEST/.gitkeep"
echo "Saved the replay cache to $DEST. Commit it."
