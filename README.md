# Hackathon — ambiente di sviluppo

Ambiente pronto all'uso per un hackathon da 5 ore: web app accessibile, agenti Claude,
database locale e presentazione con brand Accenture. Tutto gira offline.

Tematiche dell'evento: accessibilità digitale, educazione finanziaria, educazione
digitale inclusiva.

> [!NOTE]
> Il criterio di valutazione dichiarato è che **conta più il come che il risultato**:
> architettura, approccio e processo di sviluppo. Per questo il repository tratta le
> decisioni (`docs/decisioni.md`) e gli agenti (`agents/.claude/agents/`) come materiale di
> progetto, non come contorno.

## Struttura

| Cartella | Contenuto |
|---|---|
| `app/` | Web app — React 19, TypeScript, Tailwind 4, Vite 8 |
| `agents/` | Tutto l'agentico: contiene `.claude/` |
| `backend/supabase/` | Supabase self-hosted su Podman — Postgres, auth, API REST |
| `presentation/` | Deck Reveal.js con tema Accenture, funziona offline |
| `docs/` | Decisioni architetturali e registro degli audit di accessibilità |
| `agents/.claude/` | Subagent, skill, hook e comandi slash |

## Requisiti

- Node.js 22+ — presente: v24
- Git
- Podman dentro WSL, solo se serve il database

## Preparazione

```bash
npm run setup                                      # dipendenze di app e agents
node backend/supabase/scripts/genera-chiavi.mjs    # crea i file .env
```

Poi inserisci la tua `ANTHROPIC_API_KEY` in `.env`.

Per il database, una volta sola — installa Podman dentro WSL e pre-scarica le
immagini dei container:

```bash
npm run db:setup
```

Ti chiederà la password di Ubuntu.

> [!IMPORTANT]
> Fai il primo `npm run db:up` **prima** dell'hackathon: scarica circa 1,5 GB di
> immagini. Sulla rete condivisa dell'evento sarebbe tempo perso.

## Comandi

```bash
npm run dev        # app                 → http://localhost:5173
npm run present    # presentazione       → http://localhost:8000
npm run db:up      # database e auth     → http://localhost:3000 (Studio)
npm run check      # lint + build, da eseguire prima di ogni push
npm run contrasto '#A100FF' '#FFFFFF'   # calcola un rapporto di contrasto
```

Il dettaglio dei comandi del database è in [`backend/supabase/README.md`](backend/supabase/README.md).

## Lavorare con gli agenti

Il repository include agenti specializzati che Claude Code usa durante lo sviluppo:

| Agente | Quando si usa |
|---|---|
| `ui-builder` | Creare componenti React accessibili con il design system |
| `revisore-accessibilita` | Verificare la conformità WCAG 2.2 AA di una schermata |
| `edu-content` | Scrivere testi e microcopy in linguaggio semplice |
| `supabase-dev` | Schema, policy RLS, migrazioni |
| `deck-builder` | Costruire le slide della presentazione |

E quattro comandi rapidi:

| Comando | Effetto |
|---|---|
| `/kickoff <idea>` | Inquadra il lavoro, registra la decisione, crea branch e scheletro |
| `/audit` | Audit di accessibilità e correzione dei problemi bloccanti |
| `/ship` | Verifica, controlla che non ci siano segreti, committa e pusha |
| `/demo` | Checklist dell'ultima ora prima della consegna |

## Accessibilità

Non è una verifica finale: è un vincolo dentro gli agenti che scrivono il codice.
I componenti in `app/src/components/ui/` nascono conformi a WCAG 2.2 AA, e i contrasti
si calcolano invece di stimarli.

```bash
npm run contrasto '#A100FF' '#000000'
```

> [!WARNING]
> Il brand ha **due viola e due grigi**, e usarli sul fondo sbagliato è l'errore più facile:
> `#A100FF` su nero dà 3.96:1 (su scuro il testo viola è `#BE82FF`, 7.83:1) e `#A2A2A0`
> su bianco dà 2.56:1 (su chiaro il grigio è `#5F5F5F`, 6.39:1).
> I dettagli sono in [`agents/.claude/skills/accenture-brand/SKILL.md`](agents/.claude/skills/accenture-brand/SKILL.md).

## Convenzioni

- Branch `feat/<nome>`, commit in italiano all'imperativo
- `npm run check` prima di ogni push
- Ogni decisione non ovvia va in `docs/decisioni.md`, una riga
- I segreti stanno solo nei file `.env`, che non vengono mai committati
