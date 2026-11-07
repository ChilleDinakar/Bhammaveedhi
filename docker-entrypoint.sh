#!/bin/sh
set -e

# If Fly.io persistent volume is mounted at /data:
if [ -d "/data" ]; then
  # Initialize SQLite database if not present on volume
  if [ ! -f "/data/custom.db" ]; then
    echo "Initializing database in persistent volume..."
    if [ -f "/app/db-init/custom.db" ]; then
      cp /app/db-init/custom.db /data/custom.db
    else
      bun run prisma db push
      bun run scripts/seed.ts || true
    fi
  fi
  export DATABASE_URL="file:/data/custom.db"

  # Persistent uploads
  mkdir -p /data/uploads
  if [ -d "/app/public/uploads" ]; then
    cp -rn /app/public/uploads/* /data/uploads/ 2>/dev/null || true
    rm -rf /app/public/uploads
  fi
  ln -sfn /data/uploads /app/public/uploads
fi

exec "$@"
