#!/usr/bin/env bash
# Builds the CLI, scaffolds every variant with it into a temp dir, runs both git hooks
# in each, and checks that no placeholder token is left. Exits non-zero on any failure.
#
#   ./selftest.sh                       # all variants
#   ./selftest.sh node-postgres         # one variant (hono-cloudflare:d1 picks a db)
#
# Needs: git, pnpm, node, docker (running), and the e2e browsers
# (pnpm --dir <project>/packages/e2e exec e2e-web install chromium).
set -euo pipefail
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VARIANTS=("$@")
[[ ${#VARIANTS[@]} -gt 0 ]] || VARIANTS=(node-postgres hono-cloudflare:hyperdrive hono-cloudflare:d1)

WORK="$(mktemp -d "${TMPDIR:-/tmp}/agent-kit-selftest.XXXXXX")"
PROJECTS=()
cleanup() {
  for p in "${PROJECTS[@]}"; do
    [[ -f "$p/docker-compose.yml" ]] && (cd "$p" && docker compose down -v >/dev/null 2>&1 || true)
  done
  if [[ "${KEEP:-}" == 1 ]]; then echo "Kept $WORK"; else rm -rf "$WORK"; fi
}
trap cleanup EXIT

free_port() { node -e "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})"; }

# Hooks must pass with no agent: point Claude Code at an empty config so it has no
# login, and a step that isn't recorded fails instead of spending the plan's usage.
export CLAUDE_CONFIG_DIR="$WORK/no-claude-login"
mkdir -p "$CLAUDE_CONFIG_DIR"
unset ANTHROPIC_API_KEY

echo "==> Building the CLI"
(cd "$KIT_DIR" && pnpm install --frozen-lockfile >/dev/null && pnpm check >/dev/null)
if ! git -C "$KIT_DIR" diff --quiet -- dist; then
  echo "    note: dist/ changed; commit it, since pnpm dlx runs it as committed"
fi

FAILED=()
for spec in "${VARIANTS[@]}"; do
  variant="${spec%%:*}"; db=""; [[ "$spec" == *:* ]] && db="${spec#*:}"
  name="selftest-${variant}${db:+-$db}"
  dir="$WORK/$name"
  PROJECTS+=("$dir")
  echo "==> $spec: scaffold"
  # node-postgres also gets a brief, as a bot passes it (stdin).
  brief=(); [[ "$variant" == node-postgres ]] && brief=(--brief-file - --reason "selftest")
  make=(node "$KIT_DIR/dist/agent-kit.mjs" "$dir" --name "$name" --variant "$variant" ${db:+--db "$db"} ${brief[@]+"${brief[@]}"} --yes)
  if ! printf 'A brief, word for word.\n' | "${make[@]}" >"$WORK/$name.log" 2>&1; then
    echo "    FAIL: scaffold (log: $WORK/$name.log)"; tail -20 "$WORK/$name.log"; FAILED+=("$spec:scaffold"); continue
  fi
  if [[ "$variant" == node-postgres ]] && ! grep -q 'A brief, word for word.' "$dir/.agent/BRIEF.md"; then
    echo "    FAIL: the brief wasn't recorded"; FAILED+=("$spec:brief")
  fi
  # Avoid clashing with anything already listening on the default ports.
  if grep -q '^POSTGRES_PORT=' "$dir/.env" 2>/dev/null; then
    pg="$(free_port)"
    perl -pi -e "s/^POSTGRES_PORT=.*/POSTGRES_PORT=$pg/; s/127\.0\.0\.1:\d+\//127.0.0.1:$pg\//" "$dir/.env"
  fi

  echo "==> $spec: leftover placeholder tokens"
  if grep -rlI --exclude-dir=node_modules --exclude-dir=.git -e kitapp -e 'Kit App' "$dir" | grep -v '/packages/e2e/.e2e/cache/'; then
    FAILED+=("$spec:tokens")
  fi
  if find "$dir" -name '*kitapp*' -not -path '*/node_modules/*' | grep .; then FAILED+=("$spec:paths"); fi

  for hook in pre-commit pre-push; do
    echo "==> $spec: $hook"
    if ! (cd "$dir" && pnpm exec lefthook run "$hook" --all-files) >"$WORK/$name.$hook.log" 2>&1; then
      echo "    FAIL: $hook (log: $WORK/$name.$hook.log)"; tail -40 "$WORK/$name.$hook.log"; FAILED+=("$spec:$hook")
    fi
  done
done

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo "selftest FAILED: ${FAILED[*]}"; KEEP=1; exit 1
fi
echo "selftest passed: ${VARIANTS[*]}"
