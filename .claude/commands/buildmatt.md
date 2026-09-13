---
description: Orchestratore dal requisito al codice — segue il flusso di Matt Pocock e distribuisce i ticket a subagent con contesto fresco
argument-hint: [cosa vuoi costruire] [--rapido | --solo-piano | --solo-build]
---

Devi costruire: **$ARGUMENTS**

Sei l'orchestratore. Segui il flusso principale delle skill di Matt Pocock
nell'ordine previsto, e distribuisci l'implementazione a subagent, uno per ticket.

## Il principio che governa tutto

Il metodo esiste per proteggere **una cosa sola**: la qualità del ragionamento dentro
una finestra di contesto. Oltre i ~150k token il modello resta fluente ma smette di
ragionare bene, e non lo dichiara.

Da qui discendono le due regole strutturali:

1. **La pianificazione sta tutta in una finestra.** Grilling, specifica e ticket si
   costruiscono l'uno sull'altro: servono il ragionamento testuale, non un riassunto.
   Non compattare e non azzerare il contesto finché i ticket non esistono.
2. **Ogni ticket parte da zero.** Un subagent per ticket: il suo contesto fresco è
   l'equivalente di un `/clear`, e il ticket è scritto apposta per bastare da solo.

## Modalità

| Argomento | Comportamento |
|---|---|
| *(nessuno)* | Flusso completo: grilling → specifica → ticket → implementazione → revisione |
| `--rapido` | Salta grilling e specifica. Per lavori piccoli e già chiari |
| `--solo-piano` | Si ferma dopo i ticket, non implementa |
| `--solo-build` | Parte da ticket che esistono già |

Matt stesso prevede la scorciatoia: se il lavoro sta in una sessione e non c'è niente
da chiarire, si va dritti all'implementazione. **Non imporre la cerimonia completa a
un lavoro da mezz'ora**: proponi `--rapido` tu stesso se la richiesta è già precisa.

---

## Passo 0 — Precondizioni

```bash
ls docs/agents/issue-tracker.md 2>/dev/null || echo "NON CONFIGURATO"
```

Se manca, il tracker non è configurato: le skill `to-tickets` e `to-spec` non sanno
dove scrivere. Dillo all'utente e proponi `/setup-matt-pocock-skills` (una volta per
repository). Se preferisce partire subito, usa i file locali sotto
`.scratch/<nome-lavoro>/issues/` e segnalalo.

Verifica anche di essere su un branch di lavoro, non sul principale:
```bash
git branch --show-current
```
Se sei su `main`, crea `feat/<nome-breve>` prima di toccare qualsiasi cosa.

---

## Passo 1 — Affilare l'idea (con l'utente)

> Salta se `--rapido` o `--solo-build`.

Invoca la skill **`grill-with-docs`**.

**Questa fase non è delegabile a un subagent.** È un'intervista: i fatti li porta
l'agente, le decisioni le prende l'utente. Un subagent che intervista se stesso
produce un consenso con se stesso, che è esattamente ciò che il metodo vuole evitare.

Se emerge una domanda che si risolve solo vedendo del codice girare — un modello di
stato che non convince, un'interazione da provare — fermati e invoca **`prototype`**:
codice usa-e-getta che risponde a *quella* domanda. Poi torna qui con la risposta.

Se serve documentazione o verifica di fatti esterni, invoca **`research`** in
background e continua a lavorare mentre legge.

---

## Passo 2 — Il bivio

Poni all'utente **una domanda sola**:

> Questo lavoro sta in una sessione di lavoro, o va spezzato?

- **Sta in una sessione** → salta il Passo 3, vai al 4 con un ticket unico implicito.
- **Va spezzato** → Passo 3.

Non chiederlo se è ovvio: decidi tu e dichiara la scelta.

---

## Passo 3 — Specifica e ticket

> Salta se `--rapido` o `--solo-build`.

**3a.** Invoca **`to-spec`**: comprime la conversazione in una specifica. Nessuna
intervista, solo sintesi di quanto già discusso.

**3b.** Invoca **`to-tickets`**: spezza la specifica in ticket *tracer bullet*.

Non riassumere tu il risultato: la skill fa già un giro di conferma con l'utente
sulla granularità e sulle dipendenze. Lascia che lo faccia.

Ricorda le proprietà che i ticket devono avere, perché è su queste che si regge
tutto il passo successivo:

- **fetta verticale**: attraversa tutti i livelli, è dimostrabile da sola
- **dimensionata per una finestra di contesto fresca**
- **dichiara i suoi bloccanti**

Se i ticket prodotti non hanno queste proprietà, l'orchestrazione fallisce a valle:
dillo e fai rifare il taglio.

> Con `--solo-piano`, fermati qui e riporta dove sono finiti i ticket.

---

## Passo 4 — Distribuire il lavoro

Qui diventi un vero orchestratore.

