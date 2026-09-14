# Specifica — Capitolo Zero

> Nome di lavoro provvisorio. La wiki chiede un placeholder neutro: "Capitolo Zero"
> evoca il partire da zero senza promettere una direzione, che è esattamente il
> vincolo del prodotto.

Fonte vincolante: `docs/wiki.md`. Questa specifica non la sostituisce: fissa le
scelte tecniche che la wiki lascia aperte, così che ogni ticket possa essere
implementato da un agente in contesto fresco senza rileggere tutto.

## La promessa, in una riga

> «Non ti diciamo dove mettere i tuoi soldi. Ti aiutiamo a capire cosa vogliono
> dire davvero i concetti e gli strumenti finanziari.»

## Il vincolo che vale più di ogni altro

L'app **spiega e calcola, non suggerisce**. È criterio di squalifica.
Nessuna schermata deve contenere: raccomandazioni, classifiche, "il migliore",
rendimenti attesi, previsioni, dati di mercato in tempo reale, profilazione
di adeguatezza. Gli strumenti reali sono **esempi didattici** con dati statici.

Ogni agente che scrive testo lo rilegge con questa domanda: *questa frase
aiuterebbe qualcuno a decidere cosa comprare?* Se sì, va riscritta.

## Architettura in una figura

```
app/src/
  dominio/       dati e logica pura — nessun React, nessun DOM, testabile
    tipi.ts            i tipi di tutto il dominio
    concetti.ts        12 concetti + grafo dei prerequisiti
    domande.ts         banca delle domande
    moduli.ts          6 moduli, le loro micro-lezioni
    strumenti.ts       4 schede strumento (BTP, obbligazione, azione, ETF)
    motoreAdattivo.ts  valutazione risposta → lacuna → remediation
    punteggio.ts       profilo per area, confronto prima/dopo
    percorso.ts        sblocco moduli, livelli, XP
  stato/         il modello di stato dell'applicazione
    archivio.ts        persistenza localStorage, versionata e validata
    riduttore.ts       useReducer puro
    ApprendimentoContext.tsx   provider + hook useApprendimento()
  componenti/    pezzi riusabili
    ui/                Button, Card, Field — GIÀ ESISTENTI, riusare
    interattivi/       le visualizzazioni educative
  schermate/     una per fase del journey
```

**Regola di dipendenza**: `schermate/` → `componenti/` → `stato/` → `dominio/`.
Mai al contrario. `dominio/` non importa React.

## Il modello di dominio

### 12 concetti, 5 aree

| Area (`AreaId`) | Concetti (`ConcettoId`) |
|---|---|
| `basi` | `risparmio`, `potere-acquisto` |
| `inflazione` | `inflazione` |
| `rischio-rendimento` | `rischio`, `rendimento` |
| `diversificazione` | `diversificazione` |
| `strumenti` | `proprieta`, `prestito`, `titolo-stato`, `obbligazione-societaria`, `azione`, `etf` |

Le 5 aree sono quelle del punteggio mostrato all'utente, e ricalcano l'esempio
della wiki (Money basics / Inflation / Risk & Return / Diversification /
Financial instruments).

Ogni concetto dichiara i suoi **prerequisiti**: è questo grafo che rende
adattivo il motore, non una catena di `if`.

### Il meccanismo adattivo, in una frase

**Ogni opzione sbagliata dichiara quale lacuna rivela.**

```ts
{ id: "b", testo: "Diventi proprietario di una parte dello Stato",
  lacuna: "prestito",
  spiegazione: "Chi compra un titolo di Stato presta denaro allo Stato: è un creditore, non un proprietario." }
```

Da qui discende tutto: risposta sbagliata → `lacuna` → micro-lezione del
concetto mancante → **riverifica con una domanda diversa** → padronanza.
Niente "sbagliato, riprova": il sistema sa *cosa* non è chiaro.

### Padronanza

Un concetto è `acquisito` **solo dopo una verifica superata**. Se è stato
sbagliato una volta, serve la riverifica corretta. La wiki lo chiede esplicito:
«mark the concept as mastered only after successful verification».

## Il journey

```
Benvenuto → Valutazione iniziale (5 domande) → PRIMA
   ↓
Mappa del percorso — 6 moduli che si sbloccano in sequenza
   ↓  ogni lezione: VEDI → CAPISCI → PROVA → DIMOSTRA → PADRONEGGIATO
   ↓  risposta sbagliata → remediation → riverifica
Valutazione finale (5 domande NUOVE, stessi concetti) → DOPO
   ↓
Risultato: PRIMA vs DOPO, complessivo e per area   ← il momento wow
```

## Persistenza

**Solo `localStorage`.** Deciso alle 11:30: Podman non è installato e Supabase
richiede ~1.5 GB di download che non stanno nel tempo residuo. La wiki mette
account e sync fra dispositivi in STRETCH e chiede solo «persistent state during
the user session»: il requisito è soddisfatto.

Chiave `capitolo-zero:v1`. La lettura **valida** il JSON: `unknown` in ingresso,
restringimento esplicito, stato nuovo se non combacia. Un localStorage sporco da
una versione precedente non deve rompere la demo davanti alla giuria.

## Accessibilità — non negoziabile

Vale `CLAUDE.md` per intero. I punti che questa app tocca davvero:

- Le domande sono `<fieldset>` + `<legend>` + `<input type="radio">`, mai div cliccabili.
- L'esito di una risposta è annunciato con `role="status"` o `aria-live="polite"`.
- Le visualizzazioni interattive hanno un **equivalente testuale**: chi non vede il
  grafico deve ricevere lo stesso contenuto educativo in parole.
- Barre di progresso: `role="progressbar"` con `aria-valuenow/min/max`, e il valore
  scritto anche in testo. Il colore non è mai l'unico veicolo di significato.
- Moduli bloccati: `aria-disabled` + testo che dice *perché* è bloccato.
- Focus visibile ovunque; niente trappole; target ≥ 24×24 px.

## Brand

Solo i token già in `app/src/index.css`. Viola `#7500C0` per il testo su chiaro,
`#A100FF` solo per riempimenti e grafica. Raggio 0, niente ombre, molto spazio
bianco. Titoli max peso 600. Movimento: `cubic-bezier(0.85, 0, 0, 1)` a 550ms,
sempre dentro `motion-safe:`.

## Test

Solo dove la wiki lo chiede come criterio di accettazione: «automated tests cover
core scoring/adaptive-learning logic». Quindi `motoreAdattivo`, `punteggio` e
`percorso`. Vitest, nessun testing-library, nessun test di componente.

## Fuori perimetro

Tutto ciò che la wiki mette in CUT, più: autenticazione, backend, routing con
libreria (lo stato tiene la schermata corrente), animazioni sofisticate,
"spiegamelo in un altro modo" con AI.
