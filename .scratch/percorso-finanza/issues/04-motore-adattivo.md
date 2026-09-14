# 04: Motore adattivo, punteggio e percorso — con test

**Blocked by:** 01
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezioni 5, 7, 8, 10)
e `app/src/dominio/tipi.ts` (prodotto dal ticket 01).

Questa è **la capability software** che la consegna richiede: senza di questa il
prodotto è un sito di contenuti. La wiki la mette fra i criteri di accettazione
(«automated tests cover core scoring/adaptive-learning logic»), quindi qui si
lavora **test-first**. Invoca la skill `tdd`.

## File che possiedi (nessun altro li tocca)

- `app/src/dominio/motoreAdattivo.ts`
- `app/src/dominio/punteggio.ts`
- `app/src/dominio/percorso.ts`
- `app/src/dominio/__test__/motoreAdattivo.test.ts`
- `app/src/dominio/__test__/punteggio.test.ts`
- `app/src/dominio/__test__/percorso.test.ts`

**Non importare `domande.ts`, `moduli.ts` né `strumenti.ts`**: li stanno
scrivendo altri agenti in parallelo e non esistono ancora. Le tue funzioni
ricevono i dati che servono come **parametri**, e i test usano fixture proprie
dichiarate nel file di test. Questo è anche un requisito di progettazione: il
motore deve essere puro e indipendente dal contenuto.

## 1. `motoreAdattivo.ts`

```ts
export interface Esito {
  corretta: boolean;
  /** 1 corretta, 0.5 parziale, 0 errata. */
  credito: number;
  /** Il concetto che la risposta scelta rivela mancante. Assente se corretta. */
  lacuna?: ConcettoId;
  /** La spiegazione dell'opzione scelta: si mostra sempre, anche se corretta. */
  spiegazione: string;
}

export function valuta(domanda: Domanda, idOpzione: string): Esito;

export type Passo =
  | { tipo: "avanza" }
  | { tipo: "rimedia"; concetto: ConcettoId; lezione: LezioneId; riverifica: DomandaId };

/**
 * Decide cosa succede dopo una risposta.
 * `catalogo` è il dizionario dei concetti (CONCETTI da concetti.ts): passato
 * come parametro perché il motore resti testabile senza il contenuto reale.
 */
export function prossimoPasso(
  esito: Esito,
  domanda: Domanda,
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
): Passo;

export function aggiornaPadronanza(
  precedente: Padronanza | undefined,
  esito: Esito,
  momento: MomentoDomanda,
): Padronanza;
```

### Le regole, esplicite

**`valuta`**: trova l opzione scelta. `corretta` è vero solo se il suo id è
uguale a `domanda.corretta`. `credito` vale 1 se corretta, altrimenti
`opzione.credito ?? 0`. `lacuna` è `opzione.lacuna` quando non è corretta.
Se l id non esiste fra le opzioni, lancia un errore con un messaggio leggibile.

**`prossimoPasso`**: se l esito è corretto, `avanza`. Altrimenti costruisci un
passo di remediation sul concetto della `lacuna` (o, se manca, sul
`domanda.concetto`), puntando alla `lezione` di quel concetto nel catalogo.
La `riverifica` è `r-<lezione>`.

Una precisazione che conta: se il concetto della lacuna ha **prerequisiti non
acquisiti**, la wiki chiede di mandare l utente al prerequisito, non al concetto
di superficie. Esponi quindi anche:

```ts
/** Il primo prerequisito non ancora acquisito, in profondità. Sé stesso se sono tutti a posto. */
export function radiceDellaLacuna(
  concetto: ConcettoId,
  padronanza: Partial<Record<ConcettoId, Padronanza>>,
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
): ConcettoId;
```

Visita in profondità, prerequisiti prima. Deve terminare anche se il grafo
contenesse per errore un ciclo: tieni un insieme dei già visitati.
`prossimoPasso` accetta un quarto parametro facoltativo `padronanza` e, quando
c è, usa `radiceDellaLacuna` per scegliere dove mandare l utente.

**`aggiornaPadronanza`** — la regola che la wiki impone: *un concetto è
`acquisito` solo dopo una verifica superata*.

- `tentativi` e `corrette` si incrementano sempre.
- Risposta **errata** (credito < 1): stato `in-corso`, `attendeRiverifica = true`.
- Risposta **corretta**:
  - se `attendeRiverifica` era `true` e `momento` è `"riverifica"` → `acquisito`,
    `attendeRiverifica = false`;
  - se `attendeRiverifica` era `true` e il momento è un altro → resta `in-corso`
    (la riverifica deve ancora arrivare);
  - se `attendeRiverifica` era `false` → `acquisito`.
- Una risposta con credito 0.5 **non** rende acquisito niente: vale come errata
  ai fini della padronanza, ma `corrette` non si incrementa.
- Le risposte con `momento === "iniziale"` **non** rendono mai un concetto
  acquisito: la valutazione iniziale misura, non insegna. Restano `in-corso`
  se corrette, `ignoto` se no — così il percorso parte comunque da capo.

## 2. `punteggio.ts`

