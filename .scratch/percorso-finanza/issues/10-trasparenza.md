# 10: Schermata trasparenza — i tre deliverable della consegna, dentro il prodotto

**Blocked by:** 01, 05
**Status:** ready-for-agent

Leggi prima `docs/brief-challenge.md`, `docs/wiki.md` (sezione 9),
`.scratch/percorso-finanza/spec.md` e `CLAUDE.md`.
Invoca le skill `accenture-brand` e `accessibilita`.

La consegna dell hackathon richiede tre deliverable obbligatori. La wiki li
mette fra i MUST HAVE con la formula «mandatory hackathon deliverables
represented clearly». Questa schermata li rende **parte del prodotto** invece
che un allegato: la giuria li trova dove sta guardando.

## File che possiedi

- `app/src/schermate/Trasparenza.tsx` — **esiste già come stub**: sostituisci il
  corpo mantenendo la firma.

```tsx
export function Trasparenza(): ReactElement;
```

Non toccare altri file. Ci si arriva dal collegamento nel piè di pagina, che
esiste già.

## Le quattro sezioni

**1. Che cosa è questo strumento — e cosa non è**
La *Risk & Clarity Note*, scritta per una persona, non per un ufficio legale.
Elenca in modo netto cosa l app non fa: non raccomanda investimenti, non
suggerisce cosa comprare o vendere, non classifica prodotti, non prevede
rendimenti, non profila l utente, non indica uno strumento «migliore».
E cosa garantisce: le definizioni e le caratteristiche degli strumenti reali
restano corrette; la semplificazione cambia le parole e le immagini, **mai** il
significato finanziario; gli strumenti citati sono esempi con dati statici,
non dati di mercato.

**2. La difficoltà da cui siamo partiti**
Lo *User Difficulty Statement*: chi ha 18-30 anni e poca educazione finanziaria
incontra inflazione, rischio, obbligazioni, azioni ed ETF senza capire come si
tengono insieme. Non è una mancanza di intelligenza: è una barriera cognitiva
che rende inaccessibile qualunque informazione finanziaria. Il prodotto la abbassa
costruendo i concetti in ordine, dai più semplici agli strumenti reali.

**3. Prima e dopo**
La *Before/After Simplicity Evidence*. Due colonne affiancate:

| Prima | Dopo |
|---|---|
| Vedo le parole BTP, obbligazione, azione, ETF, rischio, rendimento, diversificazione | So dire se sono proprietario o creditore |
| Non so spiegare cosa le distingue | So chi è l emittente |
| … | So cosa vuol dire rischio, e perché non si parla di rendimento senza parlarne |
| | So cosa vuol dire diversificare |
| | Conosco la struttura di base di ciascuno strumento |

E la riga che chiude: la differenza non la dichiariamo noi, la misurano la
valutazione iniziale e quella finale. Se `stato.risposteFinali` non è vuoto,
mostra il collegamento alla schermata `risultato`: la prova è a un clic.

**4. Come è fatto** — breve
Due o tre righe sulla capability software, perché la consegna valuta il COME:
il prodotto tiene un modello di prerequisiti fra dodici concetti, riconosce dalla
risposta sbagliata **quale** concetto manca, apre la micro-lezione di quel
concetto e riverifica con una domanda diversa. La padronanza si assegna solo
dopo una verifica superata, mai per aver letto una pagina.

## Come deve apparire

È una pagina di testo: qui la tipografia è tutto il design. Usa la voce
editoriale `font-serif` (GT Sectra Fine) per i titoli di sezione, misura di
riga leggibile (`max-w-prose`), molto spazio verticale fra le sezioni.
Nessuna card, nessun riquadro colorato: densità bassa, gerarchia chiara.

Il testo lo scrivi tu, in italiano semplice. Frasi corte. Dai del tu.
Niente gergo da compliance: la nota sui limiti deve essere la parte più chiara
della pagina, non la più illeggibile.

## Accessibilità

- Un `<h1>`, poi `<h2>` per le quattro sezioni: la pagina deve essere navigabile
  saltando fra le intestazioni.
- Il confronto prima/dopo è dato tabellare: `<table>` con `<th scope="col">`,
  oppure due liste con intestazioni proprie. Non due colonne di div affiancati.
- `max-w-prose` sul corpo: righe troppo lunghe sono un problema di leggibilità,
  non di gusto.
- Il testo regge lo zoom al 200% senza perdere contenuto.
- Un pulsante «Torna indietro» che riporta alla schermata precedente sensata
  (la mappa se il percorso è iniziato, altrimenti il benvenuto).

## Vincoli

- Solo utility Tailwind e token esistenti. Raggio 0, nessuna ombra, peso max 600.
- Nessuna nuova dipendenza, nessun `any`, named export.

## Criteri di accettazione

- [ ] `npm run typecheck`, `npm run lint` e `npm run build` passano
- [ ] Le quattro sezioni ci sono, con i tre deliverable riconoscibili
- [ ] La nota sui limiti è scritta in italiano semplice, non in gergo legale
- [ ] Il confronto prima/dopo è marcato come dato tabellare
- [ ] Ci si arriva dal piè di pagina e si può tornare indietro
- [ ] Leggibile al 200% di zoom senza perdita di contenuto
- [ ] Nessuna frase della pagina contraddice il divieto di consulenza
