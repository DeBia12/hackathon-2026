/**
 * Descrizioni dell'alberatura: una riga scritta a mano per ogni file.
 *
 * Sono statiche di proposito. Una descrizione generata dal contenuto direbbe
 * *cosa* contiene il file; queste dicono *perché* esiste, che è l'unica cosa
 * che il file non sa dire di sé.
 *
 * Se aggiungi o rinomini un file e non lo registri qui, l'alberatura lo mostra
 * con un TODO evidente invece di inventargli una descrizione. Il conteggio dei
 * TODO viene stampato da `npm run alberatura`.
 */

/** Cartelle: perché esistono. */
export const CARTELLE = {
  ".claude": "Tutto ciò che configura Claude Code: agenti, skill, comandi, hook. È la parte condivisa col team.",
  ".claude/agents": "Gli agenti specializzati. Un file = un mestiere, con i suoi strumenti e le sue istruzioni.",
  ".claude/commands": "I comandi slash. Mettono in fila più passaggi in un'unica invocazione.",
  ".claude/hooks": "Script che scattano da soli su eventi precisi. Non dipendono da una decisione del modello.",
  ".claude/scripts": "Utilità di manutenzione del repository.",
  ".claude/skills": "Conoscenza richiamabile. Quattro skill sono nostre, le altre vengono da mattpocock/skills.",
  ".claude/skills/accenture-brand": "Il design system Accenture estratto dal sito vero: font, colori, animazioni, componenti.",
  ".claude/skills/accenture-brand/assets": "I file veri del brand: font proprietari, logo, screenshot di riferimento.",
  ".claude/skills/accessibilita": "Criteri WCAG 2.2 AA e lo script che misura i contrasti invece di stimarli.",
  agents: "Agenti programmatici con l'Agent SDK TypeScript, eseguibili fuori da Claude Code.",
  app: "La web app: Vite + React 19 + TypeScript + Tailwind v4.",
  "app/public": "File serviti così come sono, senza passare dalla build. Qui stanno i font del brand.",
  "app/src": "Il codice sorgente. L'alias @/ punta a questa cartella.",
  "app/src/components": "I componenti React.",
  "app/src/components/ui": "I mattoni riutilizzabili, tutti accessibili per costruzione.",
  "app/src/lib": "Utilità e client verso servizi esterni.",
  backend: "La persistenza: Supabase self-hosted su Podman, dentro WSL.",
  "backend/supabase": "Configurazione dell'istanza locale.",
  "backend/supabase/migrations": "Lo schema del database, in file numerati da applicare in ordine.",
  "backend/supabase/scripts": "Gli script dietro ai comandi npm run db:*.",
  "backend/supabase/volumes": "File montati dentro i container all'avvio.",
  "backend/supabase/volumes/api": "Configurazione del gateway Kong.",
  "backend/supabase/volumes/db": "Inizializzazione del database.",
  "backend/supabase/volumes/db/init": "SQL eseguito una sola volta alla creazione del volume.",
  docs: "Decisioni architetturali e registri. La memoria del progetto.",
  presentation: "Il deck Reveal.js e questa guida.",
  "presentation/guida": "La guida che stai leggendo.",
  "presentation/guida/brand": "Copia del design system, perché la guida sia apribile da sola.",
  "presentation/guida/brand/assets": "Font e logo serviti alla guida.",
  "presentation/theme": "Il tema Accenture per le slide Reveal.js.",
};