```ts
export interface Profilo {
  complessivo: number;                       // 0-100, intero
  perArea: Record<AreaId, number>;           // 0-100, interi
  concettiAcquisiti: number;
}

export function calcolaProfilo(
  risposte: readonly RispostaData[],
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
): Profilo;

export interface Confronto {
  prima: Profilo;
  dopo: Profilo;
  deltaComplessivo: number;                  // può essere negativo
  deltaPerArea: Record<AreaId, number>;
}

export function confronta(prima: Profilo, dopo: Profilo): Confronto;
```

`complessivo` è la media dei crediti su tutte le risposte, in centesimi,
arrotondata all intero. `perArea` è la stessa media ristretta alle risposte i
cui concetti appartengono a quell area. **Un area senza risposte vale 0**, non
`NaN` e non `undefined`: la tabella prima/dopo deve poter sempre mostrare cinque
righe. Tutte e cinque le aree sono sempre presenti nel record.

`RispostaData` porta già `credito`: usa quello, non ricalcolare dalla domanda.

## 3. `percorso.ts`

```ts
export type StatoModulo = "bloccato" | "disponibile" | "in-corso" | "completato";

export function statoModuli(
  moduli: readonly Modulo[],
  stato: StatoApprendimento,
): Record<ModuloId, StatoModulo>;

export type Livello = "Principiante" | "Esploratore" | "Navigatore" | "Consapevole";

export interface Avanzamento {
  livello: Livello;
  xp: number;
  concettiAcquisiti: number;
  concettiTotali: number;
  /** 0-100 */
  percentuale: number;
  prossimoLivello?: Livello;
  concettiAlProssimoLivello: number;
}

export function avanzamento(
  stato: StatoApprendimento,
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
): Avanzamento;

/** true se tutte le lezioni del modulo hanno la verifica superata. */
export function moduloCompletato(modulo: Modulo, stato: StatoApprendimento): boolean;

/** Il primo modulo non completato, per il pulsante "riprendi". */
export function moduloDaRiprendere(
  moduli: readonly Modulo[],
  stato: StatoApprendimento,
): Modulo | undefined;
```

**Sblocco**: il primo modulo è sempre `disponibile`. Un modulo è `disponibile`
solo se il precedente è `completato`, altrimenti `bloccato`. È `in-corso` se
almeno una delle sue lezioni è in `lezioniViste` ma non tutte le verifiche sono
superate.

**Livelli**, in base ai concetti acquisiti su 12:
`0-2` Principiante · `3-6` Esploratore · `7-10` Navigatore · `11-12` Consapevole.

La wiki è esplicita: il progresso premia la **comprensione dimostrata**, non le
pagine viste. Quindi XP e livello si calcolano dai concetti `acquisito`, mai da
`lezioniViste`.

## Test — cosa deve essere coperto

Con fixture locali, non con il contenuto reale. I casi che contano:

**motoreAdattivo**
- [ ] `valuta` su opzione corretta: `corretta` vero, `credito` 1, nessuna `lacuna`
- [ ] `valuta` su opzione errata: riporta la `lacuna` dichiarata dall opzione
- [ ] `valuta` su opzione parziale: `credito` 0.5 e `corretta` falso
- [ ] `valuta` con un id inesistente lancia
- [ ] `prossimoPasso` su esito corretto restituisce `avanza`
- [ ] `prossimoPasso` su esito errato punta alla lezione del concetto della lacuna
- [ ] `radiceDellaLacuna` scende al prerequisito non acquisito invece di fermarsi in superficie
- [ ] `radiceDellaLacuna` termina anche su un grafo con un ciclo
- [ ] **il caso della wiki**: sbagliata la verifica di `obbligazione-societaria`
      scegliendo l opzione "sei proprietario", il motore manda alla lezione di
      `prestito` e propone la riverifica `r-l6a`
- [ ] `aggiornaPadronanza`: errata poi corretta al momento `verifica` resta `in-corso`
- [ ] `aggiornaPadronanza`: errata poi corretta al momento `riverifica` diventa `acquisito`
- [ ] `aggiornaPadronanza`: corretta al primo colpo in `verifica` diventa `acquisito`
- [ ] `aggiornaPadronanza`: corretta al momento `iniziale` non diventa mai `acquisito`

**punteggio**
- [ ] Cinque risposte tutte corrette danno 100 complessivo e 100 in ogni area
- [ ] Cinque risposte tutte errate danno 0 ovunque, non `NaN`
- [ ] Un area senza risposte vale 0 ed è comunque presente nel record
- [ ] Il credito 0.5 produce un area al 50
- [ ] `confronta` calcola i delta, anche negativi

**percorso**
- [ ] Il primo modulo è disponibile a stato vuoto, gli altri bloccati
- [ ] Completato `m1`, `m2` diventa disponibile e `m3` resta bloccato
- [ ] `avanzamento` conta solo i concetti `acquisito`, non le lezioni viste
- [ ] I confini dei livelli: 2 Principiante, 3 Esploratore, 10 Navigatore, 11 Consapevole

## Criteri di accettazione

- [ ] `npm run test` passa, con i casi qui sopra
- [ ] `npm run typecheck` e `npm run lint` passano
- [ ] Nessuno di questi tre file importa React, `domande.ts`, `moduli.ts` o `strumenti.ts`
- [ ] Tutte le funzioni sono pure: stesso input, stesso output, nessun effetto
- [ ] Nessun `any`
