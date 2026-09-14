# 02: Banca delle domande — valutazioni, verifiche e riverifiche

**Blocked by:** 01
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezioni 3, 5, 8)
e `app/src/dominio/tipi.ts` (prodotto dal ticket 01).

Produci il contenuto che alimenta l intero motore adattivo. È il ticket con più
scrittura e meno logica: la qualità delle domande **è** la qualità del prodotto.

## File che possiedi (nessun altro li tocca)

- `app/src/dominio/domande.ts`

Non toccare nient altro. In particolare non modificare `tipi.ts` né `concetti.ts`.

## Cosa esportare

```ts
export const DOMANDE: Readonly<Record<DomandaId, Domanda>>;
export const VALUTAZIONE_INIZIALE: readonly DomandaId[];   // 5 id, in ordine
export const VALUTAZIONE_FINALE: readonly DomandaId[];     // 5 id, in ordine
export function domanda(id: DomandaId): Domanda;           // lancia se non esiste
```

## Convenzione degli identificativi — vincolante

Altri ticket scrivono contenuti che puntano a questi id senza poterti chiedere
conferma. Rispettala alla lettera.

| Tipo | Formato | Esempi |
|---|---|---|
| Valutazione iniziale | `i1` … `i5` | `i1` |
| Valutazione finale | `f1` … `f5` | `f3` |
| Verifica di una lezione | `v-<lezione>` | `v-l1a`, `v-l6d` |
| Riverifica dopo remediation | `r-<lezione>` | `r-l1a`, `r-l6d` |

Le 12 lezioni esistenti sono: `l1a`, `l1b`, `l2a`, `l3a`, `l4a`, `l4b`, `l5a`,
`l6a`, `l6b`, `l6c`, `l6d`, `l6e`. Servono quindi **12 `v-` e 12 `r-`**.

Concetto associato a ciascuna lezione:

| Lezione | Concetto della verifica |
|---|---|
| `l1a` | `risparmio` |
| `l1b` | `potere-acquisto` |
| `l2a` | `inflazione` |
| `l3a` | `rischio` |
| `l4a` | `rischio` |
| `l4b` | `rendimento` |
| `l5a` | `diversificazione` |
| `l6a` | `prestito` |
| `l6b` | `titolo-stato` |
| `l6c` | `obbligazione-societaria` |
| `l6d` | `azione` |
| `l6e` | `etf` |

## Le due valutazioni — una domanda per area

| id | Area | Concetto |
|---|---|---|
| `i1` / `f1` | `basi` | `potere-acquisto` |
| `i2` / `f2` | `inflazione` | `inflazione` |
| `i3` / `f3` | `rischio-rendimento` | `rendimento` |
| `i4` / `f4` | `diversificazione` | `diversificazione` |
| `i5` / `f5` | `strumenti` | `prestito` |

**Requisito esplicito della wiki**: la valutazione finale misura gli stessi
concetti ma **non ripete le parole**. Cambia lo scenario, il taglio, l esempio.
Se un utente potesse rispondere alla finale ricordando la forma della iniziale
invece del concetto, il prodotto misurerebbe la memoria e non l apprendimento —
ed è esattamente ciò che il prodotto dichiara di non fare.

Imposta `gemella` in entrambe le direzioni: `i1.gemella = "f1"`, `f1.gemella = "i1"`.
Stessa cosa per le coppie `v-lXX` / `r-lXX`.

## Come si scrive una domanda

4 opzioni. Una corretta. Le altre tre non sono riempitivo: **ognuna incarna un
fraintendimento reale**, e dichiara con `lacuna` quale concetto rivela mancante.
È questo campo che fa scattare la remediation: una `lacuna` sbagliata manda
l utente alla lezione sbagliata.

Usa `credito: 0.5` sulle opzioni imprecise ma non scorrette — al massimo una per
domanda, e solo dove esiste davvero. Non forzarlo.

Esempio della forma attesa (è l esempio della wiki, sezione 5):

```ts
"i5": {
  id: "i5",
  momento: "iniziale",
  concetto: "prestito",
  gemella: "f5",
  testo: "Compri un'obbligazione emessa da un'azienda. Che rapporto hai con quell'azienda?",
  corretta: "c",
  opzioni: [
    { id: "a", testo: "Possiedi una parte dell'azienda",
      lacuna: "proprieta",
      spiegazione: "Possedere una parte dell'azienda è ciò che fa un'azione, non un'obbligazione." },
    { id: "b", testo: "Sei un cliente dell'azienda",
      lacuna: "prestito",
      spiegazione: "Comprare un'obbligazione non ha a che fare con i prodotti che l'azienda vende." },
    { id: "c", testo: "Le hai prestato del denaro, che l'azienda deve restituirti",
      spiegazione: "Esatto: chi compra un'obbligazione è un creditore dell'emittente." },
    { id: "d", testo: "Hai depositato del denaro, come su un conto corrente",
      credito: 0.5,
      lacuna: "rischio",
      spiegazione: "L'idea di dare denaro a qualcuno è giusta, ma un deposito e un prestito a un'azienda non comportano lo stesso rischio." },
  ],
},
```

## Vincoli sul linguaggio

- **Italiano**, per chi ha 18-30 anni e parte da zero.
- Frasi corte. Una idea per frase. Zero gergo non spiegato.
- Le `spiegazione` spiegano il **perché**, non giudicano: mai «hai sbagliato»,
  mai «ovviamente». Vanno bene anche sull opzione corretta: confermano il ragionamento.
- **Nessuna domanda può avere come risposta corretta una scelta di investimento.**
  Vietato: «qual è lo strumento migliore per…», «cosa conviene…», «dove
  dovresti mettere…». Il prodotto misura la comprensione, non le preferenze.
- Niente numeri di mercato reali, niente rendimenti, niente previsioni.
  Le percentuali usate negli esempi devono essere dichiaratamente ipotetiche.
- Correttezza finanziaria non negoziabile: semplificare il linguaggio sì,
  cambiare il significato no.

## Criteri di accettazione

- [ ] 34 domande: 5 `i`, 5 `f`, 12 `v-`, 12 `r-`
- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa
- [ ] Ogni domanda ha 4 opzioni ed esattamente una corretta, il cui id compare in `corretta`
- [ ] Ogni opzione non corretta ha una `lacuna` valida (un `ConcettoId` esistente)
- [ ] Ogni opzione ha una `spiegazione` non vuota
- [ ] `gemella` è reciproca su tutte le coppie iniziale/finale e verifica/riverifica
- [ ] La finale non riusa la formulazione della iniziale: scenari diversi, non sinonimi
- [ ] Nessuna domanda o spiegazione suggerisce cosa comprare, vendere o scegliere
- [ ] Nessun `any`
