# 03: Contenuti — 6 moduli, 12 micro-lezioni, 4 schede strumento

**Blocked by:** 01
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezioni 3, 4, 6)
e `app/src/dominio/tipi.ts` (prodotto dal ticket 01).

## File che possiedi (nessun altro li tocca)

- `app/src/dominio/moduli.ts`
- `app/src/dominio/strumenti.ts`

Non toccare `tipi.ts`, `concetti.ts` né `domande.ts` (li scrive un altro agente
in parallelo).

## 1. `moduli.ts`

```ts
export const MODULI: readonly Modulo[];                        // 6, in ordine
export const LEZIONI: Readonly<Record<LezioneId, Lezione>>;    // 12
export function lezione(id: LezioneId): Lezione;               // lancia se non esiste
export function moduloDiLezione(id: LezioneId): Modulo;
```

Struttura fissa (gli id sono contratti: altri ticket ci puntano):

| Modulo | Titolo | Lezioni |
|---|---|---|
| `m1` | Il denaro e il suo valore | `l1a`, `l1b` |
| `m2` | L inflazione | `l2a` |
| `m3` | Risparmiare o investire | `l3a` |
| `m4` | Rischio e rendimento | `l4a`, `l4b` |
| `m5` | La diversificazione | `l5a` |
| `m6` | Gli strumenti finanziari | `l6a`, `l6b`, `l6c`, `l6d`, `l6e` |

Concetti e verifiche di ogni lezione:

| Lezione | Titolo | Concetti | `verifica` | Visualizzazione |
|---|---|---|---|---|
| `l1a` | Cosa vuol dire risparmiare | `risparmio` | `v-l1a` | analogia |
| `l1b` | Cento euro non valgono sempre cento euro | `potere-acquisto` | `v-l1b` | interattivo `potere-acquisto` |
| `l2a` | Perché i prezzi salgono | `inflazione` | `v-l2a` | interattivo `potere-acquisto` |
| `l3a` | Due usi diversi dello stesso denaro | `risparmio`, `rischio` | `v-l3a` | analogia |
| `l4a` | Cosa vuol dire rischio | `rischio` | `v-l4a` | analogia |
| `l4b` | Rendimento: non si parla mai da solo | `rendimento` | `v-l4b` | analogia |
| `l5a` | Tutto su una carta, o su dieci | `diversificazione` | `v-l5a` | interattivo `diversificazione` |
| `l6a` | Proprietario o creditore? | `proprieta`, `prestito` | `v-l6a` | interattivo `proprieta-o-prestito` |
| `l6b` | Il titolo di Stato | `titolo-stato` | `v-l6b` | interattivo `anatomia-strumento` |
| `l6c` | L obbligazione societaria | `obbligazione-societaria` | `v-l6c` | interattivo `anatomia-strumento` |
| `l6d` | L azione | `azione` | `v-l6d` | interattivo `anatomia-strumento` |
| `l6e` | L ETF | `etf` | `v-l6e` | interattivo `anatomia-strumento` |

`l6a` è la lezione più importante del prodotto: è quella che la wiki cita come
esempio del comportamento adattivo (lacuna OWNER vs LENDER). Scrivila meglio
delle altre.

### La forma di ogni lezione

Segue lo schema della wiki, sezione 4:

- `vedi` — VEDI. O `{ tipo: "interattivo", componente }`, o `{ tipo: "analogia", testo }`
  con un paragrafo che ancora il concetto a qualcosa di quotidiano.
- `capisci` — CAPISCI. **Massimo 3 paragrafi, ognuno di 2-3 frasi corte.**
  Se non ci stai, il concetto è tagliato male, non il testo troppo lungo.
- `prova` — PROVA. Presente solo dove esiste un interattivo utile; la `consegna`
  è l istruzione all utente («Sposta gli anni e guarda cosa succede al carrello»).
- `verifica` — DIMOSTRA. L id della domanda, dalla tabella qui sopra.

## 2. `strumenti.ts`

```ts
export const STRUMENTI: Readonly<Record<TipoStrumento, SchedaStrumento>>;
export const STRUMENTI_ELENCO: readonly SchedaStrumento[];
```

Quattro schede, con **esempi reali ma dati statici e non di mercato**:

| id | Esempio reale suggerito | `ruolo` |
|---|---|---|
| `titolo-stato` | un BTP italiano, es. «BTP 3,85% scadenza 01/07/2034» | `creditore` |
| `obbligazione-societaria` | un emittente italiano noto, es. un obbligazione Enel | `creditore` |
| `azione` | una società quotata italiana nota | `proprietario` |
| `etf` | un ETF azionario globale ad ampia diffusione | `quota di un paniere` |

Per ciascuna, `caratteristiche` sono le parti dello strumento — emittente,
capitale, cedola, scadenza dove esistono — ognuna con la sua `spiegazione` in
parole semplici. Per l azione non esistono cedola e scadenza: **dillo**, è
proprio quella l informazione didattica.

`domandaChiave` è la domanda a cui la scheda risponde in modo netto. Per il BTP
la wiki la detta: «Acquistando un titolo di Stato diventi proprietario dello
Stato?» — risposta: no, gli stai prestando denaro.

Per l ETF, collega esplicitamente alla diversificazione già imparata nel modulo 5.

## Vincoli assoluti sul contenuto

Questa è la parte del prodotto dove è più facile squalificarsi.

**Vietato**, anche di sfuggita:
- rendimenti passati, attesi, obiettivo, o qualunque numero di performance;
- confronti fra strumenti in termini di convenienza;
- classifiche, «il migliore», «il più adatto», «consigliato per»;
- prezzi o dati di mercato, anche indicativi;
- suggerire a chi è adatto uno strumento.

**Richiesto**: correttezza finanziaria. Semplificare il linguaggio e la
rappresentazione sì; cambiare il significato finanziario mai. Se una
semplificazione rende una frase falsa, scrivi la frase più lunga.

Sulle cedole e le scadenze reali: se non sei certo di un dato di uno strumento
specifico, usa una formulazione generica e corretta («un BTP paga una cedola
fissa ogni sei mesi fino alla scadenza») invece di inventare cifre precise.
Un numero sbagliato in demo davanti a una giuria di Accenture costa più di un
esempio generico.

## Vincoli sul linguaggio

Italiano, per 18-30 anni, zero prerequisiti. Frasi corte. Ogni termine tecnico
è spiegato nel momento in cui compare, non dopo. Dai del tu.

## Criteri di accettazione

- [ ] 6 moduli e 12 lezioni, con esattamente gli id della tabella
- [ ] Ogni `verifica` punta a un id nella forma `v-<lezione>`
- [ ] Nessuna lezione ha più di 3 paragrafi in `capisci`
- [ ] 4 schede strumento complete, ognuna con `domandaChiave` e almeno 3 `caratteristiche`
- [ ] La scheda dell azione dichiara esplicitamente che non ha cedola né scadenza
- [ ] La scheda ETF rimanda al concetto di diversificazione
- [ ] `npm run typecheck` e `npm run lint` passano
- [ ] Nessun rendimento, prezzo, classifica o raccomandazione in tutto il file
- [ ] Nessun `any`
