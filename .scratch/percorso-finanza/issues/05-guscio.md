# 05: Guscio dell applicazione, kit di componenti condivisi, schermata di benvenuto

**Blocked by:** 01
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `CLAUDE.md` e
`app/src/dominio/tipi.ts` + `app/src/stato/` (prodotti dal ticket 01).
Invoca le skill `accenture-brand` e `accessibilita`.

Costruisci l ossatura dentro cui cinque agenti, in parallelo dopo di te,
inseriranno le loro schermate. Il tuo lavoro vale per i **contratti** che lasci:
le firme degli stub e le props dei componenti condivisi sono vincolanti.

## File che possiedi (nessun altro li tocca)

- `app/src/App.tsx`
- `app/src/main.tsx`
- `app/index.html`
- `app/src/componenti/Intestazione.tsx`
- `app/src/componenti/PiePagina.tsx`
- `app/src/componenti/Domanda.tsx`
- `app/src/componenti/BarraProgresso.tsx`
- `app/src/componenti/DistintivoLivello.tsx`
- `app/src/componenti/PastigliaConcetto.tsx`
- `app/src/schermate/Benvenuto.tsx`
- gli **stub** di: `app/src/schermate/Mappa.tsx`, `Valutazione.tsx`, `Modulo.tsx`,
  `Risultato.tsx`, `Trasparenza.tsx`

**Non importare** `dominio/domande.ts`, `dominio/moduli.ts`, `dominio/strumenti.ts`,
`dominio/motoreAdattivo.ts`, `dominio/punteggio.ts`, `dominio/percorso.ts` né
`componenti/interattivi/`: li stanno scrivendo altri agenti adesso e non
esistono ancora. Puoi importare `dominio/tipi.ts`, `dominio/concetti.ts` e
tutto `stato/`.

Da questo vincolo discende la regola di progettazione: **i componenti condivisi
sono presentazionali**. Ricevono tutto dalle props, non calcolano niente.

## 1. Gli stub — firme vincolanti

Cinque file, ognuno con il suo componente che rende un segnaposto («In
costruzione»). Gli agenti dell onda successiva sostituiranno il corpo mantenendo
esattamente queste firme:

```tsx
// schermate/Mappa.tsx
export function Mappa(): ReactElement;

// schermate/Valutazione.tsx
export function Valutazione({ momento }: { momento: "iniziale" | "finale" }): ReactElement;

// schermate/Modulo.tsx
export function Modulo({ modulo }: { modulo: ModuloId }): ReactElement;

// schermate/Risultato.tsx
export function Risultato(): ReactElement;

// schermate/Trasparenza.tsx
export function Trasparenza(): ReactElement;
```

Ogni schermata legge da sé quel che le serve tramite `useApprendimento()`:
niente prop drilling dello stato.

## 2. `App.tsx` — instradamento su `stato.schermata`

Nessuna libreria di routing: la schermata corrente è nello stato.
`switch` esaustivo su `stato.schermata.nome` — con `strict` acceso, TypeScript
ti obbliga a coprire tutti i casi, ed è voluto.

Struttura: `<SkipLink />`, `<Intestazione />`, `<main id="contenuto">` con la
schermata corrente, `<PiePagina />`. `SkipLink` esiste già in
`componenti/SkipLink.tsx`: riusalo, non riscriverlo.

Al cambio di schermata sposta il focus sull `<h1>` della nuova schermata (o su
`<main>` con `tabIndex={-1}`) e annuncialo: in una app senza cambio di URL, chi
usa uno screen reader altrimenti non si accorge di essere altrove. È il difetto
di accessibilità più comune di questo tipo di applicazione.

`main.tsx`: avvolgi `<App />` in `<FornitoreApprendimento>`.
`index.html`: aggiorna `<title>` e la `<meta name="description">`. `lang="it"` c è già.

## 3. `Intestazione.tsx`

Il nome del prodotto — usa **Capitolo Zero** come nome di lavoro — con il segno
`>` viola davanti, come da brand. A destra, quando il percorso è iniziato:
`DistintivoLivello` e una `BarraProgresso` compatta. Un pulsante «Ricomincia»
che invia `{ tipo: "azzera" }`: serve alla demo, e serve poterlo premere due
volte di fila senza che l app si rompa.

Il livello e la percentuale arrivano **come props**, non calcolati qui.
Se le props sono assenti, l intestazione mostra solo il nome.

## 4. `PiePagina.tsx` — la nota che protegge il prodotto

Sempre visibile, su ogni schermata. Testo esatto del senso, non delle parole:

> Capitolo Zero è uno strumento didattico. Spiega e calcola: non dà consigli
> di investimento, non suggerisce cosa comprare o vendere, non confronta
> prodotti e non prevede rendimenti. Gli strumenti citati sono esempi, con
> dati statici a scopo di studio.

Con un collegamento alla schermata `trasparenza`
(`invia({ tipo: "vai-a", schermata: { nome: "trasparenza" } })`).

Non è un dettaglio legale messo lì per scrupolo: è il vincolo della consegna
reso visibile, e la giuria lo cerca.

## 5. `Domanda.tsx` — la card di domanda, usata da due schermate

Il componente più importante che produci: lo useranno sia la valutazione (06)
sia le lezioni (07). Presentazionale puro.

