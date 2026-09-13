---
name: a11y-check
description: Strumenti e criteri per verificare l'accessibilità WCAG 2.2 AA - calcolo contrasti, checklist per tipo di componente, test da tastiera, pattern ARIA corretti. Usala quando scrivi o rivedi interfacce, slide o qualsiasi output visivo.
---

# Verifica accessibilità — WCAG 2.2 AA

## Calcolo contrasti

```bash
node .claude/skills/a11y-check/contrast.mjs "#A100FF" "#FFFFFF"
```

Restituisce il rapporto e il verdetto per ogni livello. Exit code 0 se passa AA per
testo normale, 1 se fallisce. **Calcola sempre, non stimare**: i valori sono
controintuitivi.

Soglie:
| Contenuto | AA | AAA |
|---|---|---|
| Testo normale (< 24px) | 4.5:1 | 7:1 |
| Testo grande (≥24px, o ≥18.66px bold) | 3:1 | 4.5:1 |
| Componenti UI, bordi, icone funzionali | 3:1 | — |

## Test da tastiera (30 secondi, trova il 60% dei problemi)

1. Clicca sulla barra degli indirizzi, poi premi **Tab** ripetutamente
2. Verifica: raggiungi **ogni** controllo? L'ordine segue la lettura?
3. Il focus è **sempre visibile**? (Se sparisce, c'è un `outline: none`)
4. **Invio** e **Spazio** attivano i controlli?
5. Nelle modali: **Esc** chiude? Il focus resta dentro finché è aperta?
6. Dopo la chiusura, il focus torna sull'elemento che l'ha aperta?

## Pattern corretti

**Bottone icona**
```tsx
<button type="button" aria-label="Chiudi finestra" className="min-h-11 min-w-11">
  <XIcon aria-hidden="true" />
</button>
```

**Campo con errore**
```tsx
<label htmlFor="importo">Importo in euro</label>
<input
  id="importo"
  type="text"
  inputMode="decimal"
  aria-describedby={errore ? "importo-errore" : "importo-aiuto"}
  aria-invalid={errore ? true : undefined}
/>
<p id="importo-aiuto" className="text-sm">Scrivi solo cifre, per esempio 150</p>
{errore && <p id="importo-errore" role="alert" className="text-sm">{errore}</p>}
```

**Contenuto che cambia senza ricaricare**
```tsx
<div aria-live="polite" aria-atomic="true">
  {stato === "salvato" && <p>Budget salvato. Hai 320 euro per questo mese.</p>}
</div>
```
`polite` attende una pausa; `assertive` interrompe — usalo solo per gli errori.

**Skip link** (prima cosa dentro `<body>`)
```tsx
<a href="#contenuto" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-ink focus:text-paper">
  Vai al contenuto principale
</a>
```

**Animazione rispettosa**
```tsx
<div className="motion-safe:transition-transform motion-safe:duration-200">
```

## Errori più frequenti in un prototipo

| Errore | Perché è grave | Correzione |
|---|---|---|
| `<div onClick>` | Invisibile a tastiera e screen reader | `<button type="button">` |
| `outline: none` | L'utente da tastiera si perde | `focus-visible:outline-2` |
| Placeholder al posto della label | Sparisce quando scrivi | `<label htmlFor>` |
| `alt` mancante | L'immagine è muta | `alt="..."` o `alt=""` |
| Solo colore per lo stato | Invisibile a chi non distingue i colori | Colore **+** icona **+** testo |
| Heading saltati (h1 → h3) | Rompe la navigazione per intestazioni | Gerarchia continua |
| `tabindex="5"` | Stravolge l'ordine di tabulazione | Solo `0` o `-1` |
| Target 32x32 con padding 0 | Difficile da toccare | `min-h-11 min-w-11` |

## Verifica automatica nel browser

Durante lo sviluppo, in console:
```js
// elementi cliccabili non semantici
document.querySelectorAll('[onclick]:not(button):not(a)').length

// immagini senza alt
[...document.images].filter(i => !i.hasAttribute('alt')).length

// input senza label associata
[...document.querySelectorAll('input,select,textarea')]
  .filter(el => !el.labels?.length && !el.getAttribute('aria-label')).length
```
Tutti e tre devono dare `0`.
