# Hackathon — Contesto di progetto

## Regola d'oro dell'evento
> **Conta più il COME che il risultato finale.** La giuria valuta architettura, approccio,
> uso degli agenti e processo di sviluppo. Ogni decisione non ovvia va tracciata in
> `docs/decisioni.md` (1 riga: cosa, perché, alternativa scartata).

## Vincoli
- **Durata: 5 ore.** Ottimizza per velocità di consegna, non per completezza.
  Preferisci sempre: funzionante e dimostrabile > elegante e incompleto.
- **Team: 2 persone.** Lavorate su branch separati, merge su `main` frequenti.
- **Output atteso:** prototipo web app + presentazione.

## Tematiche (una o più)
1. Accessibilità digitale
2. Educazione finanziaria
3. Educazione digitale inclusiva

Tutte e tre condividono lo stesso requisito trasversale: **l'accessibilità non è
opzionale, è il criterio di qualità principale**. Ogni componente UI nasce accessibile.

## Struttura del repository
| Cartella | Contenuto |
|---|---|
| `app/` | Web app — Vite + React 19 + TypeScript + Tailwind |
| `agents/` | Agenti Claude (Agent SDK TypeScript), prompt e catene |
| `backend/` | Supabase self-hosted su Podman + eventuali funzioni server |
| `presentazione/` | Deck Reveal.js con tema brand Accenture |
| `docs/` | Decisioni architetturali, note, brief |
| `.claude/` | Agenti, skill e comandi condivisi col team |

## Stack e comandi
```bash
npm run dev        # app su http://localhost:5173
npm run present    # deck su http://localhost:8000
npm run db:up      # Supabase self-hosted (Podman, dentro WSL)
npm run db:down    # stop Supabase
npm run check      # typecheck + lint + build (prima di ogni push)
```

## Convenzioni di codice
- **TypeScript strict.** Niente `any`: se il tipo è ignoto usa `unknown` e restringi.
- **Componenti**: funzionali, un componente per file, named export.
- **Stile**: solo utility Tailwind. Niente CSS inline, niente file CSS per componente.
- **Naming**: componenti `PascalCase.tsx`, hook `useCamelCase.ts`, utility `camelCase.ts`.
- **Commenti**: solo dove il *perché* non è deducibile dal codice. Niente commenti ovvi.
- **Import**: alias `@/` punta a `app/src/`.

## Accessibilità — requisiti non negoziabili (WCAG 2.2 AA)
Ogni componente prodotto deve rispettare:
- HTML semantico prima di tutto (`<button>`, non `<div onClick>`).
- Contrasto minimo **4.5:1** per testo normale, **3:1** per testo grande e componenti UI.
- Ogni elemento interattivo è raggiungibile e usabile da **tastiera**, con focus visibile.
- Ogni immagine ha `alt`; quelle decorative hanno `alt=""`.
- I form hanno `<label>` associate; gli errori sono annunciati (`aria-live`, `role="alert"`).
- Target touch minimo **24x24 px** (WCAG 2.2).
- Rispetta `prefers-reduced-motion` per ogni animazione.
- Testo ridimensionabile fino al 200% senza perdita di contenuto.

Prima di dichiarare finita una UI, lancia l'agente `a11y-auditor`.

## Brand Accenture (per UI e presentazione)
- **Viola primario** `#A100FF` — colore d'accento, mai per testo piccolo su bianco
- **Nero** `#000000` — testo e sfondi
- **Bianco** `#FFFFFF` — sfondi e testo su scuro
- **Viola scuro** `#7500C0` — hover/stati attivi, contrasto AA su bianco
- **Grigi**: `#F3F3F3` (superfici), `#767676` (testo secondario su bianco), `#5F5F5F` (testo secondario su superficie grigia)
- Tipografia: sans-serif pulita (Graphik → fallback Inter / system-ui)
- Stile: molto spazio bianco, forme squadrate, accento viola usato con parsimonia