```tsx
interface PropsDomanda {
  domanda: DomandaTipo;                  // da dominio/tipi
  /** Indice e totale, per "Domanda 2 di 5". Assente nelle lezioni. */
  posizione?: { corrente: number; totale: number };
  /** L'opzione scelta, se già risposto. */
  scelta?: string;
  /** Mostrato dopo la risposta. Il chiamante lo calcola col motore adattivo. */
  esito?: { corretta: boolean; spiegazione: string };
  /** Assente durante le valutazioni: lì l'esito non si mostra subito. */
  mostraEsito?: boolean;
  onRispondi: (idOpzione: string) => void;
  onAvanti?: () => void;
  etichettaAvanti?: string;
}
export function Domanda(props: PropsDomanda): ReactElement;
```

Accessibilità, e qui non c è margine:
- `<fieldset>` + `<legend>` col testo della domanda, `<input type="radio">` con
  `<label>` associata per ogni opzione. **Mai** div cliccabili, mai `role="radio"`
  fatto a mano: il gruppo radio nativo dà già frecce, Home/End e annuncio corretto.
- Tutte le radio dello stesso gruppo condividono `name`; usa `useId()` per gli id.
- L esito compare in un contenitore `role="status"`, così viene annunciato.
- L esito non è veicolato dal solo colore: accanto va una parola («Corretto»,
  «Non ancora») e un simbolo con `aria-hidden`.
- Target ≥ 24x24 px, area cliccabile estesa a tutta la riga tramite la `<label>`.
- Dopo la risposta le opzioni si disabilitano, ma restano leggibili
  (contrasto: `disabled:opacity-50` sul testo scende sotto 4.5:1 — usa un altro
  modo, ad esempio `readOnly` visivo con il bordo attenuato e il testo pieno).

## 6. `BarraProgresso.tsx`

```tsx
interface PropsBarraProgresso {
  valore: number;          // 0-100
  etichetta: string;
  /** Compatta per l'intestazione, estesa per le schermate. */
  compatta?: boolean;
}
```

`role="progressbar"` con `aria-valuenow`, `aria-valuemin`, `aria-valuemax` e
`aria-label`. Il valore è **anche scritto in cifre**: una barra senza numero non
è leggibile da chi ha bassa visione. Riempimento `bg-accent`.

## 7. `DistintivoLivello.tsx`

```tsx
interface PropsDistintivoLivello {
  livello: string;         // "Principiante" | "Esploratore" | "Navigatore" | "Consapevole"
  concettiAcquisiti?: number;
  concettiTotali?: number;
}
```

Squadrato, bordo `accent-text`, testo `accent-text` su `paper`. Nessuna ombra.
Il livello è scritto per esteso: mai solo un colore o un icona.

## 8. `PastigliaConcetto.tsx`

```tsx
interface PropsPastigliaConcetto {
  nome: string;
  stato: "ignoto" | "in-corso" | "acquisito";
}
```

Tre stati distinguibili **senza colore**: testo diverso o simbolo con
equivalente testuale accessibile («acquisito», «in corso», «da vedere»).
Usa `<span>` con testo in `sr-only` se il simbolo da solo non basta.

## 9. `Benvenuto.tsx`

La prima schermata. Deve reggere lo sguardo di una giuria nei primi tre secondi.

- Titolo grande, peso 600, spaziatura negativa. Sotto, la promessa del prodotto:
  «Non ti diciamo dove mettere i tuoi soldi. Ti aiutiamo a capire cosa vogliono
  dire davvero i concetti e gli strumenti finanziari.»
- Tre righe che spiegano come funziona: misuriamo cosa sai, ti facciamo capire,
  rimisuriamo. È il PRIMA → APPRENDIMENTO → DOPO, ed è la storia del pitch.
- Un solo pulsante primario: «Inizia» →
  `invia({ tipo: "vai-a", schermata: { nome: "valutazione", momento: "iniziale" } })`.
- Se `stato.risposteIniziali.length > 0`, mostra anche «Riprendi» verso `mappa`.
- Molto spazio bianco. Una sola voce editoriale in `font-serif` (GT Sectra Fine),
  non di più: il serif è l accento, non il corpo.

## Vincoli

- Solo utility Tailwind e i token già in `index.css`. Niente CSS inline, nessun
  file CSS nuovo, raggio 0, nessuna ombra, titoli mai oltre peso 600.
- Movimento solo dentro `motion-safe:`, curva `cubic-bezier(0.85,0,0,1)` a 550ms.
- Riusa `componenti/ui/Button.tsx`, `Card.tsx`, `Field.tsx` e `SkipLink.tsx`:
  esistono già e sono conformi. Non duplicarli.
- Componenti funzionali, un componente per file, named export, nessun `any`.
- Nessuna nuova dipendenza npm.

## Criteri di accettazione

- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passano
- [ ] `npm run dev` mostra il benvenuto, e «Inizia» porta allo stub della valutazione
- [ ] Il cambio di schermata sposta il focus e lo annuncia
- [ ] `Domanda` è navigabile con Tab e frecce, e l esito è annunciato
- [ ] Nessun esito, stato o livello è veicolato dal solo colore
- [ ] Il piè di pagina con la nota didattica è visibile su ogni schermata
- [ ] «Ricomincia» azzera lo stato e può essere premuto due volte senza errori
- [ ] Gli stub hanno esattamente le firme dichiarate qui
- [ ] Nessun `any`, nessun CSS inline, nessuna dipendenza nuova
