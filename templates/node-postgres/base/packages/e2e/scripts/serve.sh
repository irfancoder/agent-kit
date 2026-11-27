#!/usr/bin/env bash
# Started by the e2e runner (app.command in e2e.config.ts) with the web port it picked.
# Resets the e2e database on the Postgres in DATABASE_URL, starts the api on a free port,
# then the web dev server in front of it. The runner stops this script when the run ends;
# the trap stops the api with it.
set -euo pipefail
E2E_WEB_PORT="${1:?usage: serve.sh <web-port>}"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

# Settings from .env (copied from .env.example on scaffold), if present.
if [[ -f .env ]]; then set -a; source .env; set +a; fi
: "${DATABASE_URL:?serve.sh: set DATABASE_URL in .env to a Postgres you provide}"
DATABASE_URL="$(node apps/api/scripts/e2e-db.ts "$DATABASE_URL")"

free_port() { node -e "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})"; }
API_PORT="$(free_port)"
export HOST=127.0.0.1 PORT="$API_PORT" LOG_LEVEL=warn DATABASE_URL

PIDS=()
stop() { kill "${PIDS[@]}" 2>/dev/null || true; }
trap stop EXIT
trap 'stop; exit 143' INT TERM

node apps/api/src/server.ts &
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
