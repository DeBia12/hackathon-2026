# Hackathon — Contesto di progetto

## Regola d'oro dell'evento
> **Conta più il COME che il risultato finale.** La giuria valuta architettura, approccio,
> uso degli agenti e processo di sviluppo. Ogni decisione non ovvia va tracciata in
> `docs/decisioni.md` (1 riga: cosa, perché, alternativa scartata).

## La consegna
> Testo integrale e vincolante: [`docs/brief-challenge.md`](docs/brief-challenge.md).
>
> Soluzione di **agentic coding** per l'**educazione alla finanza personale di base**.
> Va scelto **uno** scenario preciso, serve una **capability software concreta**
> (non solo testi riscritti) e tre deliverable: *User Difficulty Statement*,
> *Before/After Simplicity Evidence*, *Risk & Clarity Note*.
>
> **Vietato**: raccomandazioni di investimento, consulenza personalizzata, indicazioni
> su cosa comprare/vendere/scegliere. L'app spiega e calcola, non suggerisce.

## Vincoli
- **Durata: 5 ore.** Ottimizza per velocità di consegna, non per completezza.
  Preferisci sempre: funzionante e dimostrabile > elegante e incompleto.
- **Team: 2 persone.** Lavorate su branch separati, merge su `main` frequenti.
- **Output atteso:** prototipo web app + presentazione.

## Tematiche
La consegna fissa il tema principale — **educazione finanziaria**. Le altre due restano
criteri di qualità trasversali, non alternative:
1. **Educazione finanziaria** — il tema della challenge
2. Accessibilità digitale — requisito di qualità, WCAG 2.2 AA
3. Educazione digitale inclusiva — linguaggio semplice, zero prerequisiti

L'**accessibilità non è opzionale**: è il criterio di qualità principale.
Ogni componente UI nasce accessibile.

## Struttura del repository
| Cartella | Contenuto |
|---|---|
| `app/` | Web app — Vite + React 19 + TypeScript + Tailwind |
| `agents/` | Tutto l'agentico: contiene `.claude/` |
| `backend/` | Supabase self-hosted su Podman + eventuali funzioni server |
| `presentation/` | Deck Reveal.js con tema brand Accenture |
| `docs/` | Decisioni architetturali, note, brief |
| `agents/.claude/` | Subagent, skill, hook e comandi slash |

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

Prima di dichiarare finita una UI, lancia l'agente `revisore-accessibilita`.

## Brand Accenture (per UI e presentazione)

> Riferimento completo, con font, animazioni e componenti:
> [`agents/.claude/skills/accenture-brand/SKILL.md`](agents/.claude/skills/accenture-brand/SKILL.md).
> I valori sono **misurati dal sito reale**, non stimati.

- **Viola primario** `#A100FF` — riempimenti, grafica, il segno `>`
- **Viola di testo** `#7500C0` su fondo **chiaro** · `#BE82FF` su fondo **scuro**
- **Nero** `#000000` e **Bianco** `#FFFFFF`
- **Grigi**: `#F1F1EF` (superfici, **caldo**), `#5F5F5F` (testo secondario su chiaro),
  `#A2A2A0` (testo secondario su scuro), `#E3E3DF` (bordi)
- **Tipografia**: **due** famiglie — **Graphik** (400/500/600) per tutto, **GT Sectra Fine**
  (300, serif) per la voce editoriale. I file sono in `app/public/fonts/`.
- **Titoli**: spaziatura negativa (da −0.02em in giù), peso massimo **600**. Mai `700`.
- **Movimento**: una sola curva, `cubic-bezier(0.85, 0, 0, 1)` a **550ms**.
- **Forme**: squadrate, raggio **0**. Niente ombre. Molto spazio bianco.

> **Contrasti misurati** (con `node agents/.claude/skills/accessibilita/contrast.mjs`):
> `#A100FF` su bianco = 5.3:1 ✅ AA · `#7500C0` su bianco = 8.34:1 ✅ AAA
> `#BE82FF` su nero = 7.83:1 ✅ AAA · `#5F5F5F` su bianco = 6.39:1 ✅ AA
>
> Le due combinazioni da evitare:
> - `#A100FF` su **nero** = 3.96:1 ❌ — per il testo su scuro usa `#BE82FF`,
>   il viola pieno solo per riempimenti e grafica
> - `#A2A2A0` su **bianco** = 2.56:1 ❌ — è il grigio dei fondi scuri;
>   su chiaro usa `#5F5F5F`, che regge sia bianco sia `#F1F1EF`

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
| Dopo ogni modifica a un file UI | Passa il file alle 61 regole del detector `impeccable` |
| Prima di ogni `git commit` | Blocca il commit se in stage c'è una credenziale |
| A fine turno | Esegue il typecheck; se fallisce, il turno non si chiude |

Codice in `agents/.claude/hooks/`. Per disattivarne uno, togli la voce da `agents/.claude/settings.json`.

### 2. Agenti — esecutori specializzati

