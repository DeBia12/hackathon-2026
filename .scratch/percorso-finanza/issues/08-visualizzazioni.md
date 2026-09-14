# 08: Le quattro visualizzazioni educative interattive

**Blocked by:** 01
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezioni 3, 6),
`CLAUDE.md` e `app/src/dominio/tipi.ts` (prodotto dal ticket 01).
Invoca le skill `accenture-brand` e `accessibilita`.

La wiki dice che l apprendimento deve avvenire **attraverso l interazione**, non
leggendo. Questi quattro componenti sono la parte del prodotto che lo dimostra.

## File che possiedi (nessun altro li tocca)

- `app/src/componenti/interattivi/PotereAcquisto.tsx`
- `app/src/componenti/interattivi/Diversificazione.tsx`
- `app/src/componenti/interattivi/ProprietaOPrestito.tsx`
- `app/src/componenti/interattivi/AnatomiaStrumento.tsx`
- `app/src/componenti/interattivi/registro.tsx`

Non toccare nient altro. In particolare: niente `App.tsx`, niente `schermate/`,
niente `index.css`.

## Il registro — contratto verso il ticket 07

```tsx
export interface PropsInterattivo {
  /** Presente solo su AnatomiaStrumento: quale strumento mostrare. */
  strumento?: TipoStrumento;
}

export const INTERATTIVI: Readonly<Record<InterattivoId, ComponentType<PropsInterattivo>>>;
```

Le chiavi sono esattamente gli `InterattivoId` di `tipi.ts`:
`potere-acquisto`, `diversificazione`, `proprieta-o-prestito`, `anatomia-strumento`.

Ogni componente accetta `PropsInterattivo` e funziona **anche senza prop**, con
un valore predefinito sensato. Il ticket 07 li rende dal registro senza sapere
quale sta rendendo.

## 1. `PotereAcquisto` — l inflazione si vede

Un cursore sugli anni (0-20). A sinistra 100 euro fermi; a destra cosa comprano
dopo quegli anni con un tasso di inflazione **dichiaratamente ipotetico** che
l utente può scegliere fra tre valori (1%, 2%, 4%) — non un dato di mercato, e
scritto come tale nell interfaccia.

Il punto didattico: la cifra sul conto non cambia, quello che ci compri sì.
Rendi visibile **entrambe** le grandezze insieme, altrimenti il concetto non passa.

- `<input type="range">` con `<label>` vera, non un div trascinabile.
- Il valore corrente è scritto in testo accanto al cursore, sempre.
- L esito («100 euro fra 10 anni comprano quanto 82 euro oggi») è in un
  `aria-live="polite"`, così chi usa uno screen reader sente il cambiamento.
- Formatta gli euro con `Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" })`.

## 2. `Diversificazione` — il cuore della demo

È l interazione che la wiki descrive per intero (sezione 3, modulo 5) ed è
quella che la giuria vedrà.

Due scenari affiancati, con lo **stesso capitale ipotetico**:
- **A** — tutto su una sola azienda
- **B** — distribuito su dieci aziende

Un pulsante applica **lo stesso evento negativo ipotetico** a *una* azienda
(«questa azienda perde metà del suo valore»). Mostra visivamente cosa succede
al totale nei due scenari: in A crolla, in B si muove poco.

Vincoli didattici, da rispettare alla lettera:
- L evento è **ipotetico** e dichiarato tale nel testo.
- Non concludere mai che B sia la scelta «giusta» o «migliore» per l utente.
  La frase di chiusura descrive il meccanismo, non la scelta: «Distribuire
  cambia quanto un singolo evento pesa sul totale.» Nient altro.
- Nessun rendimento, nessuna probabilità reale.

Accessibilità: le barre non bastano. Ogni scenario ha il suo totale scritto in
cifre, e la variazione è annunciata in `aria-live`. Il colore non è mai l unico
veicolo: usa anche etichette e testo.

## 3. `ProprietaOPrestito` — la distinzione fondante

Serve la remediation della lezione `l6a`, quella che la wiki porta come esempio
del comportamento adattivo. Deve essere netta e memorabile.

Due colonne che confrontano, sulla stessa azienda ipotetica, la posizione di chi
**possiede** una quota e di chi **ha prestato** denaro: cosa hai in mano, cosa
ti spetta, cosa succede se l azienda va bene, cosa succede se va male, quando
finisce il rapporto.

Elemento interattivo minimo ma reale: due pulsanti a scelta singola
(«Sono proprietario» / «Ho prestato») che evidenziano la colonna corrispondente
e mostrano la conseguenza. Usa `role="tablist"` con `aria-selected`, oppure due
`<button>` con `aria-pressed` — non div cliccabili.

## 4. `AnatomiaStrumento` — le parti di uno strumento

Riceve `strumento?: TipoStrumento` (predefinito `titolo-stato`). Mostra lo
strumento scomposto nelle sue parti: emittente, capitale, cedola, scadenza —
e per l azione **l assenza** di cedola e scadenza, che è l informazione
didattica principale.

Ogni parte è un pulsante che rivela la spiegazione di quella parte.
Usa il pattern disclosure: `<button aria-expanded>` che controlla un pannello
con `id` collegato. Niente accordion fatti a mano con div.

**Non importare `strumenti.ts`** (lo scrive un altro agente in parallelo):
tieni dentro questo file un contenuto minimo e generico, corretto ma non
dipendente. Il ticket 07 potrà passare dati più ricchi in seguito se serve.

## Vincoli comuni

**Contenuto**: nessun dato di mercato, nessun rendimento, nessuna previsione,
nessuna classifica, nessuna raccomandazione. Ogni numero è ipotetico e
dichiarato tale nell interfaccia, non solo in un commento nel codice.

**Accessibilità** (`CLAUDE.md`, non negoziabile):
- Ogni visualizzazione ha un **equivalente testuale**: chi non vede il grafico
  riceve lo stesso contenuto educativo in parole. Non è un ripiego, è il
  requisito.
- HTML semantico. `<button>`, `<input>`, `<fieldset>`. Mai `<div onClick>`.
- Contrasto 4.5:1 per il testo, 3:1 per i componenti. Verifica con
  `node .claude/skills/accessibilita/contrast.mjs` prima di dichiarare finito.
- Tutto raggiungibile e usabile da tastiera, con focus visibile.
- Target minimo 24x24 px.
- Ogni animazione dentro `motion-safe:`.

**Stile**: solo utility Tailwind e i token già in `app/src/index.css`
(`accent`, `accent-text`, `ink`, `paper`, `surface`, `line`, `muted`).
Niente CSS inline, nessun file CSS nuovo, raggio 0, nessuna ombra.
Per le barre e i grafici usa div dimensionati con Tailwind o SVG inline —
**nessuna libreria di grafici**: ogni dipendenza costa build.

**Codice**: componenti funzionali, un componente per file, named export,
TypeScript strict, nessun `any`.

## Criteri di accettazione

- [ ] I quattro componenti esistono e sono registrati in `INTERATTIVI`
- [ ] Ognuno funziona senza passare prop
- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passano
- [ ] Nessuna nuova dipendenza npm
- [ ] Ogni interazione è possibile da sola tastiera
- [ ] Ogni cambiamento di valore è annunciato in `aria-live`
- [ ] Ogni visualizzazione ha il suo equivalente testuale
- [ ] Nessun numero presentato come dato reale; ogni ipotesi è dichiarata a schermo
- [ ] Nessuna frase suggerisce cosa sia meglio fare
- [ ] Nessun `any`, nessun CSS inline
