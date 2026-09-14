---
description: Audit completo di accessibilità sull'interfaccia
argument-hint: [file o cartella da auditare, opzionale]
---

Lancia l'agente `revisore-accessibilita` su: ${ARGUMENTS:-tutta l'interfaccia in app/src e presentation/}

Poi:
1. Applica **tutte** le correzioni 🔴 BLOCCANTI e 🟠 SERIE.
2. Lascia le 🟡 MINORI come elenco, senza applicarle: costano tempo e non bloccano la demo.
3. Rilancia l'audit per confermare che i bloccanti siano spariti.
4. Aggiorna `docs/accessibilita.md` con il verdetto finale e la data — serve per la
   slide "Accessibilità by design" del pitch.