| Agente | Compito |
|---|---|
| `ui-builder` | Componenti React accessibili |
| `supabase-dev` | Schema, policy RLS, migrazioni |
| `revisore-accessibilita` | Audit WCAG 2.2 AA |
| `edu-content` | Testi e microcopy in linguaggio semplice |
| `deck-builder` | Slide della presentazione |
| `matt-implementer` | Esegue **un** ticket in contesto fresco, con TDD dove serve |
| `matt-reviewer` | Rivede codice che non ha scritto |
| `impeccable-*` | Quattro ausiliari della skill `impeccable`: asset, DESIGN.md, revisione finale, micro-edit |

Tutti possono invocare skill in autonomia.

### 3. Skill — conoscenza richiamabile

Di progetto: `accenture-brand`, `accessibilita`, `demo-ready`, `create-readme`.

Di design, installate da terzi:
- [`impeccable`](https://github.com/pbakaus/impeccable) — 23 comandi di design (`/impeccable audit`,
  `critique`, `polish`, `typeset`, `layout`, `animate`, `clarify`…) più 61 regole
  deterministiche contro gli anti-pattern del frontend generato da AI. Il motore è un
  binario in `~/.impeccable/bin/`, scaricato al primo uso: nessuna dipendenza npm.
- [`apple-design`](https://github.com/dickwu/apple-design-skill) — 122 pagine delle Human
  Interface Guidelines Apple. Utile per le decisioni di interazione e gerarchia; il
  **look** resta quello di `accenture-brand`, che vince su ogni conflitto di stile.

Da [mattpocock/skills](https://github.com/mattpocock/skills), il flusso completo:
`grill-with-docs`, `grilling`, `domain-modeling`, `to-spec`, `to-tickets`,
`implement`, `tdd`, `code-review`, `codebase-design`, `prototype`,
`diagnosing-bugs`, `research`, `triage`, `handoff`, `resolving-merge-conflicts`,
`ask-matt`, `setup-matt-pocock-skills`.

> Le ultime quattro hanno `disable-model-invocation: true`: sono **comandi manuali**,
> non si auto-invocano. È una scelta deliberata dell'autore — guidano flussi lunghi il
> cui inizio deve decidere una persona. Lanciale con `/implement`, `/triage`, `/handoff`,
> `/ask-matt`. Le altre il modello le sceglie da sé.

`/ask-matt` è il router: se non sai quale skill serve, chiedilo a lui.

### `/buildmatt` — l'orchestratore

Porta il lavoro dall'idea alla consegna, seguendo il flusso di Matt Pocock.

```
0. avvio       branch, brief, decisione architetturale        ← come /kickoff
1. grilling    intervista per affilare l'idea  (con l'utente)
2. bivio       sta in una sessione, o va spezzato?
3. piano       specifica → ticket con le loro dipendenze
4. build       un subagent per ticket, sulla frontiera
5. verifica    revisione + audit accessibilità, in parallelo  ← come /audit
6. consegna    check, controllo segreti, commit, push         ← come /ship
```

```
/buildmatt <cosa costruire>     ciclo completo
/buildmatt <cosa> --rapido      salta grilling e specifica, per lavori già chiari
/buildmatt --solo-piano         si ferma ai ticket
/buildmatt --solo-build         parte da ticket che esistono già
/buildmatt --senza-consegna     costruisce e verifica, non pubblica
```

`/kickoff`, `/audit` e `/ship` **restano usabili da soli**: dentro `/buildmatt` sono
incorporati perché sono passaggi naturali del ciclo, non perché siano stati assorbiti.
Per un commit veloce a metà lavoro usi `/ship`, non rilanci l'orchestratore.

`/demo` resta **fuori**: è la procedura dell'ultima ora, si esegue una volta sola su
tutto il lavoro della giornata, non alla fine di ogni feature.

Due regole strutturali, che vengono dal metodo e non sono negoziabili:

1. **La pianificazione sta in una finestra sola.** Grilling, specifica e ticket si
   costruiscono l'uno sull'altro: non compattare il contesto prima che i ticket esistano.
2. **Ogni ticket parte da zero**, in un `matt-implementer` dedicato. Il contesto fresco
   è l'equivalente di un `/clear`. La revisione gira in un agente separato: chi ha
   appena scritto del codice tende ad approvarlo.

La frontiera dei ticket si calcola, non si deduce a occhio:

```bash
npm run frontiera
```

Mostra quali ticket possono partire subito (un subagent ciascuno), quali aspettano e
quali dichiarano bloccanti inesistenti.

Due limiti da conoscere:
- **Il grilling non è delegabile.** È un'intervista in cui le decisioni sono dell'utente.
- **Subagent in parallelo solo su file disgiunti**, altrimenti si sovrascrivono.
  Nel dubbio, sequenza.

Per mezz'ora di lavoro usa `--rapido`: imporre la cerimonia completa a un lavoro
piccolo è il modo più veloce per far abbandonare un metodo.

### Come si lavora, in pratica

```
/kickoff <idea>        inquadra, decide, crea il branch e lo scheletro
  → matt-implementer   costruisce in contesto separato fino al commit
     ├─ codebase-design   se la forma del modulo è in dubbio
     ├─ prototype         se serve vedere un comportamento girare
     ├─ diagnosing-bugs   se qualcosa si rompe
  → matt-reviewer      rivede senza aver scritto
/audit                 audit di accessibilità e correzione dei bloccanti
/demo                  checklist dell'ultima ora
```

Se un flusso sembra troppo cerimonioso per il tempo che resta, saltalo: 5 ore.
