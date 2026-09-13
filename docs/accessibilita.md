# Accessibilità — registro delle verifiche

> Aggiornato da `/audit`. Materiale per la slide "Accessibilità by design".

## Approccio

L'accessibilità non è una checklist finale: è un vincolo incorporato negli agenti che
scrivono il codice. L'agente `ui-builder` produce componenti conformi WCAG 2.2 AA per
costruzione; l'agente `a11y-auditor` verifica; lo script `contrast.mjs` calcola i
contrasti invece di stimarli.

## Verifiche eseguite

| Data | Ambito | Bloccanti | Seri | Minori |
|---|---|---|---|---|
| — | _nessun audit ancora eseguito_ | — | — | — |

## Contrasti del brand — valori misurati

| Combinazione | Rapporto | Esito |
|---|---|---|
| `#000000` su `#FFFFFF` | 21.0:1 | ✅ AAA |
| `#7500C0` su `#FFFFFF` | 8.34:1 | ✅ AAA |
| `#A100FF` su `#FFFFFF` | 5.3:1 | ✅ AA |
| `#5F5F5F` su `#F3F3F3` | 5.75:1 | ✅ AA |
| `#767676` su `#FFFFFF` | 4.54:1 | ✅ AA |
| `#A100FF` su `#000000` | 3.96:1 | ❌ solo testo grande |
| `#767676` su `#F3F3F3` | 4.09:1 | ❌ non conforme |
