#!/usr/bin/env bash
# Installa Podman dentro WSL e pre-scarica le immagini di Supabase.
#
# Da eseguire UNA VOLTA, prima dell'hackathon:
#   wsl -d Ubuntu -- bash "/mnt/c/.../backend/supabase/scripts/installa-podman.sh"
#
# Chiede la password di sudo. Il download è ~1,5 GB: falla su una rete veloce.
set -euo pipefail

if [ ! -f /proc/version ] || ! grep -qi microsoft /proc/version; then
  echo "Questo script va eseguito dentro WSL, non su Windows." >&2
  echo "Apri un terminale ed esegui:  wsl -d Ubuntu" >&2
  exit 1
fi

echo "→ 1/3  installo podman e podman-compose"
sudo apt update
sudo apt install -y podman podman-compose

echo
echo "→ 2/3  verifico"
podman --version
podman-compose --version

echo
echo "→ 3/3  pre-scarico le immagini (~1,5 GB, può richiedere diversi minuti)"
immagini=(
  "docker.io/supabase/postgres:17.6.1.136"
  "docker.io/supabase/gotrue:v2.196.0"
  "docker.io/postgrest/postgrest:v14.17"
  "docker.io/supabase/postgres-meta:v0.99.0"
  "docker.io/supabase/studio:2026.09.07-sha-7996410"
  "docker.io/library/kong:2.8.1"
)

for immagine in "${immagini[@]}"; do
  echo "   • $immagine"
  podman pull "$immagine" >/dev/null
done

echo
echo "✓ Tutto pronto. Le immagini sono in cache: i prossimi avvii sono rapidi."
echo
echo "  Prossimo passo, da Windows:"
echo "    npm run db:up"
echo
