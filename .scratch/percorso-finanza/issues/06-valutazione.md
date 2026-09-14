# 06: Schermata di valutazione — iniziale e finale

**Blocked by:** 01, 02, 04, 05
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezioni 3 e 8),
`CLAUDE.md`, e il codice già presente: `dominio/tipi.ts`, `dominio/domande.ts`,
`dominio/motoreAdattivo.ts`, `stato/`, `componenti/Domanda.tsx`.
Invoca le skill `accenture-brand` e `accessibilita`.

## File che possiedi

- `app/src/schermate/Valutazione.tsx` — **esiste già come stub**: sostituisci il
  corpo mantenendo la firma esatta.

Nient altro. In particolare non modificare `componenti/Domanda.tsx`: è condiviso
con la schermata delle lezioni, che un altro agente sta scrivendo adesso.

```tsx
export function Valutazione({ momento }: { momento: "iniziale" | "finale" }): ReactElement;
```

## Cosa fa

Le cinque domande di `VALUTAZIONE_INIZIALE` o `VALUTAZIONE_FINALE` (da
`dominio/domande.ts`), **una per schermata**, in sequenza.

Punto che distingue questa schermata da quella delle lezioni:
**durante una valutazione non si mostra l esito**. Non «corretto/sbagliato», non
la spiegazione. Misurare e insegnare nello stesso momento falsa la misura, ed è
proprio la misura che il prodotto vende. Passa quindi `mostraEsito={false}` a
`Domanda`.

Flusso per ogni domanda:
1. L utente sceglie un opzione.
2. Calcola l esito con `valuta(domanda, idOpzione)` e la padronanza con
   `aggiornaPadronanza(...)` — servono per registrarla, non per mostrarla.
3. Invia `{ tipo: "risposta-data", risposta, padronanza }` con `momento` uguale
   al momento della schermata.
4. Avanza alla domanda successiva.

Alla quinta risposta:
- momento `iniziale` → vai a `{ nome: "mappa" }`, ma **prima** mostra il profilo
  appena calcolato: è il PRIMA della storia, e la giuria deve vederlo. Una
  schermata di riepilogo con `calcolaProfilo(stato.risposteIniziali, CONCETTI)`:
  punteggio complessivo e le cinque aree, con `BarraProgresso` per ognuna.
  Un pulsante «Inizia il percorso» porta alla mappa.
- momento `finale` → vai a `{ nome: "risultato" }`.

## Come deve apparire

- Un indicatore di posizione: «Domanda 2 di 5», e una `BarraProgresso` sopra.
- Una sola domanda alla volta, molto spazio bianco, niente distrazioni.
- Nessun timer, nessuna pressione: il pubblico di questa app è chi si sente già
  in difficoltà con questi argomenti.
- Il riepilogo del profilo iniziale non deve mai suonare come un giudizio.
  «Ecco da dove partiamo», non «hai preso 40». Un punteggio basso qui è normale
  ed è il presupposto del prodotto: dillo esplicitamente in una riga.

## Accessibilità

- Un `<h1>` per schermata; al cambio di domanda il focus torna sul titolo o sulla
  `<legend>`, e l avanzamento è annunciato (`aria-live="polite"`).
- Il pulsante «Avanti» resta disabilitato finché non c è una scelta — e il perché
  è scritto in testo, non solo implicito nello stato disabilitato.
- Nessuna informazione affidata al solo colore.
- Tutto usabile da tastiera, focus sempre visibile.

## Vincoli

- Riusa `Domanda`, `BarraProgresso`, `Button`, `Card`: non riscriverli.
- Solo utility Tailwind e i token esistenti. Raggio 0, nessuna ombra.
- Nessuna nuova dipendenza. Nessun `any`. Named export, TypeScript strict.
- Nessuna frase che raccomandi, confronti o suggerisca scelte di investimento.

## Criteri di accettazione

- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passano
- [ ] Le cinque domande scorrono una alla volta, in entrambi i momenti
- [ ] Durante la valutazione non compare mai l esito di una risposta
- [ ] Ogni risposta finisce nello stato con il `momento` giusto
- [ ] Al termine della iniziale compare il profilo PRIMA con le cinque aree
- [ ] Al termine della finale si arriva alla schermata risultato
- [ ] Percorso completo da sola tastiera, focus visibile e spostato a ogni domanda
- [ ] Il tono non giudica: nessuna schermata fa sentire l utente in difetto
