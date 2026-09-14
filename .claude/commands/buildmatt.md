---
description: Orchestratore completo — dall'idea alla consegna. Segue il flusso di Matt Pocock, distribuisce i ticket a subagent con contesto fresco, verifica e pubblica
argument-hint: [cosa vuoi costruire] [--rapido | --solo-piano | --solo-build | --senza-consegna]
---

Devi costruire: **$ARGUMENTS**

Sei l'orchestratore. Porti il lavoro dall'idea alla consegna: apri il branch, affili
il requisito, lo spezzi in ticket, li distribuisci a subagent con contesto fresco,
fai verificare il risultato da agenti che non l'hanno scritto, e pubblichi.

Il ciclo completo è:

```
0. avvio       branch, brief, decisione architetturale        ← come /kickoff
1. grilling    intervista per affilare l'idea  (con l'utente)
2. bivio       sta in una sessione, o va spezzato?
3. piano       specifica → ticket con le loro dipendenze
4. build       un subagent per ticket, sulla frontiera
5. verifica    revisione + audit accessibilità, in parallelo  ← come /audit
6. consegna    check, controllo segreti, commit, push         ← come /ship
```

I comandi `/kickoff`, `/audit` e `/ship` **restano invocabili da soli**: qui sono
incorporati perché sono passaggi naturali di questo ciclo, non perché siano stati
assorbiti. Per un commit veloce a metà lavoro usi `/ship`, non rilanci tutto questo.

`/demo` invece **non** è qui dentro, e non deve esserci: è la procedura dell'ultima
ora, si esegue una volta sola su tutto il lavoro della giornata, non a ogni feature.

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

## Quando fermarti e chiedere

I passi qui sotto segnano i punti in cui l'utente decide per forza. Ma **non sono gli
unici**: in qualsiasi momento, se incontri una decisione che non è tua, fermati e
chiedi. Vale più di una domanda in mezzo al lavoro che un'ora costruita nella
direzione sbagliata.

**Chiedi quando** la decisione ha almeno una di queste caratteristiche:

- **È difficile da tornare indietro.** Cancellare dati, cambiare la forma di una
  tabella già popolata, riscrivere qualcosa che un'altra persona sta usando, pubblicare
  all'esterno.
- **Cambia cosa si consegna.** Tagliare una funzionalità, rimandare un pezzo, cambiare
  l'ordine di priorità dei ticket: è una scelta di prodotto, non tecnica.
- **Due letture della richiesta portano a lavori diversi.** Se la specifica regge due
  interpretazioni e costano entrambe più di mezz'ora, non tirare a indovinare.
- **Esce dal perimetro concordato.** Serve una dipendenza nuova, un servizio esterno,
  una credenziale, un cambio di architettura che i ticket non prevedevano.
- **Il tempo non basta più.** Se ti accorgi che il piano non entra nel tempo rimasto,
  dillo subito con le opzioni, invece di consegnare metà lavoro alla scadenza.

**Decidi tu, senza chiedere, quando** la scelta è reversibile e interna al codice:
come nominare le cose, dove mettere un file, quale forma dare a un componente, se
serve un test, come scrivere un messaggio d'errore. Falle, dille nel rapporto, vai
avanti. Chiedere su queste rallenta e basta.

**Come chiedere.** Una domanda sola, con la tua raccomandazione in testa e il costo
di ciascuna opzione:

> I ticket 04 e 05 richiedono l'autenticazione, che non era nel piano. Restano
> ~2 ore. Io consegnerei senza login, con un utente fisso per la demo (30 min);
> l'alternativa è implementarlo davvero (~90 min) e rinunciare al ticket 06.
> Come preferisci?

**I subagent non possono chiederti niente**: girano senza interfaccia verso di te.
Quando uno di loro incontra una decisione del genere, la riporta all'orchestratore —
cioè a te che stai leggendo — e **tu** la porti all'utente. Non decidere al posto suo
solo perché il rapporto è arrivato da un agente.

## Modalità

| Argomento | Comportamento |
|---|---|
| *(nessuno)* | Ciclo completo, dall'avvio alla consegna |
| `--rapido` | Salta grilling e specifica. Per lavori piccoli e già chiari |
| `--solo-piano` | Si ferma dopo i ticket, non implementa |
| `--solo-build` | Parte da ticket che esistono già |
| `--senza-consegna` | Costruisce e verifica, ma non committa né pubblica |

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

### Avvio del lavoro (quello che fa `/kickoff`)

```bash
git branch --show-current
git status --short
```

1. **Branch.** Se sei su `main`, crea `feat/<nome-breve>`. Se ci sono modifiche non
   committate che non c'entrano con questo lavoro, fermati e chiedi cosa farne:
   trascinarle dentro un branch nuovo le mischia a lavoro non correlato.

2. **Brief in tre righe.** Cosa costruiamo, per chi, e qual è **la singola cosa che
   deve funzionare** nella demo. Se il lavoro è più grande del tempo che resta,
   proponi la versione ridotta che resta dimostrabile e dillo esplicitamente.

3. **Decisione architetturale.** Aggiungi una riga a `docs/decisioni.md` — cosa
   abbiamo scelto, perché, cosa abbiamo scartato. È il materiale della slide
   «Il nostro processo»: la giuria valuta il come.

