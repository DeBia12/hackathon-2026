#!/usr/bin/env bash
# Ferma lo stack. I dati restano nel volume db-data.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_comune.sh"
rilancia_in_wsl_se_serve "$@"

cd "$(dirname "${BASH_SOURCE[0]}")/.."
COMPOSE="$(trova_compose)"

$COMPOSE --env-file .env down
echo "✓ stack fermato (i dati sono conservati — per cancellarli: npm run db:reset)"
