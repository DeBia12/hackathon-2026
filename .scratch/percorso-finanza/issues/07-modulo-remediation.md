# 07: Schermata modulo — micro-lezione e remediation adattiva

**Blocked by:** 01, 02, 03, 04, 05, 08
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezioni 4, 5, 11),
`CLAUDE.md`, e il codice già presente: `dominio/tipi.ts`, `moduli.ts`,
`domande.ts`, `motoreAdattivo.ts`, `concetti.ts`, `stato/`,
`componenti/Domanda.tsx`, `componenti/interattivi/registro.tsx`.
Invoca le skill `accenture-brand` e `accessibilita`.

**Questo è il ticket della demo.** Il punto 3-8 della storia che la giuria vedrà
(«l utente sbaglia → il sistema capisce cosa manca → propone la lezione giusta →
riverifica con un altra domanda → il concetto diventa acquisito») accade tutto
dentro questa schermata. Se funziona qui, il prodotto ha una capability; se no,
è un sito di contenuti.

## File che possiedi

- `app/src/schermate/Modulo.tsx` — **esiste già come stub**: sostituisci il corpo
  mantenendo la firma esatta.
- `app/src/componenti/MicroLezione.tsx` (nuovo)
- `app/src/componenti/Remediation.tsx` (nuovo)

Non modificare `componenti/Domanda.tsx` né `componenti/interattivi/`: sono di
altri ticket. Usali così come sono.

```tsx
export function Modulo({ modulo }: { modulo: ModuloId }): ReactElement;
```

## Il flusso di una lezione

Le lezioni del modulo si attraversano in sequenza. Ognuna segue lo schema che la
wiki impone (sezione 4) e che `Lezione` in `tipi.ts` già modella:

| Passo | Da dove | Come si mostra |
|---|---|---|
| **VEDI** | `lezione.vedi` | se `interattivo`, rendi `INTERATTIVI[componente]`; se `analogia`, il testo |
| **CAPISCI** | `lezione.capisci` | i paragrafi, al massimo tre, con respiro |
| **PROVA** | `lezione.prova` | l interattivo indicato, preceduto dalla `consegna` |
| **DIMOSTRA** | `lezione.verifica` | la `Domanda`, con `mostraEsito` acceso |
| **PADRONEGGIATO** | esito | conferma esplicita che il concetto è acquisito |

A differenza della valutazione, qui **l esito si mostra sempre**, con la
spiegazione dell opzione scelta: siamo nella parte che insegna.

## La remediation — il cuore

Quando la risposta di verifica è sbagliata:

1. `valuta(domanda, scelta)` restituisce l `Esito` con la `lacuna`.
2. `prossimoPasso(esito, domanda, CONCETTI, stato.padronanza)` restituisce
   `{ tipo: "rimedia", concetto, lezione, riverifica }`. Il motore ha già
   risolto il prerequisito profondo: **non ricalcolare niente qui**.
3. Mostra `Remediation`, che deve rendere visibile il ragionamento del sistema —
   è ciò che la giuria deve capire senza spiegazioni tecniche:

   > Qui manca un passaggio: **proprietario o creditore**.
   > Non è un errore tuo, è un concetto che non abbiamo ancora visto.
   > Prima di tornare alla domanda, guardiamo insieme cosa vuol dire.

   Nomina il concetto. Mai «sbagliato», mai «riprova».
4. Mostra la micro-lezione del concetto mancante (`LEZIONI[passo.lezione]`),
   con il suo interattivo.
5. Poi la **riverifica**: `DOMANDE[passo.riverifica]`, che è una domanda
   **diversa** sullo stesso concetto. Registrala con `momento: "riverifica"`.
6. Se la riverifica è corretta, `aggiornaPadronanza` porta il concetto ad
   `acquisito`: dallo a vedere con una conferma netta, e assegna XP.
7. Poi si torna alla lezione da cui si era usciti.

Se anche la riverifica è sbagliata: mostra di nuovo la spiegazione e permetti di
rivedere la lezione, **senza** entrare in un ciclo infinito di remediation —
al secondo tentativo fallito si prosegue lasciando il concetto `in-corso`.
Un utente bloccato in loop davanti alla giuria è peggio di un concetto non
acquisito.

## Registrare lo stato

- Ogni risposta: `{ tipo: "risposta-data", risposta, padronanza }`.
- Ogni lezione aperta: `{ tipo: "lezione-vista", lezione }`.
- Concetto acquisito: `{ tipo: "assegna-xp", punti: 10 }`.
- Ultima lezione del modulo superata: `{ tipo: "modulo-completato", modulo }`,
  poi torna alla `mappa`.

## Accessibilità

- La comparsa della remediation è un cambio di contesto: annunciala in un
  `role="status"` e sposta il focus sul suo titolo. Chi non vede lo schermo deve
  capire **perché** si trova altrove.
- Passi della lezione: struttura con intestazioni vere (`<h2>`, `<h3>`), non con
  soli stili. La sequenza VEDI/CAPISCI/PROVA/DIMOSTRA deve leggersi anche in
  modalità solo testo.
- Nessuna transizione fuori da `motion-safe:`.
- Ogni interattivo lo rendi dal registro senza aggiungergli wrapper cliccabili.

## Vincoli

- Riusa `Domanda`, `BarraProgresso`, `PastigliaConcetto`, `Button`, `Card`.
- Solo utility Tailwind e token esistenti. Raggio 0, nessuna ombra.
- Nessuna nuova dipendenza. Nessun `any`. Named export, TypeScript strict.
- Nessuna frase che raccomandi o confronti strumenti.

## Criteri di accettazione

- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passano
- [ ] Una lezione mostra tutti e cinque i passi nell ordine
- [ ] Una risposta errata apre la remediation sul concetto della lacuna, non su quello di superficie
- [ ] La remediation nomina il concetto mancante in parole comprensibili
- [ ] La riverifica usa una domanda diversa da quella sbagliata
- [ ] Superata la riverifica, il concetto risulta acquisito e vengono assegnati XP
- [ ] Due riverifiche fallite non bloccano l utente: si prosegue
- [ ] Completate tutte le lezioni, il modulo risulta completato e si torna alla mappa
- [ ] Focus e annunci corretti a ogni cambio di passo e all apertura della remediation
