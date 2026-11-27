#!/usr/bin/env bash
# Records the template's e2e replay cache and copies it into
# templates/shared/packages/e2e/.e2e/cache, so every scaffolded project's
# pre-push hook (--strict-cache) replays agent steps without a model.
#
# Needs a model once: set ANTHROPIC_API_KEY (preferred), or E2E_AGENT=claude-code
# with a working `claude` login. Run it again after changing the example UI or tests.
set -euo pipefail
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -z "${ANTHROPIC_API_KEY:-}" && "${E2E_AGENT:-}" != "claude-code" ]]; then
  echo "record-e2e-cache: set ANTHROPIC_API_KEY, or E2E_AGENT=claude-code" >&2
  exit 1
fi
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
"$KIT_DIR/scaffold.sh" "$WORK/app" --name record-app >/dev/null
cd "$WORK/app/packages/e2e"
rm -rf .e2e/cache
echo "Recording (calls the model)…"
pnpm e2e:record
echo "Checking the recording replays with no model…"
env -u ANTHROPIC_API_KEY -u E2E_AGENT CI=1 pnpm e2e --strict-cache
DEST="$KIT_DIR/templates/shared/packages/e2e/.e2e/cache"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R .e2e/cache/. "$DEST/"
touch "$DEST/.gitkeep"
echo "Saved the replay cache to $DEST. Commit it."
