# Funzioni condivise dagli script di gestione dello stack Supabase.
# Non eseguire direttamente: viene incluso con "source".

DISTRO="${WSL_DISTRO:-Ubuntu}"

# Se podman non è raggiungibile ma siamo su Windows con WSL, rilancia lo stesso
# script dentro la distro. Così `npm run db:up` funziona da qualsiasi shell.
rilancia_in_wsl_se_serve() {
  if command -v podman >/dev/null 2>&1; then
    return 0
  fi

  if ! command -v wsl.exe >/dev/null 2>&1; then
    echo "Errore: podman non trovato e WSL non disponibile." >&2
    echo "Installa Podman: vedi backend/supabase/README.md" >&2
    exit 1
  fi

  local script_dir script_nome percorso_wsl
  script_dir="$(cd "$(dirname "${BASH_SOURCE[1]}")" && pwd)"
  script_nome="$(basename "${BASH_SOURCE[1]}")"

  # Git Bash usa /c/... ; dentro WSL lo stesso disco è /mnt/c/...
  percorso_wsl="$(echo "$script_dir" | sed 's|^/\([A-Za-z]\)/|/mnt/\L\1/|')"

  echo "→ podman non è su Windows: eseguo dentro WSL ($DISTRO)"
  exec wsl.exe -d "$DISTRO" -- bash -lc "bash \"$percorso_wsl/$script_nome\" $*"
}

# Sceglie il comando compose disponibile.
trova_compose() {
  if command -v podman-compose >/dev/null 2>&1; then
    echo "podman-compose"
  elif podman compose version >/dev/null 2>&1; then
    echo "podman compose"
  else
    echo "Errore: né podman-compose né 'podman compose' sono disponibili." >&2
    echo "Installa con: sudo apt install -y podman-compose" >&2
    exit 1
  fi
}

# Directory di backend/supabase, qualunque sia la shell di partenza.
cartella_supabase() {
  cd "$(dirname "${BASH_SOURCE[1]}")/.." && pwd
}

# Attende che Postgres risponda. Il primo avvio scarica le immagini e
# inizializza il cluster: può richiedere diversi minuti.
attendi_db() {
  local tentativi="${1:-90}"
  echo "→ attendo che il database sia pronto..."
  for ((i = 1; i <= tentativi; i++)); do
    if podman exec supabase-db pg_isready -U postgres -h localhost >/dev/null 2>&1; then
      echo "✓ database pronto"
      return 0
    fi
    sleep 2
  done
  echo "✗ il database non risponde dopo $((tentativi * 2))s." >&2
  echo "  Controlla i log con: npm run db:logs" >&2
  return 1
}
