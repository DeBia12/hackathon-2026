#!/usr/bin/env bash
# Avvia lo stack Supabase locale.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_comune.sh"
rilancia_in_wsl_se_serve "$@"

cd "$(dirname "${BASH_SOURCE[0]}")/.."
COMPOSE="$(trova_compose)"

if [ ! -f .env ]; then
  echo "Manca backend/supabase/.env — generalo con:" >&2
  echo "  node backend/supabase/scripts/genera-chiavi.mjs" >&2
  exit 1
fi

echo "→ avvio dello stack (il primo avvio scarica ~1.5 GB di immagini)"
$COMPOSE --env-file .env up -d

attendi_db

# Applica le migrazioni in ordine numerico. Sono idempotenti (create if not exists).
if compgen -G "migrations/*.sql" >/dev/null; then
  for file in $(ls migrations/*.sql | sort); do
    echo "→ migrazione: $(basename "$file")"
    podman exec -i supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 \
      -f "/migrations/$(basename "$file")" >/dev/null
  done
  echo "✓ migrazioni applicate"
fi

cat <<FINE

  Supabase è attivo.

    Studio      http://localhost:3000
    API         http://localhost:8000
    Postgres    localhost:5432  (utente postgres)

  Dati demo:  npm run db:psql -- -f /seed.sql
  Log:        npm run db:logs
  Stop:       npm run db:down

FINE
