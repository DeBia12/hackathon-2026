# Accessibilità — registro delle verifiche

> Aggiornato da `/audit`. Materiale per la slide "Accessibilità by design".

## Approccio

L'accessibilità non è una checklist finale: è un vincolo incorporato negli agenti che
scrivono il codice. L'agente `ui-builder` produce componenti conformi WCAG 2.2 AA per
costruzione; l'agente `revisore-accessibilita` verifica; lo script `contrast.mjs` calcola i
contrasti invece di stimarli.

## Verifiche eseguite

| Data | Ambito | Bloccanti | Seri | Minori |
|---|---|---|---|---|
| 2026-09-13 | Template del design system (`accenture-brand`) | 2 | 3 | 2 |
| 2026-09-14 | Percorso «Capitolo Zero» — interfaccia completa | 3 | 2 | 4 |

**2026-09-13 — template `accenture-brand`.** Corretti 6 problemi su 7. I due bloccanti:
`class="js"` nel markup di `<html>` rendeva il contenuto invisibile per sempre senza
JavaScript; il selettore `body:not(.acn-light) :focus-visible` era sempre vero e applicava
l'anello di focus chiaro anche sulle sezioni chiare (1.6:1). Non applicata, per scelta
motivata, la ristrutturazione delle card da `<a><h3>` a `<article>` + `aria-labelledby`:
manteniamo il target cliccabile esteso.

**2026-09-14 — percorso «Capitolo Zero», interfaccia completa.** Audit su tutta la UI
(`App.tsx`, 6 schermate, 13 componenti, 4 visualizzazioni interattive) eseguito da
`revisore-accessibilita` in contesto separato, su codice scritto da altri undici agenti.
**3 bloccanti corretti, 2 seri corretti, 4 minori** (2 corretti, 2 accettati).

I tre bloccanti erano tutti difetti di *cucitura* fra pezzi scritti in parallelo, non
errori di singoli componenti — esattamente il rischio dell'orchestrazione a più agenti:

1. **`<main>` annidato in `Mappa.tsx`.** Il guscio (ticket 05) forniva già
   `<main id="contenuto">`; la mappa (ticket 11) ne apriva un secondo dentro, con lo
   stesso `id` a cui punta lo skip link. Due landmark principali e un `id` duplicato:
   HTML invalido, e lo skip link poteva atterrare sull'elemento sbagliato.
   Corretto: la mappa rende un `<div>`, il landmark resta uno solo.
2. **Focus perso a ogni passo della micro-lezione.** Passando da VEDI a CAPISCI a PROVA,
   il pulsante col focus spariva dal DOM e il focus tornava su `<body>` senza annuncio.
   È il corpo del percorso educativo: da tastiera diventava inutilizzabile.
   Corretto con `useEffect` sul cambio di fase che porta il focus sull'intestazione.
3. **Stesso difetto nel passaggio lezione → riverifica** dentro la remediation, che è il
   momento in cui il cambio di contesto è più brusco e l'annuncio serve di più.

I due seri:
- Le tre live region delle visualizzazioni interattive avevano `aria-live` ma non
  `aria-atomic`: alcuni screen reader avrebbero letto solo il frammento cambiato, senza
  la frase di contesto. Il resto dell'app usava già la coppia completa — incoerenza fra
  agenti diversi.
- `border-line` (`#E3E3DF`) su bianco misura **1.29:1**, contro i 3:1 che WCAG 1.4.11
  chiede ai confini dei componenti interattivi. Riguardava il bordo delle opzioni di
  risposta non selezionate e le voci di `AnatomiaStrumento`. Passato a `#5F5F5F`
  (**6.39:1**), misurato con `contrast.mjs`.

Minori corretti: `aria-disabled` rimosso dai `<li>` dei moduli bloccati (il ruolo
`listitem` non ha stato disabilitato: la spiegazione testuale interna è il vero
meccanismo accessibile); radio delle visualizzazioni portati a 24×24 px (WCAG 2.2, 2.5.8).

Minori accettati: un `setTimeout(50)` per il focus in `Remediation.tsx` invece di un
effetto — funziona, il caso peggiore è che il focus non si sposti; e `stato.xp`, che
resta nello stato persistito senza essere letto da nessuna schermata.

**Verificato anche nel browser**, non solo nel codice: valutazione iniziale, mappa,
lezione, errore deliberato, remediation, riverifica e padronanza scritta in
`localStorage`. È da lì che è emerso un problema che nessun controllo di accessibilità
poteva cogliere: il sottotitolo del modulo 5 diceva «perché distribuire è meglio che
concentrare», cioè una raccomandazione, che la consegna vieta.


## Contrasti del brand — valori misurati

Valori ricavati dal design system estratto da accenture.com (vedi
`.claude/skills/accenture-brand/SKILL.md`).

**Fondi chiari**

| Combinazione | Rapporto | Esito |
|---|---|---|
| `#000000` su `#FFFFFF` | 21.0:1 | ✅ AAA |
| `#000000` su `#F1F1EF` | 18.57:1 | ✅ AAA |
| `#7500C0` su `#FFFFFF` | 8.34:1 | ✅ AAA |
| `#7500C0` su `#F1F1EF` | 7.38:1 | ✅ AAA |
| `#5F5F5F` su `#FFFFFF` | 6.39:1 | ✅ AA |
| `#5F5F5F` su `#F1F1EF` | 5.65:1 | ✅ AA |
| `#A100FF` su `#FFFFFF` | 5.3:1 | ✅ AA |
| `#A100FF` su `#F1F1EF` | 4.69:1 | ✅ AA (poco margine) |

**Fondi scuri**

| Combinazione | Rapporto | Esito |
|---|---|---|
| `#FFFFFF` su `#000000` | 21.0:1 | ✅ AAA |
| `#FFFFFF` su `#202020` | 16.29:1 | ✅ AAA |
| `#FFFFFF` su `#39005E` | 15.72:1 | ✅ AAA |
| `#FFFFFF` su `#460073` | 13.93:1 | ✅ AAA |
| `#DCAFFF` su `#000000` | 11.62:1 | ✅ AAA (anello di focus) |
| `#A2A2A0` su `#000000` | 8.21:1 | ✅ AAA |
| `#BE82FF` su `#000000` | 7.83:1 | ✅ AAA |
| `#FFFFFF` su `#A100FF` | 5.3:1 | ✅ AA |

**Da evitare — sono facili da usare per sbaglio**

| Combinazione | Rapporto | Perché |
|---|---|---|
| `#A100FF` su `#000000` | 3.96:1 | ❌ solo testo grande — su scuro usa `#BE82FF` |
| `#A2A2A0` su `#FFFFFF` | 2.56:1 | ❌ è il grigio dei fondi scuri — su chiaro usa `#5F5F5F` |
| `#BE82FF` su `#F1F1EF` | 2.37:1 | ❌ è il viola dei fondi scuri — su chiaro usa `#7500C0` |
| `#DCAFFF` su `#F1F1EF` | 1.6:1 | ❌ anello di focus invisibile — su chiaro usa `#A100FF` |
