# 11: Mappa del percorso — sblocco progressivo e gamification

**Blocked by:** 01, 03, 04, 05
**Status:** ready-for-agent

Leggi prima `.scratch/percorso-finanza/spec.md`, `docs/wiki.md` (sezioni 3 e 7),
`CLAUDE.md`, e il codice già presente: `dominio/moduli.ts`, `dominio/percorso.ts`,
`dominio/concetti.ts`, `stato/`, `componenti/BarraProgresso.tsx`,
`componenti/DistintivoLivello.tsx`, `componenti/PastigliaConcetto.tsx`.
Invoca le skill `accenture-brand` e `accessibilita`.

È la schermata su cui l utente torna dopo ogni modulo, e quella che rende
visibile il progresso. La wiki chiede uno stile «professional fintech, not
childish»: nessun cartoon, nessuna medaglia scintillante, nessun coriandolo.

## File che possiedi

- `app/src/schermate/Mappa.tsx` — **esiste già come stub**: sostituisci il corpo
  mantenendo la firma.
- `app/src/componenti/RigaModulo.tsx` (nuovo)

```tsx
export function Mappa(): ReactElement;
```

## Cosa mostra

**In alto: dove sei.**
`avanzamento(stato, CONCETTI)` da `percorso.ts` dà livello, concetti acquisiti su
dodici e percentuale. Mostra `DistintivoLivello` e una `BarraProgresso` estesa.
Sotto, in una riga: quanti concetti mancano al livello successivo.

Il progresso premia la **comprensione dimostrata**, non le pagine viste: la
percentuale viene dai concetti `acquisito`, e vale la pena scriverlo a schermo
in una riga — è un principio del prodotto, non un dettaglio.

**Al centro: i sei moduli.**
`statoModuli(MODULI, stato)` dà lo stato di ciascuno. Una `RigaModulo` per modulo:

```
1  Il denaro e il suo valore        Completato
2  L'inflazione                     Completato
3  Risparmiare o investire          Completato
4  Rischio e rendimento             In corso
5  La diversificazione              Bloccato — completa il modulo 4
6  Gli strumenti finanziari         Bloccato — completa il modulo 5
```

- `completato` e `disponibile` e `in-corso`: la riga è un `<button>` che porta a
  `{ nome: "modulo", modulo: id }`.
- `bloccato`: **non** è un pulsante disabilitato muto. È un elemento con
  `aria-disabled="true"` e un testo che dice **perché** è bloccato e cosa fare
  per sbloccarlo. Un blocco senza spiegazione è la frustrazione tipica di questi
  prodotti, ed è anche un difetto di accessibilità.
- Sotto ogni modulo, le `PastigliaConcetto` dei suoi concetti con il loro stato:
  è il collegamento visibile fra «modulo» e «cosa ho capito».

**In fondo: la valutazione finale.**
Quando tutti i moduli sono completati, un blocco in evidenza porta a
`{ nome: "valutazione", momento: "finale" }` — «Rimisuriamo quello che sai».
Prima di allora, il blocco c è ma spiega quanto manca; non nasconderlo, sapere
dove si va a finire aiuta a proseguire.

Se `stato.risposteFinali` non è vuoto, mostra anche un collegamento al
`risultato`: durante la demo si torna spesso su quella schermata.

## Un dettaglio che serve alla demo

Vale la pena un pulsante secondario, discreto, «Vai alla valutazione finale»
sempre attivo. In una demo dal vivo si deve poter saltare al momento wow senza
completare sei moduli, e cinque ore non bastano per una modalità demo vera.
Mettilo in basso, come azione secondaria, con un etichetta onesta. Non nasconderlo
dietro una scorciatoia da tastiera segreta: se la giuria lo vede, va bene così.

## Accessibilità

- I moduli sono una lista (`<ol>`): sono in sequenza, e la sequenza è informazione.
- Ogni riga ha un nome accessibile completo — numero, titolo e stato — non solo
  il titolo: chi naviga per elementi interattivi sente «Modulo 5, La
  diversificazione, bloccato», non «La diversificazione».
- Gli stati non sono mai veicolati dal solo colore: c è sempre la parola.
- Target ≥ 24x24 px, righe alte abbastanza da essere colpite senza precisione.
- Focus visibile su ogni riga; nessuna trappola.

## Vincoli

- Solo utility Tailwind e token esistenti. Raggio 0, nessuna ombra, peso max 600.
- Molto spazio bianco: sei righe e un intestazione, non una dashboard densa.
- Movimento solo dentro `motion-safe:`.
- Nessuna nuova dipendenza, nessun `any`, named export, un componente per file.
- Niente linguaggio infantile, niente emoji, niente esclamazioni.
- Nessuna frase che suggerisca scelte di investimento.

## Criteri di accettazione

- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passano
- [ ] I sei moduli compaiono con lo stato corretto calcolato da `percorso.ts`
- [ ] Un modulo bloccato spiega perché lo è e cosa serve per sbloccarlo
- [ ] Livello e percentuale derivano dai concetti acquisiti, non dalle lezioni viste
- [ ] Ogni riga ha un nome accessibile che include numero, titolo e stato
- [ ] Nessuno stato affidato al solo colore
- [ ] Esiste un accesso diretto alla valutazione finale, utilizzabile in demo
- [ ] Tutto raggiungibile da tastiera con focus visibile
