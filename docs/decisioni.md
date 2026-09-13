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
Gli agenti `ui-builder` e `a11y-auditor` incorporano WCAG 2.2 AA: i componenti nascono
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

---
