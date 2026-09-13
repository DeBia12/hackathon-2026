---
description: Verifica, committa e pusha il lavoro corrente in sicurezza
argument-hint: [messaggio di commit opzionale]
---

Metti in sicurezza il lavoro corrente.

1. **Mostra cosa è cambiato**: `git status --short` e `git diff --stat`

2. **Controlla che non ci siano segreti**: cerca chiavi API nei file modificati.
   ```bash
   git diff --cached -U0 | grep -nE "sk-ant-|service_role|eyJhbGciOi" && echo "SEGRETO TROVATO" || echo "pulito"
   ```
   Se trovi qualcosa, **fermati** e segnalalo prima di committare.

3. **Esegui le verifiche**: `npm run check`
   Se fallisce, correggi gli errori prima di procedere. Non committare codice rotto:
   il compagno di team parte dal tuo `main`.

4. **Committa**: messaggio in italiano, all'imperativo, che dice *cosa cambia per
   l'utente* e non quali file hai toccato.
   Usa "$ARGUMENTS" come messaggio se l'ho fornito, altrimenti deducilo dal diff.

5. **Pusha**: se il branch non ha upstream, `git push -u origin HEAD`.

Riporta alla fine, in due righe: cosa hai committato e su quale branch.
