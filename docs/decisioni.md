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

**2026-09-14 — Persistenza su `localStorage`, Supabase abbandonato in corsa**
Alle 11:24, con la consegna alle 14:45, la verifica dell'ambiente ha mostrato che Podman
non è installato né su Windows né in WSL: servivano `apt install podman` più ~1.5 GB di
immagini (postgres, gotrue, postgrest, postgres-meta, studio, kong) sul wifi della sede.
Un terzo del tempo residuo, con esito incerto, per un requisito che la wiki mette in
STRETCH — chiede solo «persistent state during the user session». Scelta dell'utente
dopo aver visto il costo.
~Supabase self-hosted scartato: il download non entra nel tempo. Doppio binario
(interfaccia astratta + pull in background) scartato: il piano B costava comunque
20 minuti di adapter per un valore che la consegna non richiede.~

**2026-09-14 — Il fraintendimento sta nell'opzione, non in una tabella di regole**
Ogni risposta sbagliata dichiara nel dato quale lacuna rivela (`Opzione.lacuna`).
Il motore adattivo legge quel campo, risale i prerequisiti fino al primo concetto non
acquisito e apre la micro-lezione di *quello*, non del concetto di superficie. La
capability adattiva è quindi un grafo di 12 concetti più una funzione pura, non una
catena di `if` sul contenuto.
~Regole di remediation codificate a parte scartate: si sarebbero disallineate dal
contenuto al primo cambio di domanda.~

**2026-09-14 — La padronanza si assegna solo dopo una verifica superata**
Un concetto diventa `acquisito` solo se l'ultima risposta è corretta e, quando era già
stato sbagliato, solo al momento `riverifica`. Le risposte della valutazione iniziale non
rendono mai acquisito nulla: quella misura, non insegna. Livelli e XP contano i concetti
acquisiti, mai le lezioni viste — la wiki lo chiede esplicitamente.
~Progresso per pagine completate scartato: misurerebbe il consumo di contenuto, che è
proprio ciò che il prodotto dichiara di non misurare.~

**2026-09-14 — Credito parziale a tre livelli invece di esito binario**
Con 5 domande, una per area, un esito binario darebbe punteggi per area di soli 0% o 100%
e la tabella PRIMA/DOPO — il momento centrale della demo — sembrerebbe finta. Un campo
`credito: 0.5` sulle opzioni imprecise ma non scorrette porta le aree a 0/50/100 e il
complessivo a passi del 10%. Emendamento inviato al ticket 01 mentre era già in corso.
~Aumentare il numero di domande scartato: la wiki fissa cinque domande.~

**2026-09-14 — Il dominio non conosce React, il riduttore non conosce il contenuto**
`dominio/` è dato e logica pura, testabile senza DOM. Il riduttore riceve l'esito già
calcolato dentro l'azione invece di importare il motore: così le fondamenta (ticket 01)
non dipendono da domande e motore, e cinque agenti hanno potuto lavorare in parallelo su
file disgiunti fin dalla seconda onda.
~Riduttore che calcola l'esito da sé scartato: avrebbe serializzato tutti i ticket.~

**2026-09-14 — Ticket scritti a mano invece di `to-spec` + `to-tickets`**
La wiki è già l'esito di un grilling: scenario scelto, journey definito, MUST/SHOULD/CUT
e criteri di accettazione espliciti. Con 3h10 al traguardo i due giri di conferma delle
skill costavano più di quanto rendessero. Conservate le proprietà che reggono
l'orchestrazione: fette verticali, bloccanti dichiarati, un contesto fresco per ticket.
~Flusso completo scartato per tempo, non per merito.~

**2026-09-14 — Guscio con stub in seconda onda per evitare una quarta onda**
Il ticket 05 crea `App.tsx`, i componenti presentazionali condivisi e cinque stub di
schermata con firme vincolanti. Le cinque schermate vere sostituiscono il corpo degli
stub nella terza onda, su file disgiunti. Senza gli stub, il guscio avrebbe dovuto
aspettare le schermate e le schermate il guscio.
~Guscio in terza onda scartato: avrebbe richiesto una quarta onda che non entra nel tempo.~

**2026-09-14 — Superare la verifica di una lezione acquisisce tutti i concetti che insegna**
La banca delle domande verifica direttamente 11 concetti su 12: `proprieta` compare solo
come distrattore. Senza questa regola non sarebbe mai diventato acquisito, e siccome
`azione` lo ha come prerequisito il motore avrebbe rimandato alla lezione `l6a` a ogni
errore sulle azioni, per sempre. La regola regge anche nel merito: `l6a` si intitola
«Proprietario o creditore?» e insegna la distinzione come un concetto solo, quindi una
verifica superata la verifica per intero. L'unica altra lezione con due concetti (`l3a`)
li ha entrambi verificati altrove, quindi non si allenta nulla.
~Aggiungere una domanda dedicata a `proprieta` scartata: avrebbe rotto la convenzione
`v-<lezione>` su cui due agenti in parallelo si erano già accordati.~

**2026-09-14 — Il flusso completo verificato nel browser, non solo dai test**
I 51 test coprono il dominio, ma non dicono se l'app si comporta come deve. Percorso
guidato via Playwright: valutazione iniziale, mappa, lezione, errore deliberato,
remediation, riverifica, padronanza scritta in `localStorage`. È così che è emerso il
sottotitolo «distribuire è meglio che concentrare», che nessun test poteva cogliere.
~Verifica a sola lettura del codice scartata: i divieti della consegna riguardano ciò
che l'utente legge a schermo, non le funzioni.~

**2026-09-14 — `accenture-brand` ristretta al solo deck, e sfondo animato col video vero**
La skill copriva anche la web app, che nel frattempo si era data un'identità opposta
(forme morbide, colori chiari) dichiarata in `app/src/index.css`: due design system in
conflitto nello stesso repo. Ora è il tema di `presentation/` e basta — via `accenture.css`
e `tailwind-preset.js`. Lo sfondo nero animato è il `<video>` della hero di accenture.com
scaricato nel repo (1 MB), non una ricostruzione: keyframe, durate, ritardi e curve sono
letti dal DOM del sito col browser.
~Campo di particelle in canvas scartato: evocava il sito invece di riprodurlo, e 60 righe
di JS da mantenere valgono meno di un asset da 1 MB che funziona offline.~
~`Accenture-Reinvented-1920x600.mp4` scartato dopo averlo provato: non è lo sfondo, è la
sigla del logo. Dietro al titolo scriveva "reinvented with accenture".~

**2026-09-14 — Skill `brilliant-style` accanto a `accenture-brand`, non al suo posto**
L'app di educazione finanziaria deve insegnare, e il riferimento del settore è
brilliant.org: token, font, ombre e curve sono stati estratti dal bundle Panda CSS del
sito vero, non stimati. La skill sta separata perché i due sistemi sono incompatibili —
Accenture è squadrato, nero e viola con una curva a 550ms; Brilliant è morbido, avena e
blu con una molla che supera e rientra. Divisione: `accenture-brand` sul deck in
`presentation/`, `brilliant-style` sulla web app in `app/`.
~Fusione dei due sistemi scartata: produce un terzo stile che non è nessuno dei due.~
~Copia fedele dei contrasti di Brilliant scartata: tre coppie del sito stanno sotto AA
(bianco su blue-500 = 4.3:1, bianco su green-500 = 2.13:1, bianco su red-500 = 3.01:1).
La skill documenta la misura e impone il sostituto conforme.~

---
