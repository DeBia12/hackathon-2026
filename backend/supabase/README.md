# Supabase self-hosted (Podman)

Istanza Supabase locale: database, autenticazione e API REST, senza account cloud
e senza dipendere dalla rete della sede.

## Cosa c'è dentro

| Servizio | Porta | Ruolo |
|---|---|---|
| `db` | 5432 | Postgres 17 con le estensioni Supabase |
| `auth` | — | GoTrue: registrazione e login |
| `rest` | — | PostgREST: API automatica sulle tabelle |
| `meta` | — | Introspezione dello schema (serve a Studio) |
| `studio` | 3000 | Interfaccia web di amministrazione |
| `gateway` | 8000 | Kong: unico endpoint per `/auth/v1` e `/rest/v1` |

Rispetto allo stack Supabase completo mancano realtime, storage, edge functions,
supavisor e analytics: non servono al prototipo e triplicano il tempo di avvio.
Se durante l'hackathon serve lo storage, si aggiunge al `docker-compose.yml`.

## Prerequisito: installare Podman

Podman gira **dentro WSL**, non su Windows. Apri un terminale ed esegui:

```bash
wsl -d Ubuntu
sudo apt update && sudo apt install -y podman podman-compose
```

Ti verrà chiesta la password di Ubuntu. Verifica con `podman --version`.

Non serve altro: gli script rilevano da soli di essere su Windows e si rilanciano
dentro WSL.

## Avvio

```bash
node backend/supabase/scripts/genera-chiavi.mjs   # una volta sola
npm run db:up                                     # primo avvio: ~5-10 minuti
npm run db:psql -- -f /seed.sql                   # dati demo
```

Dopo il primo avvio le immagini restano in cache: i successivi richiedono ~30 secondi.

> **Fallo prima dell'hackathon.** Il download delle immagini è ~1.5 GB: durante
> l'evento, sulla rete condivisa, è tempo perso.

## Comandi

| Comando | Effetto |
|---|---|
| `npm run db:up` | Avvia lo stack e applica le migrazioni |
| `npm run db:down` | Ferma i container, **conserva** i dati |
| `npm run db:reset` | Cancella tutti i dati e riparte da zero (chiede conferma) |
| `npm run db:psql` | Sessione psql interattiva |
| `npm run db:psql -- -f /seed.sql` | Esegue un file SQL |
| `npm run db:logs` | Log di tutti i servizi |
| `npm run db:logs -- auth` | Log di un solo servizio |

## Migrazioni

I file in `migrations/` vengono applicati in ordine numerico a ogni `db:up`.
Scrivili **idempotenti** (`create table if not exists`, `drop policy if exists`),
così rilanciarli non rompe niente.

```bash
# nuova migrazione
echo "..." > backend/supabase/migrations/002_nome.sql
npm run db:psql -- -f /migrations/002_nome.sql
```

## Chiavi

`scripts/genera-chiavi.mjs` crea due file, entrambi in `.gitignore`:

- `backend/supabase/.env` — segreti dei container, inclusa la **service_role key**
- `.env` (radice) — variabili per app e agenti, solo la **anon key**

La `anon key` rispetta le policy RLS ed è quella che va nel browser.
La `service_role key` **bypassa RLS**: non deve mai comparire in codice con prefisso
`VITE_`, né finire in un commit.

## Problemi frequenti

**Il frontend riceve `[]` senza errori**
RLS attiva senza una policy di `select`. È la causa nel 90% dei casi: controlla le
policy della tabella, non la query.

**`address already in use` sulla porta 5432**
C'è un altro Postgres attivo. Cambia `POSTGRES_PORT` in `backend/supabase/.env`.

**Il primo avvio sembra bloccato**
Sta scaricando le immagini. Verifica con `npm run db:logs`.

**`permission denied` sui volumi**
Succede se si prova a montare la data directory di Postgres da `/mnt/c`.
Per questo il compose usa un volume Podman nativo (`db-data`): non cambiarlo.

**I container non partono dopo un riavvio di Windows**
WSL si è spento. Rilancia `npm run db:up`.
