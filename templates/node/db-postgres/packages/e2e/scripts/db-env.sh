# Sourced by serve.sh: a fresh database for this e2e run, on the Postgres you provide.
DATABASE_URL="$(node apps/api/scripts/e2e-db.ts \
  "${DATABASE_URL:?serve.sh: set DATABASE_URL in .env to a Postgres you provide}")"
export DATABASE_URL
