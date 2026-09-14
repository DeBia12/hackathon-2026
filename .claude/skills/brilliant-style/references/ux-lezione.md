# Il pattern della lezione Brilliant

Lo stile visivo si copia in un'ora. Questo è quello che rende Brilliant *Brilliant*, e sta
quasi tutto nella struttura dell'interazione. Vale per qualunque argomento, non solo
matematica.

## La forma della schermata

```
┌──────────────────────────────────────────┐
│ ▓▓▓▓░░░░ ░░░░ ░░░░ ░░░░   Passo 2 di 5   │  progresso sempre in alto
├──────────────────────────────────────────┤
│                                          │
│   La domanda, in una frase.              │  una domanda per schermata
│                                          │
│   [ l'oggetto con cui si gioca ]         │  si manipola, non si legge
│                                          │
│   ○ opzione A                            │  risposte come bottoni alti
│   ○ opzione B                            │
│   ○ opzione C                            │
│                                          │
├──────────────────────────────────────────┤
│ ✓ Esatto: 40%.            [ Continua ]   │  il feedback arriva dal basso
│   600 diviso 1.500 fa 0,4…               │  e spiega il perché
└──────────────────────────────────────────┘
```

## Le sei regole

### 1. Una domanda per schermata

Niente scroll dentro un passo, niente form con quattro campi. Se una schermata contiene
due domande, sono due schermate. Il costo cognitivo di ogni passo deve restare così basso
da non far mai pensare "salto".

### 2. Si manipola prima di leggere

L'oggetto della lezione è interattivo: uno slider che muove un valore, un grafico che si
tocca, tre cartellini da ordinare. La spiegazione arriva **dopo** il tentativo, quando c'è
già una domanda in testa a cui rispondere. Una lezione che spiega e poi verifica è un
libro con dei quiz in fondo: è il modello opposto.

In un'app finanziaria, i tre oggetti manipolabili che funzionano meglio:

- **lo slider con esito immediato** — muovi l'importo mensile, vedi il totale a 10 anni
- **la ripartizione da spostare** — tre categorie di spesa, somma sempre 100%
- **l'ordinamento** — metti in ordine i passi, o le voci dalla più cara alla meno cara

### 3. Il feedback è immediato e spiega il perché

Mai la sola parola "Sbagliato". Due righe che dicono da dove viene il numero giusto,
nella lingua di chi legge:

> **Esatto: 40%.** 600 diviso 1.500 fa 0,4. Moltiplicato per 100 sono 40 su 100, cioè
> 40 centesimi di ogni euro che entra.

Per le risposte sbagliate, la regola migliore è **nominare l'errore**, non solo correggerlo:
"Hai calcolato 1.500 diviso 600. Il rapporto va nell'altro verso: la parte sul totale."

### 4. L'errore non costa niente

Nessuna vita persa, nessun punteggio che scende, nessun ritorno all'inizio. Si riprova
sulla stessa schermata, con lo stato intatto. Chi ha soggezione dell'argomento — ed è
esattamente il pubblico dell'educazione finanziaria — abbandona alla prima punizione.

### 5. Il progresso è visibile e granulare

Una barra a segmenti in alto: tanti segmenti quanti sono i passi. Si riempie a ogni passo
concluso. Conta più la **granularità** della precisione: cinque segmenti che si riempiono
motivano più di una percentuale che va dal 34% al 41%.

### 6. La chiusura celebra un numero

A fine lezione, una schermata sola con: quanti passi hai fatto, quanti giorni di fila,
quanto ci hai messo. Un numero grande, in serif, e un bottone. Niente coriandoli infiniti.

---

## Accessibilità: i sei punti dove questo pattern si rompe

Il pattern di Brilliant, preso alla lettera, ha sei buchi. Vanno chiusi tutti.

| Buco | Come si chiude |
|---|---|
| L'esito è dato dal solo colore | Ogni stato porta **icona + testo**: `✓ Esatto` / `✕ Non ci siamo` |
| Il feedback appare senza essere annunciato | Il contenitore ha `role="status"` (o `role="alert"` se blocca) |
| Le opzioni sono `<div onClick>` | Sono `<button type="button">`, oppure `<label>` + `<input type="radio">` |
| Il progresso è solo visivo | `role="img"` con `aria-label="Passo 2 di 5"`, o `<progress>` |
| Lo shake comunica l'errore | Con `prefers-reduced-motion` l'errore resta leggibile da icona e testo |
| Il drag è l'unico modo di rispondere | Ogni manipolazione ha un equivalente da tastiera: frecce sugli slider, bottoni su/giù sugli ordinamenti |

Sull'ultimo punto, il criterio WCAG 2.2 che lo impone è **2.5.7 Dragging Movements**
(AA): se un'azione si fa trascinando, deve esistere un'alternativa a singolo puntatore.
Uno slider `<input type="range">` nativo lo soddisfa già; un cartellino trascinabile no,
e vanno aggiunti i bottoni.

---

## Cosa lasciare fuori, in un'app di educazione finanziaria

- **Le leghe e le classifiche.** Mettono in competizione persone che stanno imparando a
  gestire i propri soldi. Il confronto sociale su questo argomento produce vergogna, non
  motivazione.
- **Il timer sulla risposta.** La fretta è il contrario della comprensione.
- **Le vite o i cuori.** Vedi la regola 4.
- **Le notifiche che rimproverano** ("Hai perso la serie!"). La serie si mostra quando c'è,
  e sparisce in silenzio quando si interrompe.

Restano invece: progresso, serie, tempo di lettura dichiarato, e la chiusura che celebra
un numero. Sono tutti riferiti alla persona sola, non agli altri.
