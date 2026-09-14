# 01: Fondamenta — tipi del dominio, concetti, stato persistente

**Blocked by:** None (can start immediately)
**Status:** done

Leggi prima `.scratch/percorso-finanza/spec.md` e `CLAUDE.md`.

Questo ticket definisce i **contratti** su cui tutti gli altri si appoggiano.
Nove agenti in contesto fresco importeranno questi tipi senza poterti chiedere
niente: i nomi e le firme qui sotto sono **vincolanti**, non suggerimenti.

## File che possiedi (nessun altro li tocca)

- `app/src/dominio/tipi.ts`
- `app/src/dominio/concetti.ts`
- `app/src/stato/archivio.ts`
- `app/src/stato/riduttore.ts`
- `app/src/stato/ApprendimentoContext.tsx`
- `app/src/dominio/__test__/concetti.test.ts`
- `app/package.json` (solo per aggiungere vitest e lo script test)
- `app/vitest.config.ts`
- `package.json` alla radice (solo per gli script `test` e `check`)

## 1. `dominio/tipi.ts` — le firme esatte

```ts
export type ConcettoId =
  | "risparmio" | "potere-acquisto" | "inflazione"
  | "rischio" | "rendimento" | "diversificazione"
  | "proprieta" | "prestito"
  | "titolo-stato" | "obbligazione-societaria" | "azione" | "etf";

export type AreaId =
  | "basi" | "inflazione" | "rischio-rendimento" | "diversificazione" | "strumenti";

export type ModuloId = "m1" | "m2" | "m3" | "m4" | "m5" | "m6";
export type LezioneId = string;
export type DomandaId = string;

/** Le visualizzazioni educative. Il registro sta in componenti/interattivi/registro.ts */
export type InterattivoId =
  | "potere-acquisto" | "diversificazione" | "proprieta-o-prestito" | "anatomia-strumento";

export interface Area {
  id: AreaId;
  nome: string;          // mostrato all utente: "Rischio e rendimento"
}

export interface Concetto {
  id: ConcettoId;
  nome: string;
  area: AreaId;
  /** Cosa deve saper dire l utente perché il concetto sia acquisito. Una riga. */
  inUnaRiga: string;
  /** Grafo dei prerequisiti. È questo che rende adattivo il motore. */
  prerequisiti: ConcettoId[];
  /** La micro-lezione che lo spiega. La remediation manda qui. */
  lezione: LezioneId;
}

export type StatoPadronanza = "ignoto" | "in-corso" | "acquisito";

export interface Padronanza {
  stato: StatoPadronanza;
  tentativi: number;
  corrette: number;
  /** true se il concetto è stato sbagliato e attende ancora la riverifica. */
  attendeRiverifica: boolean;
}

export type MomentoDomanda = "iniziale" | "finale" | "verifica" | "riverifica";

export interface Opzione {
  id: string;
  testo: string;
  /**
   * Se questa opzione viene scelta, rivela una lacuna su questo concetto.
   * Assente sull opzione corretta. È il perno del motore adattivo.
   */
  lacuna?: ConcettoId;
  /** Mostrato DOPO la risposta. Spiega il perché, non giudica la persona. */
  spiegazione: string;
}

export interface Domanda {
  id: DomandaId;
  momento: MomentoDomanda;
  concetto: ConcettoId;
  testo: string;
  opzioni: Opzione[];
  /** id dell opzione corretta. */
  corretta: string;
  /**
   * Domanda che misura la stessa cosa con parole diverse.
   * Collega iniziale a finale, e verifica a riverifica.
   */
  gemella?: DomandaId;
}

export type Vedi =
  | { tipo: "interattivo"; componente: InterattivoId }
  | { tipo: "analogia"; testo: string };

export interface Lezione {
  id: LezioneId;
  titolo: string;
  concetti: ConcettoId[];
  /** VEDI - analogia o visualizzazione */
  vedi: Vedi;
  /** CAPISCI - massimo 3 paragrafi brevi. Frasi corte. */
  capisci: string[];
  /** PROVA - interazione facoltativa */
  prova?: { componente: InterattivoId; consegna: string };
  /** DIMOSTRA - la domanda di verifica */
  verifica: DomandaId;
}

export interface Modulo {
  id: ModuloId;
  numero: number;
  titolo: string;
  sottotitolo: string;
  lezioni: LezioneId[];
}

export type TipoStrumento = "titolo-stato" | "obbligazione-societaria" | "azione" | "etf";

export interface SchedaStrumento {
  id: TipoStrumento;
  nome: string;              // "BTP - Buono del Tesoro Poliennale"
  esempioReale: string;      // "BTP 3,85% scadenza 01/07/2034"
  /** La distinzione che il prodotto insegna. */
  ruolo: "proprietario" | "creditore" | "quota di un paniere";
  emittente: string;
  /** Coppie etichetta/valore: scadenza, cedola, capitale. Dati STATICI. */
  caratteristiche: Array<{ etichetta: string; valore: string; spiegazione: string }>;
  /** "Comprando questo diventi proprietario?" con risposta netta. */
  domandaChiave: { domanda: string; risposta: string };
  concetti: ConcettoId[];
}

// ---- Stato dell applicazione ----

export type Schermata =
  | { nome: "benvenuto" }
  | { nome: "valutazione"; momento: "iniziale" | "finale" }
  | { nome: "mappa" }
  | { nome: "modulo"; modulo: ModuloId }
  | { nome: "risultato" }
  | { nome: "trasparenza" };

export interface RispostaData {
  domandaId: DomandaId;
  concetto: ConcettoId;
  opzioneId: string;
  corretta: boolean;
  momento: MomentoDomanda;
}

export interface StatoApprendimento {
  versione: 1;
  schermata: Schermata;
  risposteIniziali: RispostaData[];
  risposteFinali: RispostaData[];
  /** Solo verifiche e riverifiche del percorso. */
  rispostePercorso: RispostaData[];
  padronanza: Partial<Record<ConcettoId, Padronanza>>;
  lezioniViste: LezioneId[];
  moduliCompletati: ModuloId[];
  xp: number;
  iniziatoIl: string;   // ISO
}
```

