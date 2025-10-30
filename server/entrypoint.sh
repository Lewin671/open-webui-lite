#!/bin/sh

set -e

echo "[entrypoint] Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
  sleep 2
done
echo "[entrypoint] PostgreSQL is ready."

if [ -x "./migrate" ]; then
  echo "[entrypoint] Running database migrations..."
  ./migrate || { echo "[entrypoint] Migration failed"; exit 1; }
else
  echo "[entrypoint] migrate binary not found; skipping migrations"
fi

if [ -x "./seed" ]; then
  echo "[entrypoint] Running seed data..."
  ./seed || { echo "[entrypoint] Seeding failed"; exit 1; }
else
  echo "[entrypoint] seed binary not found; skipping seed"
fi

echo "[entrypoint] Starting API server..."
exec ./main


