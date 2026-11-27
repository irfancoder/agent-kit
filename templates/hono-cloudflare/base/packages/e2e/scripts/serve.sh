#!/usr/bin/env bash
# Started by the e2e runner (app.command in e2e.config.ts) with the web port it picked.
# Gives the api a fresh database, starts it with `wrangler dev` on a free port, then the
# web dev server in front of it. The runner stops this script when the run ends; the
# trap stops the api with it.
set -euo pipefail
export WRANGLER_SEND_METRICS=false
E2E_WEB_PORT="${1:?usage: serve.sh <web-port>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"
if [[ -f .env ]]; then set -a; source .env; set +a; fi

free_port() { node -e "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})"; }
API_PORT="$(free_port)"
WRANGLER_ARGS=(--ip 127.0.0.1 --port "$API_PORT" --inspector-port "$(free_port)")
STATE="$(mktemp -d)"

if [[ -f apps/api/scripts/e2e-db.ts ]]; then
  # Hyperdrive: a fresh database for this run, on the Postgres you provide.
  CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="$(node apps/api/scripts/e2e-db.ts \
    "${CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE:?serve.sh: set it in .env to a Postgres you provide}")"
  export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE
else
  # D1: a fresh local database in a temp state dir.
  (cd apps/api && D1_PERSIST_TO="$STATE" node scripts/db-setup.ts) >&2
fi
WRANGLER_ARGS+=(--persist-to "$STATE")

PIDS=()
stop() { kill "${PIDS[@]}" 2>/dev/null || true; rm -rf "$STATE"; }
trap stop EXIT
trap 'stop; exit 143' INT TERM

(cd apps/api && LOG_LEVEL=warn exec node_modules/.bin/wrangler dev "${WRANGLER_ARGS[@]}") >&2 &
API_PID=$!
PIDS+=("$API_PID")

for _ in $(seq 1 120); do
  curl -sf "http://127.0.0.1:$API_PORT/healthz" >/dev/null && break
  kill -0 "$API_PID" 2>/dev/null || { echo "serve.sh: the api exited during startup" >&2; exit 1; }
  sleep 0.5
done

cd apps/web
API_URL="http://127.0.0.1:$API_PORT" WEB_PORT="$E2E_WEB_PORT" node_modules/.bin/rsbuild dev &
WEB_PID=$!
PIDS+=("$WEB_PID")
wait "$WEB_PID"
