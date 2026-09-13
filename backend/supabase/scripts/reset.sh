#!/usr/bin/env bash
# Ferma lo stack ED ELIMINA tutti i dati, poi riparte da zero.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_comune.sh"
rilancia_in_wsl_se_serve "$@"

cd "$(dirname "${BASH_SOURCE[0]}")/.."
COMPOSE="$(trova_compose)"

echo "Questa operazione CANCELLA tutti i dati del database locale."
read -r -p "Confermi? [scrivi: si] " risposta
if [ "$risposta" != "si" ]; then
  echo "Annullato."
  exit 0
fi

$COMPOSE --env-file .env down -v
podman volume rm supabase_db-data 2>/dev/null || true
echo "✓ dati eliminati. Riavvio..."
exec bash "$(dirname "${BASH_SOURCE[0]}")/up.sh"
