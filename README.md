# Capitolo Zero

Prototipo di **educazione alla finanza personale di base**, costruito in 5 ore da un
team di 2 persone con un workflow di *agentic coding*.

L'app spiega e calcola, **non consiglia**: nessuna raccomandazione di investimento,
nessuna consulenza personalizzata, nessuna indicazione su cosa comprare o scegliere.
È un vincolo della challenge, ed è verificabile — c'è una schermata *Trasparenza* che
dichiara cosa il sistema fa e cosa non fa.

> [!NOTE]
> Il criterio di valutazione dichiarato dell'evento è che **conta più il COME che il
> risultato**. Per questo la parte forte di questo repository non è solo l'app: è il
> **workflow agentico** che l'ha prodotta, orchestrato dal comando
> [`/buildmatt`](#il-workflow-agentico--buildmatt). Architettura, decisioni e agenti
> sono trattati come materiale di progetto, non come contorno.

---

## Avvio rapido

Servono **Node.js 22+** e **Git**. Il database è opzionale: l'app gira senza.

```bash
npm run setup      # installa le dipendenze dell'app (una volta sola)
npm run dev        # web app        → http://localhost:5173
npm run present    # presentazione  → http://localhost:8000
```

I due comandi si possono tenere aperti in **due terminali diversi**: l'app e il deck
girano su porte separate e non si disturbano.

### Avviare la web app

```bash
npm run dev
```

Apre il dev server Vite su <http://localhost:5173>. Il flusso da mostrare in demo è:

`Benvenuto` → `Valutazione iniziale` → `Mappa del percorso` → `Modulo` →
`Valutazione finale` → `Risultato` → `Trasparenza`

È il ciclo *before/after*: la valutazione iniziale misura la comprensione di partenza,
i moduli spiegano, la valutazione finale misura di nuovo. Il miglioramento non è
affermato, è **misurato**.

### Avviare la presentazione

```bash
npm run present
```

Serve il deck Reveal.js in `presentation/` su <http://localhost:8000>. Funziona
**offline**: font, tema e librerie sono nel repository, niente CDN.

| Tasto | Effetto |
|---|---|
| `→` / `Spazio` | Slide successiva |
| `S` | Vista relatore con le note |
| `Esc` | Panoramica di tutte le slide |
| `F` | Schermo intero |

C'è anche una guida navigabile all'alberatura del progetto:

```bash
npm run guida      # → http://localhost:8001
```

### Database (opzionale)

Supabase self-hosted su Podman dentro WSL. Serve solo se lavori sulla persistenza.

```bash
npm run db:setup   # una volta sola: installa Podman e scarica le immagini (~1,5 GB)
npm run db:up      # avvia            → http://localhost:3000 (Studio)
npm run db:down    # ferma
```

> [!IMPORTANT]
> Il primo `npm run db:up` scarica circa 1,5 GB. Fallo **prima** dell'evento, non
> sulla rete condivisa della sede.

Il dettaglio è in [`backend/supabase/README.md`](backend/supabase/README.md).

### Prima di ogni push

```bash
npm run check      # typecheck + lint + test + build
```

---

## Il workflow agentico — `/buildmatt`

Questa è la parte che vale la pena guardare.

Il problema che risolve è preciso: **oltre ~150k token di contesto un modello resta
fluente ma smette di ragionare bene, e non lo dichiara.** Un agente che pianifica,
implementa e poi rivede il proprio lavoro nella stessa finestra arriva alla fine
convinto di aver fatto un buon lavoro, perché ricorda perché ogni scelta gli sembrava
giusta mentre la faceva.

`/buildmatt` è un **orchestratore** che porta un'idea fino alla consegna spezzando il
lavoro in finestre di contesto separate, ognuna dimensionata per il compito che deve
svolgere.

```
/buildmatt <cosa costruire>
```

### Il ciclo

```
0. avvio       branch, brief in 3 righe, decisione in docs/decisioni.md
1. grilling    intervista all'utente per affilare l'idea          ← NON delegabile
2. bivio       sta in una sessione, o va spezzato?
3. piano       specifica → ticket con le loro dipendenze dichiarate
4. build       un subagent con contesto FRESCO per ogni ticket
5. verifica    revisione + audit accessibilità, in parallelo      ← chi non ha scritto
6. consegna    npm run check, controllo segreti, commit, push
```

### Le due regole strutturali

Non sono preferenze di stile: sono ciò che fa funzionare il metodo.

**1. La pianificazione sta tutta in una finestra sola.**
Grilling, specifica e ticket si costruiscono l'uno sull'altro: servono il ragionamento
testuale per intero, non un riassunto. Il contesto non si compatta finché i ticket non
esistono.

**2. Ogni ticket parte da zero.**
Un subagent `matt-implementer` per ticket. Il suo contesto pulito è l'equivalente di un
`/clear`, e il ticket è scritto apposta per bastare da solo: riceve il percorso del
ticket, il branch e l'elenco dei file che *non* deve toccare. Niente storia della
sessione.

### La frontiera si calcola, non si deduce a occhio

```bash
npm run frontiera
```

Legge i bloccanti dichiarati dai ticket e restituisce: quali possono partire **subito**,
quali **aspettano** e da cosa, e quali dichiarano un **bloccante inesistente** — un
ticket che attende un numero che nessuno produrrà resterebbe fermo per sempre, e
leggendo i ticket a mano non te ne accorgi.

Sui ticket della frontiera:

- **in parallelo** solo quelli che toccano insiemi di file **disgiunti**, lanciati in
  un unico messaggio così girano davvero insieme;
- **in sequenza** tutto il resto. Nel dubbio, sequenza: un conflitto costa più di
  quanto il parallelismo faccia risparmiare.

### La verifica la fa chi non ha scritto

Al Passo 5 partono **due** agenti insieme, nessuno dei quali ha scritto il codice:

| Agente | Cosa guarda |
|---|---|
| `matt-reviewer` | Convenzioni del progetto e aderenza a quanto il ticket chiedeva |
| `revisore-accessibilita` | Conformità WCAG 2.2 AA |

I rilievi 🔴 bloccanti si correggono subito, 🟠 i seri se il tempo lo consente, 🟡 i
minori si riportano e basta. Il verdetto finisce in `docs/accessibilita.md` con la data.

### Le modalità

| Comando | Comportamento |
|---|---|
| `/buildmatt <cosa>` | Ciclo completo, dall'idea alla consegna |
| `/buildmatt <cosa> --rapido` | Salta grilling e specifica — per lavori già chiari |
| `/buildmatt --solo-piano` | Si ferma ai ticket |
| `/buildmatt --solo-build` | Parte da ticket che esistono già |
| `/buildmatt --senza-consegna` | Costruisce e verifica, non pubblica |

Per mezz'ora di lavoro si usa `--rapido`: imporre la cerimonia completa a un lavoro
piccolo è il modo più veloce per far abbandonare un metodo.

### Quando l'orchestratore si ferma e chiede

I subagent non hanno un canale verso l'utente. Quando uno incontra una decisione che
non è sua, la riporta all'orchestratore, che **la porta all'utente** invece di
deciderla al posto suo. Si chiede quando la decisione è difficile da annullare, quando
cambia cosa si consegna, quando due letture della richiesta portano a lavori diversi,
quando serve una dipendenza nuova, o quando il tempo non basta più.

Si decide invece senza chiedere su tutto ciò che è reversibile e interno al codice:
nomi, posizione dei file, forma di un componente, testo di un errore.

---

## I tre livelli del sistema di agenti

`/buildmatt` è il livello più alto. Sotto ci sono altri due livelli, con autonomia
decrescente e affidabilità crescente.

### 1. Hook — automazione deterministica

Scattano sempre, senza che nessuno decida di invocarli. Codice in `.claude/hooks/`.

| Quando | Cosa fa |
|---|---|
| Dopo ogni modifica a un `.tsx` | Blocca 5 violazioni di accessibilità certe |
| Dopo ogni modifica a un file UI | Passa il file alle 61 regole del detector `impeccable` |
| Prima di ogni `git commit` | Blocca il commit se in stage c'è una credenziale |
| A fine turno | Esegue il typecheck: se fallisce, il turno non si chiude |

### 2. Agenti — esecutori specializzati

| Agente | Compito |
|---|---|
| `ui-builder` | Componenti React accessibili |
| `supabase-dev` | Schema, policy RLS, migrazioni |
| `revisore-accessibilita` | Audit WCAG 2.2 AA |
| `edu-content` | Testi e microcopy in linguaggio semplice |
| `deck-builder` | Slide della presentazione |
| `matt-implementer` | Esegue **un** ticket in contesto fresco |
| `matt-reviewer` | Rivede codice che non ha scritto |

### 3. Skill — conoscenza richiamabile

Di progetto: `accenture-brand`, `brilliant-style`, `accessibilita`, `demo-ready`,
`create-readme`. Da terzi: [`impeccable`](https://github.com/pbakaus/impeccable) — 23
comandi di design più 61 regole contro gli anti-pattern del frontend generato da AI —,
[`apple-design`](https://github.com/dickwu/apple-design-skill) (122 pagine di Human
Interface Guidelines) e il flusso completo di
[mattpocock/skills](https://github.com/mattpocock/skills).

> I due design system non si mescolano: `accenture-brand` vale sul deck in
> `presentation/`, `brilliant-style` sulla web app in `app/`.

### Comandi usabili anche da soli

| Comando | Effetto |
|---|---|
| `/kickoff <idea>` | Inquadra il lavoro, registra la decisione, crea branch e scheletro |
| `/audit` | Audit di accessibilità e correzione dei bloccanti |
| `/ship` | Verifica, controlla i segreti, committa e pusha |
| `/demo` | Checklist dell'ultima ora — si esegue **una volta sola**, fuori dal ciclo |
| `/ask-matt` | Router: se non sai quale skill serve, chiedilo a lui |

Dentro `/buildmatt` i primi tre sono incorporati perché sono passaggi naturali del
ciclo, non perché siano stati assorbiti: per un commit veloce a metà lavoro si usa
`/ship`, non si rilancia l'orchestratore.

---

## Struttura

| Cartella | Contenuto |
|---|---|
| `app/` | Web app — React 19, TypeScript, Tailwind 4, Vite 8 |
| `app/src/dominio/` | Logica finanziaria e motore adattivo, con test |
| `app/src/schermate/` | Le sei schermate del percorso |
| `agents/` | Tutto l'agentico |
| `backend/supabase/` | Supabase self-hosted su Podman |
| `presentation/` | Deck Reveal.js con tema Accenture, offline |
| `docs/` | Brief della challenge, decisioni architetturali, registro audit |
| `.claude/` | Subagent, skill, hook e comandi slash |

---

## Accessibilità

Non è una verifica finale: è un vincolo **dentro gli agenti che scrivono il codice**.
I componenti nascono conformi a WCAG 2.2 AA, e i contrasti si calcolano invece di
stimarli.

```bash
npm run contrasto '#A100FF' '#FFFFFF'
```

> [!WARNING]
> Il brand ha **due viola e due grigi**, e usarli sul fondo sbagliato è l'errore più
> facile: `#A100FF` su nero dà 3.96:1 (su scuro il testo viola è `#BE82FF`, 7.83:1) e
> `#A2A2A0` su bianco dà 2.56:1 (su chiaro il grigio è `#5F5F5F`, 6.39:1).

Il dettaglio è in [`.claude/skills/accenture-brand/SKILL.md`](.claude/skills/accenture-brand/SKILL.md),
che copre **solo il deck**: la web app ha una sua identità in `app/src/index.css`.

---

## Convenzioni

- Branch `feat/<nome>`, commit in italiano all'imperativo
- `npm run check` prima di ogni push, merge su `main` con `--no-ff`
- TypeScript strict, niente `any`: se il tipo è ignoto si usa `unknown` e si restringe
- Solo utility Tailwind, niente CSS inline né file CSS per componente
- Ogni decisione non ovvia va in [`docs/decisioni.md`](docs/decisioni.md), una riga
- I segreti stanno solo nei file `.env`, che non vengono mai committati