> **Contrasti misurati** (con `node .claude/skills/a11y-check/contrast.mjs`):
> `#A100FF` su bianco = 5.3:1 ✅ AA · `#7500C0` su bianco = 8.34:1 ✅ AAA
>
> Le due combinazioni da evitare:
> - `#A100FF` su **nero** = 3.96:1 ❌ — sul fondo scuro il testo di lettura va bianco,
>   il viola solo per titoli grandi ed elementi grafici
> - `#767676` su `#F3F3F3` = 4.09:1 ❌ — dentro le card usa `#5F5F5F` (5.75:1)

## Workflow git (team da 2)
- Branch: `feat/<nome-breve>`, `fix/<nome-breve>`
- Commit piccoli e frequenti, messaggio in italiano all'imperativo: `aggiungi form iscrizione`
- Prima del push: `npm run check`
- Merge su `main` con `--no-ff`

## Cosa NON fare
- Non aggiungere dipendenze pesanti senza motivo: ogni `npm install` costa tempo di build.
- Non rifattorizzare codice che funziona: 5 ore.
- Non scrivere test se non per logica di dominio critica (calcoli finanziari, parsing).
- Non inseguire il pixel-perfect: la giuria guarda il processo.

## Il sistema di agenti

Tre livelli, con gradi diversi di autonomia.

### 1. Hook — automazione deterministica

Scattano sempre, senza che nessuno decida di invocarli. Sono il livello più affidabile.

| Quando | Cosa fa |
|---|---|
| Dopo ogni modifica a un `.tsx` | Blocca 5 violazioni di accessibilità certe |
| Prima di ogni `git commit` | Blocca il commit se in stage c'è una credenziale |
| A fine turno | Esegue il typecheck; se fallisce, il turno non si chiude |

Codice in `.claude/hooks/`. Per disattivarne uno, togli la voce da `.claude/settings.json`.

### 2. Agenti — esecutori specializzati

| Agente | Compito |
|---|---|
| `feature-dev` | Funzionalità end-to-end: dati, logica, interfaccia, commit |
| `ui-builder` | Componenti React accessibili |
| `supabase-dev` | Schema, policy RLS, migrazioni |
| `a11y-auditor` | Audit WCAG 2.2 AA |
| `edu-content` | Testi e microcopy in linguaggio semplice |
| `deck-builder` | Slide della presentazione |

Tutti possono invocare skill in autonomia.

### 3. Skill — conoscenza richiamabile

Di progetto: `accenture-brand`, `a11y-check`, `demo-ready`, `create-readme`.

Da [mattpocock/skills](https://github.com/mattpocock/skills): `codebase-design`,
`diagnosing-bugs`, `code-review`, `prototype`, `research`, `tdd`,
`resolving-merge-conflicts`, più `implement`, `triage`, `handoff`, `ask-matt`.

> Le ultime quattro hanno `disable-model-invocation: true`: sono **comandi manuali**,
> non si auto-invocano. È una scelta deliberata dell'autore — guidano flussi lunghi il
> cui inizio deve decidere una persona. Lanciale con `/implement`, `/triage`, `/handoff`,
> `/ask-matt`. Le altre il modello le sceglie da sé.

`/ask-matt` è il router: se non sai quale skill serve, chiedilo a lui.

### Come si lavora, in pratica

```
/kickoff <idea>        inquadra, decide, crea il branch e lo scheletro
  → feature-dev        costruisce in autonomia fino al commit
     ├─ codebase-design   se la forma del modulo è in dubbio
     ├─ prototype         se serve vedere un comportamento girare
     ├─ diagnosing-bugs   se qualcosa si rompe
     └─ code-review       prima di committare
/audit                 audit di accessibilità e correzione dei bloccanti
/demo                  checklist dell'ultima ora
```

Se un flusso sembra troppo cerimonioso per il tempo che resta, saltalo: 5 ore.