**4a. Calcola la frontiera con lo script, non a occhio.**

```bash
node .claude/scripts/frontiera.mjs
```

Restituisce i ticket pronti a partire, quelli in attesa e con cosa sono bloccati.
Segnala anche i **bloccanti inesistenti**: un ticket che attende un numero che
nessuno produrrà resterebbe fermo per sempre, e leggendo i ticket a occhio non te
ne accorgi.

Dedurre le dipendenze leggendo i file funziona finché i ticket sono tre. Usa lo
script: è deterministico e costa un secondo. Con `--json` ottieni l'elenco in forma
strutturata.

Se il tracker è GitHub e non file locali, interroga quello:
```bash
gh issue list --label ready-for-agent --json number,title,body
```

**4b. La frontiera.**

La **frontiera** è l'insieme dei ticket i cui bloccanti sono tutti completati.
All'inizio sono quelli senza bloccanti. Man mano che i subagent riportano, marca i
ticket completati (`**Status:** done`) e ricalcola.

**4c. Decidi cosa può girare in parallelo.**

Due subagent che scrivono contemporaneamente negli stessi file si sovrascrivono a
vicenda. La regola:

- **In parallelo** solo ticket che stanno nella frontiera **e** toccano insiemi di
  file disgiunti. Lancia i subagent in un unico messaggio, così girano davvero
  insieme.
- **In sequenza** tutto il resto. Nel dubbio, sequenza: un conflitto costa più di
  quanto il parallelismo faccia risparmiare.
- Se l'utente chiede parallelismo spinto su ticket che si sovrappongono, usa
  `isolation: "worktree"` così ogni agente lavora su una copia isolata — ma avvisa
  che poi i risultati vanno riuniti a mano.

**4d. Lancia un `matt-implementer` per ogni ticket della frontiera.**

Nel messaggio al subagent metti **solo**:
- il percorso del ticket
- il branch su cui lavorare
- i file che *non* deve toccare (quelli assegnati ai suoi contemporanei)

Non passargli la storia della sessione: il suo contesto pulito è una caratteristica,
non una mancanza.

**4e. Raccogli, aggiorna, ripeti.**

Quando un subagent riporta:
- `completato` → segna il ticket come fatto, ricalcola la frontiera
- `completato con riserve` → registra la riserva, prosegui
- `bloccato` → **non rilanciarlo uguale**. Leggi cosa ha osservato. Se è un difetto
  nel codice, invoca la skill `diagnosing-bugs` qui, nel contesto principale. Se è
  un difetto nel ticket, correggi il ticket e rilancia.

Continua finché la frontiera è vuota. Fra un giro e l'altro riporta all'utente una
riga sola: quali ticket sono chiusi e quali restano.

---

## Passo 5 — Revisione a contesto pulito

Quando i ticket sono finiti, lancia **un solo** `matt-reviewer`, passandogli il punto
di partenza del confronto (il commit da cui sei partito) e dove stanno i ticket.

**Questo agente non deve essere uno di quelli che ha scritto il codice.** È il motivo
per cui la revisione gira separata: chi ha appena scritto qualcosa tende ad
approvarla, perché ricorda perché ogni scelta gli sembrava giusta.

Con i rilievi che tornano:
- 🔴 **bloccanti** → correggili subito, qui
- 🟠 **seri** → correggili se il tempo lo consente, altrimenti elencali all'utente
- 🟡 **minori** → riportali e basta, non correggerli

---

## Passo 6 — Chiusura

1. `npm run check`
2. Aggiungi una riga a `docs/decisioni.md` per ogni decisione architetturale presa
3. Riporta all'utente:

```
COSTRUITO: <cosa funziona ora, in una riga di comportamento osservabile>

Ticket: <N> completati, <N> bloccati
Subagent usati: <N> implementatori + 1 revisore
Revisione: <N> bloccanti corretti, <N> seri, <N> minori aperti

Da decidere: <cosa resta in sospeso, o "niente">
Per vederlo: <comando esatto>
```

---

## Errori da non fare

- **Non delegare il grilling.** È l'unico punto in cui le decisioni sono dell'utente.
- **Non compattare il contesto prima che i ticket esistano.** Perderesti il
  ragionamento proprio dove serve intatto.
- **Non far rivedere il codice a chi l'ha scritto.**
- **Non lanciare subagent in parallelo sugli stessi file.**
- **Non imporre il flusso completo a un lavoro piccolo.** La cerimonia sproporzionata
  è il modo più veloce per far abbandonare un metodo.
- **Non riassumere i rapporti dei subagent all'utente.** Riporta cosa è cambiato per
  chi userà il prodotto, non cosa ha fatto ciascun agente.

Se non sei sicuro di quale skill serva in un certo punto, invoca `ask-matt`:
è il router scritto dall'autore sopra le sue stesse skill.
