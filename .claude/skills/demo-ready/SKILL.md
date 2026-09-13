---
name: demo-ready
description: Checklist e procedura per mettere in sicurezza la demo finale dell'hackathon - verifica tecnica, piano B, gestione del tempo di presentazione. Usala nell'ultima ora prima della consegna.
---

# Demo-ready — l'ultima ora

## Regola del tempo

Con 5 ore totali, **l'ultima ora non è tempo di sviluppo**. Ripartizione:

| Tempo | Attività |
|---|---|
| T-60' | **Feature freeze.** Nessuna funzionalità nuova. Solo bug bloccanti. |
| T-45' | Seed dei dati demo, pulizia dello stato, build di produzione |
| T-30' | Prova completa della demo, cronometrata |
| T-20' | Registrazione video di backup |
| T-10' | Commit finale, push, README aggiornato |
| T-5'  | Respirate. Aprite le finestre nell'ordine giusto. |

Chi scrive codice a T-10' perde la demo. È l'errore più comune degli hackathon.

## Checklist tecnica

**Build e avvio**
- [ ] `npm run check` passa (typecheck + lint + build)
- [ ] L'app parte da zero: `npm run dev` su una shell pulita
- [ ] Nessun errore rosso nella console del browser
- [ ] Nessun segreto nel bundle: `grep -r "sk-ant" app/dist/ || echo pulito`

**Dati**
- [ ] Il database ha dati demo credibili (nomi e cifre realistici, in italiano)
- [ ] Il percorso della demo è stato provato con **questi** dati
- [ ] Esiste un modo per resettare lo stato in 5 secondi se qualcosa va storto

**Rete — il rischio numero uno**
- [ ] La demo funziona **senza internet**? Se no, quali parti cadono?
- [ ] Il wifi dell'evento è lento: le chiamate all'API hanno un timeout e un fallback?
- [ ] Le risposte degli agenti sono cachate o pre-generate per il percorso della demo?

**Piano B**
- [ ] Video di backup registrato (schermo + audio), 2 minuti, sul desktop
- [ ] Screenshot delle 4 schermate chiave in `presentazione/assets/`
- [ ] Il deck da solo racconta la storia anche se l'app non parte

## Checklist presentazione

- [ ] Il deck apre offline (`npm run present`) — nessuna CDN
- [ ] Provata la transizione slide → app dal vivo → slide (è dove ci si impappina)
- [ ] Cronometrata: sta nel tempo assegnato **meno 30 secondi**
- [ ] Le slide su architettura, processo e uso degli agenti ci sono e sono curate
  (è il criterio dichiarato dell'evento: conta più il COME)
- [ ] Deciso chi parla di cosa, e chi guida il mouse
- [ ] Notifiche di sistema silenziate, browser senza tab personali aperte
- [ ] Zoom del browser al 100%, finestra già dimensionata

## Le tre domande della giuria

Preparate una risposta di 30 secondi per ciascuna:

1. **"Come avete lavorato?"** → gli agenti usati, chi ha fatto cosa, il flusso.
   Questa è *la* domanda: l'evento premia il processo.
2. **"Perché questa architettura?"** → la scelta e l'alternativa scartata, con il motivo.
3. **"Cosa manca per metterlo in produzione?"** → rispondete onestamente, tre punti.
   L'onestà qui vale più di una lista di feature.

## Ultimo commit

```bash
npm run check && git add -A && git commit -m "consegna finale hackathon" && git push
```