## 2. `dominio/concetti.ts`

Esporta esattamente:

```ts
export const AREE: readonly Area[]
export const CONCETTI: Readonly<Record<ConcettoId, Concetto>>
export const CONCETTI_ELENCO: readonly Concetto[]
export function concettiDellArea(area: AreaId): readonly Concetto[]
```

Nomi delle aree mostrati all utente: `basi` = "Le basi del denaro",
`inflazione` = "Inflazione", `rischio-rendimento` = "Rischio e rendimento",
`diversificazione` = "Diversificazione", `strumenti` = "Strumenti finanziari".

Grafo dei prerequisiti da rispettare (deve restare **aciclico**):

| Concetto | Area | Prerequisiti | Lezione |
|---|---|---|---|
| `risparmio` | basi | — | `l1a` |
| `potere-acquisto` | basi | `risparmio` | `l1b` |
| `inflazione` | inflazione | `potere-acquisto` | `l2a` |
| `rischio` | rischio-rendimento | `risparmio` | `l4a` |
| `rendimento` | rischio-rendimento | `rischio` | `l4b` |
| `diversificazione` | diversificazione | `rischio` | `l5a` |
| `prestito` | strumenti | `rischio` | `l6a` |
| `proprieta` | strumenti | `rischio` | `l6a` |
| `titolo-stato` | strumenti | `prestito` | `l6b` |
| `obbligazione-societaria` | strumenti | `prestito`, `rischio` | `l6c` |
| `azione` | strumenti | `proprieta` | `l6d` |
| `etf` | strumenti | `diversificazione`, `azione` | `l6e` |