/** File: uno per uno, cosa fa e perché. */
export const FILE = {
  // ---------- Radice ----------
  "CLAUDE.md": "Le istruzioni che Claude legge a ogni sessione: vincoli, convenzioni, brand, regole di accessibilità. Il file più importante del repository.",
  "README.md": "Il punto di ingresso: cosa è il progetto, come si avvia, com'è organizzato.",
  "package.json": "Gli script npm della radice. È il pannello dei comandi: da qui parte la web app, il deck, il database e le verifiche.",
  "skills-lock.json": "Blocca la versione delle skill scaricate da GitHub, con l'hash di ciascuna. Serve a sapere se una skill esterna è cambiata sotto i piedi.",
  ".env.example": "Il modello delle variabili d'ambiente, da copiare in .env. Il .env vero non è tracciato e la lettura è vietata anche a Claude.",
  ".gitattributes": "Normalizza i fine riga a LF. Con CRLF gli script di shell falliscono dentro WSL con un errore illeggibile.",
  ".gitignore": "Cosa resta fuori dal repository: dipendenze, build, segreti e artefatti generati.",

  // ---------- .claude ----------
  ".claude/settings.json": "Permessi, variabili d'ambiente e registrazione dei tre hook. Definisce cosa Claude può fare senza chiedere e cosa non può fare affatto.",

  ".claude/agents/ui-builder.md": "L'agente che scrive i componenti React. Conosce i token del brand e le regole WCAG, così i componenti nascono conformi invece di essere corretti dopo.",
  ".claude/agents/revisore-accessibilita.md": "L'agente che audita l'accessibilità WCAG 2.2 AA. Non scrive codice: legge, misura e riporta le violazioni ordinate per gravità.",
  ".claude/agents/a11y-auditor.md": "L'agente che audita l'accessibilità WCAG 2.2 AA. Non scrive codice: legge, misura e riporta le violazioni ordinate per gravità.",
  ".claude/agents/supabase-dev.md": "L'agente del database: schema, migrazioni SQL, policy RLS e query sull'istanza Supabase locale.",
  ".claude/agents/edu-content.md": "L'agente che scrive i testi: microcopy, spiegazioni, quiz in linguaggio semplice per chi parte da zero.",
  ".claude/agents/deck-builder.md": "L'agente che costruisce le slide Reveal.js. Conosce la struttura narrativa che funziona in un hackathon dove conta il processo.",
  ".claude/agents/feature-dev.md": "L'agente che porta una funzionalità dall'inizio alla fine — dati, logica, interfaccia — coordinando da solo gli altri.",
  ".claude/agents/matt-implementer.md": "Esegue un singolo ticket in un contesto pulito, senza la storia di come ci si è arrivati. Non rivede il proprio lavoro.",
  ".claude/agents/matt-reviewer.md": "Rivede codice che non ha scritto, partendo da zero. Può solo leggere: è questo che rende la sua review affidabile.",

  ".claude/commands/kickoff.md": "Comando /kickoff: apre una feature. Crea il branch, scrive il brief e registra la decisione architetturale.",
  ".claude/commands/audit.md": "Comando /audit: lancia l'audit di accessibilità completo sull'interfaccia e aggiorna il registro.",
  ".claude/commands/ship.md": "Comando /ship: esegue le verifiche, poi committa e pusha. Se il check fallisce, non pusha.",
  ".claude/commands/demo.md": "Comando /demo: l'ultima ora. Congela il codice, verifica che la demo parta, prepara il piano B.",
  ".claude/commands/buildmatt.md": "Comando /buildmatt: l'orchestratore. Dal requisito ai ticket ai subagent, seguendo il flusso di Matt Pocock.",

  ".claude/hooks/blocca-segreti.mjs": "Prima di ogni git commit ispeziona ciò che è in stage e blocca le credenziali. Guarda solo lo stage: un falso positivo su un file non committato bloccherebbe il lavoro per niente.",
  ".claude/hooks/verifica-accessibilita.mjs": "Dopo ogni modifica a un .tsx cerca violazioni di accessibilità certe. Solo quelle verificabili con una regex: un hook che grida al lupo viene ignorato.",
  ".claude/hooks/verifica-a11y.mjs": "Dopo ogni modifica a un .tsx cerca violazioni di accessibilità certe. Solo quelle verificabili con una regex: un hook che grida al lupo viene ignorato.",
  ".claude/hooks/verifica-tipi.mjs": "A fine turno lancia il typecheck. Gira una volta sola, nel momento esatto in cui un errore di tipo non deve passare.",

  ".claude/scripts/frontiera.mjs": "Calcola quali ticket possono partire subito: quelli i cui bloccanti sono già chiusi.",
  ".claude/scripts/genera-alberatura.mjs": "Genera l'indice di file che alimenta questa pagina, leggendo l'elenco da git ls-files.",
  ".claude/scripts/descrizioni.mjs": "Le descrizioni che stai leggendo: una riga scritta a mano per ogni file del progetto.",

  ".claude/skills/accenture-brand/SKILL.md": "La guida operativa al brand: palette, tipografia, componenti e le tre trappole di contrasto in cui è facile cadere.",
  ".claude/skills/accenture-brand/accenture.css": "Il design system pronto all'uso: token, componenti, animazioni. Un link a questo file e hai finito.",
  ".claude/skills/accenture-brand/template.html": "Pagina d'esempio completa — hero, griglia di card, sezione editoriale. Il punto di partenza per una pagina nuova.",
  ".claude/skills/accenture-brand/tailwind-preset.js": "Gli stessi token come preset Tailwind v3. Su Tailwind v4, come qui, si usa invece il blocco @theme in app/src/index.css.",
  ".claude/skills/accenture-brand/assets/fonts.css": "Le quattro regole @font-face dei font del brand: Graphik nei tre pesi e GT Sectra Fine.",

  ".claude/skills/accessibilita/SKILL.md": "Criteri WCAG 2.2 AA operativi: checklist per tipo di componente, test da tastiera, pattern ARIA corretti.",
  ".claude/skills/accessibilita/contrast.mjs": "Calcola il rapporto di contrasto fra due colori secondo la formula WCAG. Misurare invece di stimare: i valori del brand sono controintuitivi.",
  ".claude/skills/a11y-check/SKILL.md": "Criteri WCAG 2.2 AA operativi: checklist per tipo di componente, test da tastiera, pattern ARIA corretti.",
  ".claude/skills/a11y-check/contrast.mjs": "Calcola il rapporto di contrasto fra due colori secondo la formula WCAG. Misurare invece di stimare: i valori del brand sono controintuitivi.",

  ".claude/skills/demo-ready/SKILL.md": "La procedura dell'ultima ora: verifica tecnica, piano B se la rete cade, gestione del tempo di presentazione.",
  ".claude/skills/create-readme/SKILL.md": "Come si scrive il README di questo progetto.",

  // ---------- Skill esterne (mattpocock/skills) ----------
  ".claude/skills/ask-matt/SKILL.md": "Il router: descrivi la situazione e ti dice quale skill o flusso usare. Da qui si parte se non sai cosa serve.",
  ".claude/skills/ask-matt/PHASE-BOUNDARIES.md": "Dove finisce una fase e comincia la successiva, e perché non vanno mescolate.",
  ".claude/skills/grilling/SKILL.md": "Ti interroga senza sconti su un piano o una decisione, per far emergere quello che non hai pensato.",
  ".claude/skills/grill-with-docs/SKILL.md": "Come grilling, ma mentre interroga produce anche la documentazione: ADR e glossario.",
  ".claude/skills/to-spec/SKILL.md": "Trasforma la conversazione in una specifica e la pubblica sull'issue tracker. Nessuna intervista: solo sintesi.",
  ".claude/skills/to-tickets/SKILL.md": "Spacca un piano in ticket tracer-bullet, ognuno che dichiara da cosa è bloccato.",
  ".claude/skills/implement/SKILL.md": "Implementa un pezzo di lavoro partendo da una specifica o da un insieme di ticket.",
  ".claude/skills/tdd/SKILL.md": "Sviluppo guidato dai test: rosso, verde, refactor.",
  ".claude/skills/tdd/tests.md": "Cosa distingue un buon test da uno cattivo.",
  ".claude/skills/tdd/mocking.md": "Quando i mock aiutano e quando nascondono i problemi.",
  ".claude/skills/code-review/SKILL.md": "Rivede le modifiche su due assi: rispetto delle convenzioni del repository e aderenza a quanto era stato chiesto.",
  ".claude/skills/codebase-design/SKILL.md": "Il vocabolario per progettare moduli profondi: dove passa un confine, cosa esporre, cosa nascondere.",
  ".claude/skills/codebase-design/DEEPENING.md": "Come riconoscere un modulo troppo sottile e come approfondirlo.",
  ".claude/skills/codebase-design/DESIGN-IT-TWICE.md": "Progettare due alternative prima di sceglierne una.",
  ".claude/skills/domain-modeling/SKILL.md": "Costruisce e affina il modello di dominio: i termini del progetto e cosa significano davvero.",
  ".claude/skills/domain-modeling/ADR-FORMAT.md": "Il formato di una decisione architetturale registrata.",
  ".claude/skills/domain-modeling/CONTEXT-FORMAT.md": "Il formato del CONTEXT.md che descrive il dominio.",
  ".claude/skills/diagnosing-bugs/SKILL.md": "Il ciclo di diagnosi per i bug difficili e le regressioni di prestazioni.",
  ".claude/skills/diagnosing-bugs/scripts/hitl-loop.template.sh": "Modello di ciclo con una persona nel mezzo, per i bug che vanno riprodotti a mano.",
  ".claude/skills/prototype/SKILL.md": "Costruisce un prototipo usa-e-getta per rispondere a una domanda di design, e poi lo butta.",
  ".claude/skills/prototype/LOGIC.md": "Prototipare la logica: verificare se un modello di stato regge.",
  ".claude/skills/prototype/UI.md": "Prototipare l'interfaccia: capire che aspetto deve avere prima di costruirla.",
  ".claude/skills/research/SKILL.md": "Indaga una domanda su fonti primarie affidabili e lascia le conclusioni in un file Markdown nel repository.",
  ".claude/skills/triage/SKILL.md": "Porta issue e PR esterne attraverso una macchina a stati: categorizza, verifica, approfondisce.",
  ".claude/skills/triage/AGENT-BRIEF.md": "Come si scrive un brief per un agente che deve lavorare da solo.",
  ".claude/skills/triage/OUT-OF-SCOPE.md": "La base di conoscenza di ciò che è stato dichiarato fuori ambito, per non ridiscuterlo ogni volta.",
  ".claude/skills/handoff/SKILL.md": "Comprime la conversazione in un documento di passaggio di consegne, perché un altro agente possa riprendere il lavoro.",
  ".claude/skills/resolving-merge-conflicts/SKILL.md": "Come risolvere un merge o un rebase in conflitto senza perdere pezzi.",
  ".claude/skills/setup-matt-pocock-skills/SKILL.md": "Configura il repository per queste skill: issue tracker, etichette di triage, documenti di dominio.",
  ".claude/skills/setup-matt-pocock-skills/domain.md": "Come impostare i documenti di dominio del progetto.",
  ".claude/skills/setup-matt-pocock-skills/triage-labels.md": "Il vocabolario di etichette usato dal triage.",
  ".claude/skills/setup-matt-pocock-skills/issue-tracker-github.md": "Configurazione con GitHub Issues.",
  ".claude/skills/setup-matt-pocock-skills/issue-tracker-gitlab.md": "Configurazione con GitLab Issues.",
  ".claude/skills/setup-matt-pocock-skills/issue-tracker-local.md": "Configurazione con ticket in file Markdown locali, senza tracker esterno.",

  // ---------- agents/ ----------

  // ---------- app/ ----------
  "app/README.md": "Note specifiche della web app.",
  "app/package.json": "Dipendenze e script della web app: Vite, React 19, TypeScript, Tailwind.",
  "app/index.html": "Il documento HTML di partenza. Vite ci inietta il bundle.",
  "app/.gitignore": "Esclusioni locali della web app: node_modules e la build.",
  "app/.oxlintrc.json": "Regole del linter. Oxlint invece di ESLint: parte in millisecondi invece che in secondi.",
  "app/vite.config.ts": "Configurazione di Vite, incluso l'alias @/ verso app/src/.",
  "app/tsconfig.json": "Configurazione TypeScript della radice: rimanda agli altri due.",
  "app/tsconfig.app.json": "Configurazione TypeScript del codice dell'applicazione. Modalità strict.",
  "app/tsconfig.node.json": "Configurazione TypeScript dei file di build, che girano in Node e non nel browser.",
  "app/src/main.tsx": "Il punto di ingresso: monta React nel DOM.",
  "app/src/App.tsx": "La pagina principale della web app.",
  "app/src/index.css": "I token del brand in un blocco @theme di Tailwind v4, più i quattro @font-face dei font reali. Il file da cui dipende tutto l'aspetto.",
  "app/src/vite-env.d.ts": "Tipi delle variabili d'ambiente esposte da Vite.",
  "app/src/components/SkipLink.tsx": "Il salto al contenuto: primo elemento della pagina, invisibile finché non riceve il focus da tastiera.",
  "app/src/components/ui/Button.tsx": "Bottone accessibile nelle varianti del brand, con focus visibile e area di tocco sopra il minimo WCAG.",
  "app/src/components/ui/Card.tsx": "Card con livello di heading configurabile: la gerarchia si sceglie in base alla pagina, non si eredita dall'aspetto.",
  "app/src/components/ui/Field.tsx": "Campo di form con label collegata ed errori annunciati ai lettori di schermo. Il placeholder non è una label.",
  "app/src/lib/cn.ts": "Unisce classi Tailwind risolvendo i conflitti, così l'ultima vince davvero.",
  "app/src/lib/supabase.ts": "Client Supabase configurato dalle variabili d'ambiente.",

  // ---------- backend/ ----------
  "backend/README.md": "Cos'è il backend e come si avvia.",
  "backend/supabase/README.md": "L'istanza Supabase locale: servizi, porte, come accedere.",
  "backend/supabase/docker-compose.yml": "I servizi dello stack Supabase: database, autenticazione, API REST, gateway.",
  "backend/supabase/migrations/001_init.sql": "Lo schema di partenza: percorsi didattici, lezioni e avanzamento per utente. Neutro rispetto alle tre tematiche e rilanciabile senza errori.",
  "backend/supabase/seed.sql": "Dati di esempio per la demo. Senza, l'interfaccia è vuota e non si dimostra niente.",
  "backend/supabase/scripts/setup.sh": "Installazione da zero: funziona sia lanciato da Windows sia da dentro WSL.",
  "backend/supabase/scripts/installa-podman.sh": "Installa Podman dentro WSL e pre-scarica le immagini, così il primo avvio non aspetta la rete.",
  "backend/supabase/scripts/up.sh": "Avvia lo stack Supabase locale.",
  "backend/supabase/scripts/down.sh": "Ferma lo stack. I dati restano nel volume.",
  "backend/supabase/scripts/reset.sh": "Ferma lo stack ed elimina i dati, poi riparte da zero. L'unico distruttivo del gruppo.",
  "backend/supabase/scripts/logs.sh": "Mostra i log dei container, filtrabili per servizio.",
  "backend/supabase/scripts/psql.sh": "Apre psql sul database, o esegue direttamente la query che gli passi.",
  "backend/supabase/scripts/_comune.sh": "Funzioni condivise dagli altri script: il trattino basso segnala che non va lanciato da solo.",
  "backend/supabase/scripts/genera-chiavi.mjs": "Genera i segreti dell'istanza locale: JWT e chiavi di servizio.",
  "backend/supabase/volumes/api/kong.yml": "Il gateway: instrada un solo endpoint verso i servizi interni, perché supabase-js si aspetta /auth/v1 e /rest/v1 sullo stesso host.",
  "backend/supabase/volumes/db/init/roles.sql": "Crea i ruoli del database all'inizializzazione del volume.",
  "backend/supabase/volumes/db/init/jwt.sql": "Configura il segreto JWT che lega autenticazione e database.",

  // ---------- docs/ ----------
  "docs/decisioni.md": "Ogni decisione non ovvia: cosa, perché, alternativa scartata. In questo hackathon la giuria guarda il processo — questo file è il processo.",
  "docs/accessibilita.md": "Registro degli audit eseguiti e tabella dei contrasti misurati, divisa per fondo chiaro e scuro.",

  // ---------- presentation/ ----------
  "presentation/README.md": "Come si lancia e si modifica il deck.",
  "presentation/index.html": "Le slide della presentazione finale, in Reveal.js.",
  "presentation/theme/accenture.css": "Il tema Accenture per Reveal.js: token del brand, font reali e stili delle slide.",
  "presentation/guida/index.html": "Questa guida.",
  "presentation/guida/brand/accenture.css": "Copia del design system, perché la guida resti apribile anche da sola.",
  "presentation/guida/brand/assets/fonts.css": "Le regole @font-face dei font serviti alla guida.",
};

