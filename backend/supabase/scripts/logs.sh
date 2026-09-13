#!/usr/bin/env bash
# Mostra i log dei container. Passa il nome di un servizio per filtrare:
#   npm run db:logs -- auth
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_comune.sh"
rilancia_in_wsl_se_serve "$@"

cd "$(dirname "${BASH_SOURCE[0]}")/.."
COMPOSE="$(trova_compose)"

if [ $# -gt 0 ]; then
  exec $COMPOSE --env-file .env logs -f --tail 100 "$@"
fi
exec $COMPOSE --env-file .env logs -f --tail 50
