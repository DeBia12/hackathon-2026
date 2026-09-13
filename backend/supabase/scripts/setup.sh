#!/usr/bin/env bash
# Punto di ingresso per l'installazione di Podman: funziona sia da Windows
# (Git Bash / PowerShell via npm) sia già dentro WSL.
#
#   npm run db:setup
set -euo pipefail

QUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Già dentro WSL: esegui direttamente.
if grep -qi microsoft /proc/version 2>/dev/null && command -v apt >/dev/null 2>&1; then
  exec bash "$QUI/installa-podman.sh"
fi

if ! command -v wsl.exe >/dev/null 2>&1; then
  echo "WSL non è disponibile su questo sistema." >&2
  echo "Installa Podman manualmente: vedi backend/supabase/README.md" >&2
  exit 1
fi

# Git Bash usa /c/... ; dentro WSL lo stesso disco è /mnt/c/...
PERCORSO_WSL="$(echo "$QUI" | sed 's|^/\([A-Za-z]\)/|/mnt/\l\1/|')"

echo "→ eseguo l'installazione dentro WSL (Ubuntu)"
exec wsl.exe -d Ubuntu -- bash "$PERCORSO_WSL/installa-podman.sh"