/**
 * Gruppi di file tutti uguali per natura: qui una regola vale più di venti
 * righe identiche. Si applica solo a ciò che non è già in FILE.
 */
export function descrizioneDiGruppo(percorso) {
  // Ogni skill esterna porta con sé un adattatore per un altro runtime.
  if (/^\.claude\/skills\/[^/]+\/agents\/openai\.yaml$/.test(percorso)) {
    const skill = percorso.split("/")[2];
    return `Adattatore che rende la skill \`${skill}\` utilizzabile anche fuori da Claude Code.`;
  }
  return "";
}

/**
 * Le cartelle delle skill sono tutte fatte allo stesso modo, quindi le descrive
 * una regola. La cartella di una skill eredita la descrizione del suo SKILL.md:
 * è la stessa cosa detta una volta sola.
 */
export function descrizioneCartella(via) {
  if (CARTELLE[via]) return CARTELLE[via];

  const skill = /^\.claude\/skills\/([^/]+)$/.exec(via);
  if (skill) return FILE[`${via}/SKILL.md`] || `La skill \`${skill[1]}\`.`;

  if (/^\.claude\/skills\/[^/]+\/agents$/.test(via)) {
    return "Adattatori per usare questa skill fuori da Claude Code.";
  }
  if (/^\.claude\/skills\/[^/]+\/scripts$/.test(via)) {
    return "Script di supporto richiamati dalla skill.";
  }
  return "";
}
