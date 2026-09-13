# Presentazione

Deck Reveal.js con tema brand Accenture. **Funziona offline**: nessuna CDN, nessun font remoto.

## Avvio

```bash
npm run present      # dalla radice del progetto → http://localhost:8000
```

## Comandi durante la presentazione

| Tasto | Azione |
|---|---|
| `→` / `Spazio` | Slide successiva |
| `←` | Slide precedente |
| `S` | Apre le note per chi parla (finestra separata) |
| `O` | Panoramica di tutte le slide |
| `F` | Schermo intero |
| `B` | Schermo nero (utile durante le domande) |

## Export in PDF

Apri `http://localhost:8000/?print-pdf` e stampa con Chrome (Salva come PDF,
margini "Nessuno", grafica di sfondo attiva).

## Struttura

Le slide 5, 6 e 7 — architettura, processo, accessibilità — sono quelle che pesano
di più nella valutazione: l'evento premia il **come** più del risultato.

## Classi disponibili

`.slide-dark` · `.big-number` · `.caption` · `.accent` · `.two-col` · `.arch-box` ·
`.step` · `.senza-segno` (rimuove il `>` dal titolo)
