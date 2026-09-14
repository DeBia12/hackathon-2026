# Decisioni architetturali

> Una riga per decisione. Serve per la slide "Il nostro processo" del pitch:
> la giuria valuta il COME, e questo file è la prova di come abbiamo ragionato.
>
> Formato: **data — decisione** · *perché* · ~alternativa scartata~

---

**2026-09-13 — Vite + React + TypeScript invece di Next.js**
Con 5 ore, il dev server istantaneo e la build statica valgono più di SSR e API routes.
~Next.js scartato: overhead di setup e concetti non ripagati in un prototipo da demo.~

**2026-09-13 — Supabase self-hosted su Podman invece del cloud**
Nessun account da creare durante l'evento, nessuna dipendenza dal wifi della sede,
dati e auth completi in locale.
~Supabase cloud scartato: rischio rete. SQLite scartato: niente auth né realtime.~

**2026-09-13 — Accessibilità come vincolo di costruzione, non come verifica finale**
Gli agenti `ui-builder` e `revisore-accessibilita` incorporano WCAG 2.2 AA: i componenti nascono
conformi invece di essere corretti dopo. Con 5 ore non c'è tempo per una fase di remediation.

**2026-09-13 — Palette brand verificata con script invece che a stima**
`contrast.mjs` ha smentito due assunzioni sul viola Accenture: `#A100FF` su bianco
passa AA (5.3:1), ma su nero fallisce (3.96:1), e `#767676` su `#F3F3F3` fallisce (4.09:1).
~Stima a occhio scartata: i valori del brand sono controintuitivi.~

**2026-09-13 — Design system Accenture estratto dal sito reale, non ricostruito a mano**
La skill `accenture-brand` ora contiene token, font e componenti letti da accenture.com
via Playwright: curva di movimento `cubic-bezier(0.85,0,0,1)` a 550ms, wipe a gradiente
dei bottoni, card 300x424 senza ombra, logo animato, Graphik + GT Sectra Fine in woff2.
L'estrazione ha corretto tre errori della versione a stima: il brand usa **due** famiglie
di font (mancava il serif editoriale), il grigio di superficie è caldo `#F1F1EF` e non
`#F3F3F3`, ed esiste un viola dedicato al fondo scuro `#BE82FF` (7.83:1) che risolve il
problema del viola illeggibile su nero.
~Ricostruzione a memoria scartata: produce un risultato "ispirato a", non riconoscibile.~

**2026-09-14 — Skill di design di terze parti (`impeccable`, `apple-design`) copiate nel repo**
Installate a mano in `.claude/skills/`, non via `npx impeccable install` né `npx skills add`:
così sono versionate col progetto e il secondo membro del team le ha con un `git pull`,
senza rieseguire installer. `impeccable` porta 23 comandi di design e 61 regole
deterministiche, `apple-design` porta 122 pagine di HIG Apple.
~Installer npm scartati: installano fuori dal repo, quindi non si condividono col team.~

**2026-09-14 — Solo l'hook per-modifica di impeccable, non il passaggio profondo su Stop**
Il manifest di impeccable propone due hook: uno rapido dopo ogni Edit/Write e uno profondo
a fine turno (timeout 30s). Preso solo il primo: a fine turno c'è già il typecheck, e 30s
per turno su 5 ore di lavoro sono minuti persi. Il passaggio profondo resta a richiesta
con `/impeccable audit`.
~Entrambi gli hook scartati: raddoppiare la latenza di fine turno per un controllo
che possiamo lanciare quando serve.~

**2026-09-14 — In conflitto di stile vince `accenture-brand`, non `impeccable` né Apple HIG**
Le due skill nuove hanno opinioni estetiche proprie (impeccable: mai nero puro, sempre
tintato; Apple: raggi morbidi e materiali traslucidi) che contraddicono il brand Accenture
(nero `#000000`, raggio 0, nessuna ombra). Servono per interazione, gerarchia e
anti-pattern; la palette e le forme restano quelle del brand.
~Adozione integrale delle loro raccomandazioni scartata: produrrebbe una UI che non
sembra Accenture, e il brand è un requisito della consegna.~

**2026-09-14 — Struttura a 6 cartelle confermata: nessuna eliminata**
La consegna cita `agents/`, `app/`, `presentation/` e `.claude/`. Verificate le altre due:
`backend/` resta perché serve persistenza vera (profili e progressi, non solo stato locale);
`docs/` resta perché `decisioni.md` è l'artefatto che la regola d'oro richiede — la giuria
valuta il COME. `agents/` resta al plurale: contiene più agenti ed è già cablata ovunque.
~Repo a 3 cartelle scartato: avrebbe cancellato la prova del processo e la persistenza.~

**2026-09-14 — Riferimenti a `presentazione/` riallineati a `presentation/`**
Il commit `8ed0bae` aveva rinominato i file senza aggiornare un solo riferimento: `npm run
present`, `npm run guida` e `npm run alberatura` puntavano a una cartella inesistente, come
il permesso in `settings.json` e l'agente `deck-builder`. Sostituita solo la forma con slash
(`presentazione/`), lasciando intatta la parola italiana in prosa.
~Rename globale della stringa scartato: avrebbe corrotto i testi che parlano della presentazione.~

**2026-09-14 — `.claude/` spostata in `agents/`, codice TS degli agenti eliminato**
Scelta dell'utente: `agents/` raccoglie tutto l'agentico e `.claude/` ci sta dentro. Rimossi
`agents/src` (CLI semplificatore + catena lezione) e i suoi script npm. Riallineati 6 file di
riferimento e la profondità di `RADICE` in `genera-alberatura.mjs`.
**Costo noto e accettato:** Claude Code legge `.claude/` solo dalla radice del repo, quindi
subagent, skill, hook e comandi slash di progetto non si caricano più automaticamente.
~`.claude/` a radice scartata su richiesta esplicita, pur essendo l'unica posizione funzionante.~

---
