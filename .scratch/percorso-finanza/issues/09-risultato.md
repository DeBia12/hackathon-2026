# 09: Schermata risultato — PRIMA vs DOPO

**Blocked by:** 01, 02, 04, 05
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezione 8),
`CLAUDE.md`, e il codice già presente: `dominio/punteggio.ts`, `concetti.ts`,
`stato/`, `componenti/BarraProgresso.tsx`, `componenti/DistintivoLivello.tsx`.
Invoca le skill `accenture-brand` e `accessibilita`.

La wiki la chiama «the PRIMARY WOW MOMENT of the demo». È l ultima schermata che
la giuria vede e quella che decide se il prodotto ha dimostrato qualcosa.
Trattala come tale: qui il tempo speso sulla resa visiva è ben speso.

## File che possiedi

- `app/src/schermate/Risultato.tsx` — **esiste già come stub**: sostituisci il
  corpo mantenendo la firma.
- `app/src/componenti/ConfrontoAree.tsx` (nuovo)

```tsx
export function Risultato(): ReactElement;
```

## Cosa mostra

```ts
const prima = calcolaProfilo(stato.risposteIniziali, CONCETTI);
const dopo  = calcolaProfilo(stato.risposteFinali, CONCETTI);
const esito = confronta(prima, dopo);
```

Tre blocchi, in quest ordine di gerarchia visiva:

**1. Il numero grande.** `40% → 80%`, con il delta in evidenza
(`+40 punti percentuali`). È l elemento più grande della pagina, di gran lunga.
La freccia è decorativa (`aria-hidden`); il senso è nel testo.

**2. Il confronto per area** — `ConfrontoAree.tsx`. Cinque righe, una per area,
ognuna con il valore prima, il valore dopo e la variazione:

```
Le basi del denaro        50%  →  100%    +50
Inflazione                 0%  →  100%   +100
Rischio e rendimento      50%  →  100%    +50
Diversificazione           0%  →  100%   +100
Strumenti finanziari       0%  →   50%    +50
```

Rendila come una tabella vera (`<table>` con `<th scope>`), non come un insieme
di div: è dato tabellare e uno screen reader deve poterlo leggere per righe.
Le barre affiancate sono un di più visivo sopra il dato, non al posto suo.

**3. Cosa sai dire adesso.** L elenco dei concetti `acquisito`, ognuno con il suo
`inUnaRiga` da `CONCETTI`. È la prova concreta dell apprendimento: non «hai letto
6 moduli», ma «sai distinguere un proprietario da un creditore». Usa
`PastigliaConcetto` o una lista.

In chiusura, il `DistintivoLivello` raggiunto e un pulsante «Ricomincia».

## Se manca la valutazione finale

Se `stato.risposteFinali` è vuoto, non mostrare zeri: mostra il profilo iniziale
e un pulsante che porta alla valutazione finale. Non deve mai apparire un
`+0 punti` o una tabella di zeri per il semplice fatto che si è arrivati qui
troppo presto — davanti alla giuria sembrerebbe un difetto.

Gestisci anche il caso di un peggioramento (delta negativo): il testo deve
reggere senza sembrare rotto e senza colpevolizzare.

## Il principio da rendere visibile

La wiki lo scrive esplicitamente, e vale la pena metterlo a schermo:

> Non misuriamo quanti contenuti hai letto. Misuriamo cosa hai capito.

## Accessibilità

- Un solo `<h1>`. Gerarchia di intestazioni corretta.
- La variazione non è mai affidata al solo colore: segno `+`/`−` e parola.
- Tabella semantica con intestazioni di riga e di colonna.
- Se animi la comparsa dei numeri, solo dentro `motion-safe:` e con la curva del
  brand; il valore finale deve essere presente nel DOM da subito, non solo alla
  fine dell animazione.
- Contrasto verificato con `node .claude/skills/accessibilita/contrast.mjs`.

## Vincoli

- Solo utility Tailwind e token esistenti. Raggio 0, nessuna ombra, peso max 600.
- Nessuna libreria di grafici, nessuna nuova dipendenza: barre in div o SVG inline.
- Nessun `any`. Named export, TypeScript strict, un componente per file.
- Nessuna frase che trasformi il risultato in un consiglio («ora sei pronto a
  investire in…»): il prodotto misura la comprensione e si ferma lì.

## Criteri di accettazione

- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passano
- [ ] Il confronto complessivo è l elemento dominante della pagina
- [ ] Le cinque aree compaiono sempre tutte, anche quelle a 0
- [ ] La tabella è navigabile e leggibile da screen reader
- [ ] Senza valutazione finale la schermata resta sensata e propone di farla
- [ ] Un delta negativo non rompe il testo né colpevolizza
- [ ] I concetti acquisiti sono elencati con la loro definizione in una riga
- [ ] Nessuna variazione veicolata dal solo colore
