#!/usr/bin/env bash
# Apre psql sul database, o esegue quello che gli passi.
#   npm run db:psql                     → sessione interattiva
#   npm run db:psql -- -f /seed.sql     → esegue un file
#   npm run db:psql -- -c "select 1"    → esegue una query
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_comune.sh"
rilancia_in_wsl_se_serve "$@"

if [ $# -eq 0 ]; then
  exec podman exec -it supabase-db psql -U postgres -d postgres
fi
exec podman exec -i supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 "$@"