Il campo `inUnaRiga` va scritto bene: lo useranno altre schermate.
Esempio per `prestito`: «Chi presta denaro è un creditore: gli deve essere
restituito, ma non possiede nulla di chi lo ha ricevuto.»

## 3. `stato/archivio.ts`

```ts
export const CHIAVE_ARCHIVIO = "capitolo-zero:v1";
export function statoIniziale(): StatoApprendimento;
export function caricaStato(): StatoApprendimento;
export function salvaStato(stato: StatoApprendimento): void;
export function azzeraStato(): void;
```

`caricaStato` legge `unknown` e **valida**: se il JSON è assente, corrotto, di
versione diversa o di forma inattesa, ritorna `statoIniziale()` senza lanciare.
Niente `any`: `unknown` e restringimento esplicito. `salvaStato` non deve mai
propagare un eccezione (quota piena, modalità privata): fallisce in silenzio.

## 4. `stato/riduttore.ts`

Il riduttore **non importa** `domande.ts` né `motoreAdattivo.ts`: riceve già
l esito calcolato. Questo tiene 01 indipendente da 02 e 04.

```ts
export type Azione =
  | { tipo: "vai-a"; schermata: Schermata }
  | { tipo: "risposta-data"; risposta: RispostaData; padronanza: Padronanza }
  | { tipo: "lezione-vista"; lezione: LezioneId }
  | { tipo: "modulo-completato"; modulo: ModuloId }
  | { tipo: "assegna-xp"; punti: number }
  | { tipo: "azzera" };

export function riduttore(stato: StatoApprendimento, azione: Azione): StatoApprendimento;
```

`risposta-data` instrada la risposta nell array giusto in base a
`risposta.momento` (`iniziale` va in `risposteIniziali`, `finale` in
`risposteFinali`, gli altri in `rispostePercorso`) e scrive
`padronanza[risposta.concetto]` col valore ricevuto.
Il riduttore è **puro**: nessuna scrittura su localStorage qui dentro.
`lezione-vista` e `modulo-completato` non devono duplicare voci già presenti.

## 5. `stato/ApprendimentoContext.tsx`

```ts
export function FornitoreApprendimento({ children }: { children: ReactNode }): ReactElement;
export function useApprendimento(): { stato: StatoApprendimento; invia: (a: Azione) => void };
```

Inizializza con `caricaStato()` (lazy init di `useReducer`), e salva con
`salvaStato` in un `useEffect` su ogni cambio di stato. `useApprendimento`
lancia un errore chiaro se usato fuori dal provider.

## 6. Vitest

Esegui `npm --prefix app install -D vitest`. Aggiungi `"test": "vitest run"` agli
script di `app/package.json`, e alla radice `"test": "npm --prefix app run test"`.
Aggiorna `"check"` alla radice in:
`npm run typecheck && npm run lint && npm run test && npm run build`.
Crea `app/vitest.config.ts` con l alias `@` verso `./src` e ambiente `node`.
Assicurati che `tsconfig.app.json` continui a fare typecheck dei file di test
(includi `src` come già fa) e che i tipi di vitest siano risolti.

Scrivi **un solo** test, `app/src/dominio/__test__/concetti.test.ts`: il grafo
dei prerequisiti è aciclico e ogni prerequisito citato esiste in `CONCETTI`.

## Criteri di accettazione

- [ ] `npm run typecheck` passa
- [ ] `npm run test` passa
- [ ] `npm run lint` passa
- [ ] Nessun `any` in nessuno dei file prodotti
- [ ] `caricaStato()` con localStorage contenente `{{{` ritorna lo stato iniziale invece di lanciare
- [ ] `caricaStato()` con un JSON valido ma di forma sbagliata ritorna lo stato iniziale
- [ ] `riduttore` è puro: nessun accesso a `localStorage` o `window` al suo interno
- [ ] Nessun file in `dominio/` importa React
