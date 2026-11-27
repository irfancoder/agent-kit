#!/usr/bin/env bash
# One command from a fresh clone: install dependencies, start the local database,
# start the api and web dev servers in the background, and wait for
# /healthz. Idempotent: run it again and it reuses whatever is already running.
set -euo pipefail
cd "$(dirname "$0")/.."

[[ -f .env ]] || cp .env.example .env
set -a; source .env; set +a
API="http://${HOST:-127.0.0.1}:${PORT:-3001}"

pnpm install --frozen-lockfile
# Postgres variants run it in Docker; D1 needs nothing here.
if [[ -f docker-compose.yml ]]; then docker compose up -d --wait postgres; fi

mkdir -p .agent/logs
if curl -sf "$API/healthz" >/dev/null; then
  echo "Dev servers already running."
else
  nohup pnpm dev > .agent/logs/dev.log 2>&1 &
  echo $! > .agent/logs/dev.pid
  echo "Started dev servers (log: .agent/logs/dev.log, stop: kill \$(cat .agent/logs/dev.pid))."
fi

for _ in $(seq 1 120); do
  if curl -sf "$API/healthz" >/dev/null; then
    echo "Ready: web http://127.0.0.1:${WEB_PORT:-3000}  api $API  docs $API/docs"
    exit 0
  fi
  sleep 1
done
echo "init.sh: the api did not answer $API/healthz within 2 minutes. See .agent/logs/dev.log" >&2
exit 1
