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

**2026-09-13 — template `accenture-brand`.** Corretti 6 problemi su 7. I due bloccanti:
`class="js"` nel markup di `<html>` rendeva il contenuto invisibile per sempre senza
JavaScript; il selettore `body:not(.acn-light) :focus-visible` era sempre vero e applicava
l'anello di focus chiaro anche sulle sezioni chiare (1.6:1). Non applicata, per scelta
motivata, la ristrutturazione delle card da `<a><h3>` a `<article>` + `aria-labelledby`:
manteniamo il target cliccabile esteso.

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