4. **Divisione del lavoro.** Il team è di due persone: quando arrivi ai ticket
   (Passo 3), assegnali in modo che i due non tocchino gli stessi file.

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
- `serve una decisione` → **portala all'utente**, con le opzioni e la raccomandazione
  che il subagent ha già formulato. Non deciderla tu solo perché ti è arrivata da un
  agente: il subagent si è fermato proprio perché la scelta non era sua, e non lo è
  nemmeno tua. Mentre aspetti, fai avanzare gli altri ticket della frontiera che non
  dipendono da quella decisione — non lasciare fermo tutto per una domanda sola.

Continua finché la frontiera è vuota. Fra un giro e l'altro riporta all'utente una
riga sola: quali ticket sono chiusi e quali restano.

---

## Passo 5 — Verifica, in due subagent paralleli

Quando i ticket sono finiti, lancia **due** agenti **in un unico messaggio**, così
girano insieme. Sono letture indipendenti dello stesso codice: non si disturbano.

| Agente | Cosa guarda |
|---|---|
| `matt-reviewer` | Convenzioni del progetto e aderenza a quanto i ticket chiedevano |
| `revisore-accessibilita` | Conformità WCAG 2.2 AA — quello che fa `/audit` |

A entrambi passa il punto di partenza del confronto (il commit da cui sei partito).
Al primo indica anche dove stanno i ticket: senza sapere cosa era stato chiesto non
può giudicare l'aderenza.

**Nessuno dei due deve essere un agente che ha scritto il codice.** È il motivo per
cui la verifica gira separata: chi ha appena scritto qualcosa tende ad approvarla,
perché ricorda perché ogni scelta gli sembrava giusta.

Salta `revisore-accessibilita` solo se il lavoro non ha toccato interfaccia.

Con i rilievi che tornano da entrambi:
- 🔴 **bloccanti** → correggili subito, qui
- 🟠 **seri** → correggili se il tempo lo consente, altrimenti elencali all'utente
- 🟡 **minori** → riportali e basta, non correggerli

Poi aggiorna `docs/accessibilita.md` con il verdetto e la data: serve per la slide
«Accessibilità by design».

---

## Passo 6 — Consegna (quello che fa `/ship`)

Queste operazioni le fai **tu**, non un subagent: sono comandi su questo repository,
e delegarli aggiungerebbe un passaggio di consegne senza guadagnare niente.

**1. Verifica.**
```bash
npm run check
```
Se fallisce, **non consegnare**: correggi prima. Il compagno di team parte dal tuo
`main`, e un `main` rotto blocca due persone invece di una.

**2. Cerca credenziali fra le modifiche in stage.**
```bash
git add -A
git diff --cached -U0 | grep -nE "sk-ant-|service_role|eyJhbGciOi" && echo "SEGRETO" || echo "pulito"
```
L'hook `blocca-segreti` interviene comunque al commit, ma accorgersene ora costa meno
che scoprirlo a commit rifiutato.

**3. Committa e pubblica.**
Messaggio in italiano, all'imperativo, che dice **cosa cambia per chi usa il prodotto**
— non quali file hai toccato.
```bash
git push -u origin HEAD
```

**4. Registra le decisioni.** Una riga in `docs/decisioni.md` per ogni scelta
architetturale presa strada facendo, se non l'hai già fatto al Passo 0.

**5. Riporta.**

```
COSTRUITO: <cosa funziona ora, in una riga di comportamento osservabile>

Ticket: <N> completati, <N> bloccati
Subagent usati: <N> implementatori + <N> verificatori
Verifica: <N> bloccanti corretti, <N> seri, <N> minori aperti
Consegnato: <hash> su <branch>

Da decidere: <cosa resta in sospeso, o "niente">
Per vederlo: <comando esatto>
```

Se mancano meno di ~90 minuti alla presentazione, chiudi suggerendo `/demo`:
è la procedura dell'ultima ora e non fa parte del ciclo di costruzione.

---

## Errori da non fare

- **Non delegare il grilling.** È l'unico punto in cui le decisioni sono dell'utente.
- **Non compattare il contesto prima che i ticket esistano.** Perderesti il
  ragionamento proprio dove serve intatto.
- **Non far rivedere il codice a chi l'ha scritto.**
- **Non pubblicare con il check rosso.** Il compagno di team parte dal tuo `main`.
- **Non usare un subagent per le operazioni git.** Commit e push sono azioni su questo
  repository: delegarle aggiunge un passaggio di consegne e non isola niente. Il
  subagent serve quando il contesto va isolato, o quando serve un giudizio indipendente.
- **Non lanciare subagent in parallelo sugli stessi file.**
- **Non imporre il flusso completo a un lavoro piccolo.** La cerimonia sproporzionata
  è il modo più veloce per far abbandonare un metodo.
- **Non riassumere i rapporti dei subagent all'utente.** Riporta cosa è cambiato per
  chi userà il prodotto, non cosa ha fatto ciascun agente.

Se non sei sicuro di quale skill serva in un certo punto, invoca `ask-matt`:
è il router scritto dall'autore sopra le sue stesse skill.
