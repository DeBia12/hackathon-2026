---
description: Avvia una nuova feature - brief, decisione architetturale, branch e scheletro
argument-hint: [descrizione della feature o della tematica]
---

Devi avviare questo lavoro: **$ARGUMENTS**

Siamo in un hackathon da 5 ore. Procedi in quest'ordine, senza chiedere conferme
per i passaggi ovvi:

1. **Inquadra in 3 righe**: cosa costruiamo, per chi, qual è la singola cosa che deve
   funzionare nella demo. Se la richiesta è troppo vasta per il tempo rimasto, proponi
   la versione ridotta che resta dimostrabile e dillo esplicitamente.

2. **Registra la decisione** in `docs/decisioni.md` (append, non riscrivere):
   una riga con data, cosa abbiamo scelto, perché, cosa abbiamo scartato.

3. **Crea il branch**: `git checkout -b feat/<nome-breve>`

4. **Costruisci lo scheletro**: file e componenti vuoti ma tipizzati, con i nomi giusti.
   Non implementare la logica: serve la struttura su cui lavorare in parallelo in due.

5. **Dividi il lavoro**: elenca i task in due colonne, uno per ciascun membro del team,
   scegliendoli in modo che non tocchino gli stessi file (evita i conflitti di merge).

Usa l'agente `ui-builder` per i componenti e `supabase-dev` se serve persistenza.
