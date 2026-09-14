import type { Domanda, DomandaId } from "./tipi";

// ---------------------------------------------------------------------------
// Banca delle domande — Capitolo Zero
//
// 34 domande:  5 iniziali (i1–i5), 5 finali (f1–f5),
//              12 verifiche (v-lXX), 12 riverifiche (r-lXX).
//
// Convenzione id vincolante (altri ticket ci puntano senza poterci chiedere):
//   iniziali   → i1 … i5
//   finali     → f1 … f5
//   verifica   → v-<lezione>   es. v-l1a
//   riverifica → r-<lezione>   es. r-l1a
//
// Ogni opzione non corretta dichiara quale lacuna concettuale rivela.
// La `gemella` è reciproca su tutte le coppie iniziale/finale e verifica/riverifica.
// Nessuna domanda suggerisce cosa comprare, vendere o scegliere.
// ---------------------------------------------------------------------------

const _DOMANDE: Record<DomandaId, Domanda> = {

  // =========================================================================
  // VALUTAZIONE INIZIALE (i1 – i5)
  // =========================================================================

  "i1": {
    id: "i1",
    momento: "iniziale",
    concetto: "potere-acquisto",
    gemella: "f1",
    testo: "Hai 100 euro oggi e li conservi senza investirli. Tra un anno l'inflazione è stata del 5%. Cosa puoi comprare con quei 100 euro?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Più cose di prima",
        lacuna: "inflazione",
        spiegazione: "Quando i prezzi salgono, la stessa somma di denaro compra meno, non di più.",
      },
      {
        id: "b",
        testo: "Esattamente le stesse cose di prima",
        lacuna: "potere-acquisto",
        spiegazione: "Se i prezzi sono aumentati del 5%, la stessa cifra non basta più per comprare le stesse cose.",
      },
      {
        id: "c",
        testo: "Meno cose di prima",
        spiegazione: "Con l'inflazione i prezzi salgono: la stessa somma di denaro compra meno beni. Si dice che il potere d'acquisto si è ridotto.",
      },
      {
        id: "d",
        testo: "Dipende: alcune cose di più, alcune di meno",
        credito: 0.5,
        lacuna: "inflazione",
        spiegazione: "È vero che non tutti i prezzi salgono allo stesso ritmo, ma in media l'inflazione riduce il potere d'acquisto complessivo.",
      },
    ],
  },

  "i2": {
    id: "i2",
    momento: "iniziale",
    concetto: "inflazione",
    gemella: "f2",
    testo: "Negli ultimi 12 mesi quasi tutti i prodotti al supermercato sono diventati più costosi. Come si chiama questo fenomeno?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Deflazione",
        lacuna: "inflazione",
        spiegazione: "La deflazione è il contrario: i prezzi scendono nel tempo.",
      },
      {
        id: "b",
        testo: "Inflazione",
        spiegazione: "L'inflazione è l'aumento generalizzato e continuativo dei prezzi. Quando quasi tutto costa di più, l'economia è in inflazione.",
      },
      {
        id: "c",
        testo: "Rivalutazione",
        lacuna: "inflazione",
        spiegazione: "La rivalutazione riguarda il valore di un asset o di una valuta, non l'andamento generale dei prezzi al consumo.",
      },
      {
        id: "d",
        testo: "Crescita economica",
        lacuna: "inflazione",
        spiegazione: "La crescita economica indica che il paese produce di più. Non coincide necessariamente con l'aumento generalizzato dei prezzi.",
      },
    ],
  },

  "i3": {
    id: "i3",
    momento: "iniziale",
    concetto: "rendimento",
    gemella: "f3",
    testo: "Quale delle seguenti frasi descrive meglio il concetto di rendimento di un investimento?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Il valore totale del denaro che hai investito",
        lacuna: "risparmio",
        spiegazione: "Il valore totale investito è il capitale, non il rendimento. Il rendimento è ciò che guadagni oltre al capitale.",
      },
      {
        id: "b",
        testo: "La quantità di rischio che assumi quando investi",
        lacuna: "rischio",
        spiegazione: "Il rischio riguarda l'incertezza sul risultato futuro; il rendimento è il risultato effettivo che ottieni.",
      },
      {
        id: "c",
        testo: "Il guadagno ottenuto in rapporto al capitale investito",
        spiegazione: "Il rendimento esprime quanto è cresciuto il tuo investimento rispetto a quanto hai messo. Si calcola come guadagno diviso capitale, spesso espresso in percentuale.",
      },
      {
        id: "d",
        testo: "La garanzia di non perdere il capitale investito",
        lacuna: "rischio",
        spiegazione: "Nessun investimento garantisce di non perdere: il rendimento è una misura del guadagno, non una promessa di sicurezza.",
      },
    ],
  },

  "i4": {
    id: "i4",
    momento: "iniziale",
    concetto: "diversificazione",
    gemella: "f4",
    testo: "Quale affermazione spiega meglio il principio della diversificazione?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Concentrare tutti i risparmi nello strumento con il rendimento più alto",
        lacuna: "rischio",
        spiegazione: "Concentrare tutto in un solo strumento aumenta il rischio: se va male, si perde tutto. La diversificazione va nella direzione opposta.",
      },
      {
        id: "b",
        testo: "Scegliere solo strumenti stabili e a basso rischio",
        lacuna: "diversificazione",
        spiegazione: "Scegliere solo strumenti stabili non è diversificazione: è evitare il rischio. La diversificazione riguarda la distribuzione del rischio tra strumenti diversi.",
      },
      {
        id: "c",
        testo: "Distribuire il denaro tra strumenti diversi, così che la perdita di uno sia attenuata dagli altri",
        spiegazione: "Diversificare significa non mettere tutte le uova nello stesso paniere: se un investimento perde, gli altri possono compensare parzialmente la perdita.",
      },
      {
        id: "d",
        testo: "Investire spesso, in piccole quantità, nello stesso strumento",
        lacuna: "diversificazione",
        spiegazione: "Investire a rate nello stesso strumento non è diversificazione: si riduce il rischio di comprare tutto al momento sbagliato, ma non si distribuisce il rischio tra strumenti diversi.",
      },
    ],
  },

  "i5": {
    id: "i5",
    momento: "iniziale",
    concetto: "prestito",
    gemella: "f5",
    testo: "Compri un'obbligazione emessa da un'azienda. Che rapporto hai con quell'azienda?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Possiedi una parte dell'azienda",
        lacuna: "proprieta",
        spiegazione: "Possedere una parte dell'azienda è ciò che fa un'azione, non un'obbligazione.",
      },
      {
        id: "b",
        testo: "Sei un cliente dell'azienda",
        lacuna: "prestito",
        spiegazione: "Comprare un'obbligazione non ha a che fare con i prodotti che l'azienda vende.",
      },
      {
        id: "c",
        testo: "Le hai prestato del denaro, che l'azienda deve restituirti",
        spiegazione: "Esatto: chi compra un'obbligazione è un creditore dell'emittente. L'azienda si impegna a restituire il capitale e a pagare gli interessi pattuiti.",
      },
      {
        id: "d",
        testo: "Hai depositato del denaro, come su un conto corrente",
        credito: 0.5,
        lacuna: "rischio",
        spiegazione: "L'idea di dare denaro a qualcuno è giusta, ma un deposito bancario e un prestito a un'azienda non comportano lo stesso rischio.",
      },
    ],
  },

  // =========================================================================
  // VALUTAZIONE FINALE (f1 – f5)
  // Stessi concetti, scenari diversi — non riusa la formulazione dell'iniziale.
  // =========================================================================

  "f1": {
    id: "f1",
    momento: "finale",
    concetto: "potere-acquisto",
    gemella: "i1",
    testo: "Il tuo stipendio aumenta del 2% quest'anno, ma l'inflazione è stata del 4%. Come cambia la tua capacità di acquisto?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Aumenta, perché guadagni di più rispetto a prima",
        lacuna: "inflazione",
        spiegazione: "Un aumento di stipendio non migliora il potere d'acquisto se i prezzi crescono di più dello stipendio stesso.",
      },
      {
        id: "b",
        testo: "Rimane invariata",
        lacuna: "potere-acquisto",
        spiegazione: "Se i prezzi salgono del 4% e il reddito del 2%, puoi comprare meno di prima, non la stessa quantità.",
      },
      {
        id: "c",
        testo: "Diminuisce, perché i prezzi sono saliti più dello stipendio",
        spiegazione: "Il potere d'acquisto è il rapporto tra reddito e prezzi. Se i prezzi crescono più del reddito, con lo stesso stipendio ci si riesce a permettere meno.",
      },
      {
        id: "d",
        testo: "Dipende da quante cose compri ogni mese",
        lacuna: "potere-acquisto",
        spiegazione: "Il numero degli acquisti non modifica il calcolo. Quello che conta è il rapporto tra variazione del reddito e variazione generale dei prezzi.",
      },
    ],
  },

  "f2": {
    id: "f2",
    momento: "finale",
    concetto: "inflazione",
    gemella: "i2",
    testo: "La banca centrale alza i tassi di interesse per combattere un problema economico. Quale problema sta cercando di contenere?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "La disoccupazione",
        lacuna: "inflazione",
        spiegazione: "L'aumento dei tassi tende a rallentare l'economia; non è la cura tipica per la disoccupazione.",
      },
      {
        id: "b",
        testo: "La deflazione",
        lacuna: "inflazione",
        spiegazione: "Contro la deflazione la banca centrale abbassa i tassi, non li alza.",
      },
      {
        id: "c",
        testo: "L'inflazione",
        spiegazione: "Tassi più alti rendono il credito più costoso, frenano i consumi e aiutano a riportare l'inflazione verso livelli normali.",
      },
      {
        id: "d",
        testo: "Il debito pubblico dello Stato",
        lacuna: "risparmio",
        spiegazione: "Il debito pubblico si gestisce con politiche fiscali; la politica sui tassi è uno strumento della banca centrale per controllare l'inflazione.",
      },
    ],
  },

  "f3": {
    id: "f3",
    momento: "finale",
    concetto: "rendimento",
    gemella: "i3",
    testo: "Due strumenti finanziari hanno avuto risultati diversi nell'ultimo anno: il primo ha guadagnato il 3%, il secondo ha perso il 2%. In quale dei due si parla di rendimento negativo?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Nel primo, perché il 3% è troppo basso",
        lacuna: "rendimento",
        spiegazione: "Il 3% è un rendimento positivo: ha guadagnato il 3% del capitale investito. Se sia alto o basso dipende dal confronto, non dal segno.",
      },
      {
        id: "b",
        testo: "Nel secondo, perché il valore è sceso",
        spiegazione: "Quando il valore di un investimento diminuisce, il rendimento è negativo: si è ottenuto meno di quello che si è messo.",
      },
      {
        id: "c",
        testo: "In entrambi, perché nessuno ha un rendimento fisso",
        lacuna: "rendimento",
        spiegazione: "Il rendimento fisso è una caratteristica di certi strumenti, non una condizione per avere un rendimento positivo o negativo.",
      },
      {
        id: "d",
        testo: "In nessuno dei due, perché i rendimenti si misurano solo su orizzonti di almeno 5 anni",
        lacuna: "rendimento",
        spiegazione: "I rendimenti si possono misurare su qualsiasi periodo: un anno è una misura valida quanto cinque.",
      },
    ],
  },

  "f4": {
    id: "f4",
    momento: "finale",
    concetto: "diversificazione",
    gemella: "i4",
    testo: "Un paniere contiene azioni di 50 aziende diverse, in settori diversi e in paesi diversi. Qual è il vantaggio principale rispetto a detenere azioni di una sola azienda?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Il rendimento sarà sicuramente più alto",
        lacuna: "rendimento",
        spiegazione: "La diversificazione non garantisce rendimenti più alti: riduce il rischio specifico, ma non assicura guadagni maggiori.",
      },
      {
        id: "b",
        testo: "Non si può perdere denaro",
        lacuna: "rischio",
        spiegazione: "Anche un portafoglio diversificato può perdere valore: la diversificazione riduce il rischio, non lo elimina.",
      },
      {
        id: "c",
        testo: "Il rischio è distribuito: il calo di una singola azienda pesa meno sull'insieme",
        spiegazione: "Con 50 aziende diversificate, il fallimento o il calo di una sola impatta in modo limitato sull'intero portafoglio.",
      },
      {
        id: "d",
        testo: "Le aziende nel paniere sono più protette dal rischio di fallimento",
        lacuna: "diversificazione",
        spiegazione: "La diversificazione protegge l'investitore dalla concentrazione del rischio, non le singole aziende dai loro problemi.",
      },
    ],
  },

  "f5": {
    id: "f5",
    momento: "finale",
    concetto: "prestito",
    gemella: "i5",
    testo: "Lo Stato italiano emette titoli di debito pubblico. Chi compra questi titoli, che ruolo assume nei confronti dello Stato?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Diventa comproprietario di una parte dei beni pubblici italiani",
        lacuna: "proprieta",
        spiegazione: "Comprare debito pubblico non dà diritti di proprietà sullo Stato: è un rapporto creditizio, non societario.",
      },
      {
        id: "b",
        testo: "Diventa un cliente privilegiato dei servizi pubblici",
        lacuna: "prestito",
        spiegazione: "I titoli di Stato non danno diritto a servizi speciali: sono uno strumento di debito, non un abbonamento.",
      },
      {
        id: "c",
        testo: "Diventa creditore dello Stato, che si impegna a restituire il denaro con gli interessi",
        spiegazione: "Chi compra titoli di Stato presta denaro allo Stato. In cambio riceve interessi periodici (cedole) e il rimborso del capitale a scadenza.",
      },
      {
        id: "d",
        testo: "Entra in una società di investimento gestita dallo Stato",
        lacuna: "prestito",
        spiegazione: "I titoli di Stato sono strumenti di debito diretto, non quote di fondi o società a partecipazione statale.",
      },
    ],
  },

  // =========================================================================
  // VERIFICHE (v-lXX) — una per lezione, al termine del modulo
  // =========================================================================

  "v-l1a": {
    id: "v-l1a",
    momento: "verifica",
    concetto: "risparmio",
    gemella: "r-l1a",
    testo: "Qual è la differenza principale tra reddito e risparmio?",
    corretta: "a",
    opzioni: [
      {
        id: "a",
        testo: "Il reddito è ciò che guadagni; il risparmio è la parte che non spendi",
        spiegazione: "Il risparmio nasce dalla differenza tra ciò che entra (reddito) e ciò che esce (spese). Risparmiare significa accantonare una parte del reddito invece di spenderla tutta.",
      },
      {
        id: "b",
        testo: "Il reddito e il risparmio sono la stessa cosa",
        lacuna: "risparmio",
        spiegazione: "Il reddito è ciò che guadagni; il risparmio è solo la parte che decidi di non spendere. Non coincidono.",
      },
      {
        id: "c",
        testo: "Il risparmio è il denaro che chiedi in prestito",
        lacuna: "prestito",
        spiegazione: "Il risparmio viene da ciò che già guadagni e metti da parte; il prestito è denaro altrui che devi restituire.",
      },
      {
        id: "d",
        testo: "Il reddito è ciò che spendi; il risparmio è ciò che guadagni",
        lacuna: "risparmio",
        spiegazione: "È il contrario: il reddito è ciò che guadagni, il risparmio è la parte di quel reddito che non spendi.",
      },
    ],
  },

  "v-l1b": {
    id: "v-l1b",
    momento: "verifica",
    concetto: "potere-acquisto",
    gemella: "r-l1b",
    testo: "Con 200 euro compri una lista della spesa. L'anno prossimo gli stessi prodotti costano in totale 210 euro. Come cambia il tuo potere d'acquisto?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Aumenta, perché hai ancora 200 euro in tasca",
        lacuna: "inflazione",
        spiegazione: "Avere ancora 200 euro non significa che il potere d'acquisto sia rimasto lo stesso: con 200 euro non puoi più comprare la stessa lista.",
      },
      {
        id: "b",
        testo: "Rimane uguale, perché non hai cambiato le tue abitudini",
        lacuna: "potere-acquisto",
        spiegazione: "Le abitudini non influenzano il potere d'acquisto: quello che conta è quante cose riesci a comprare con la stessa somma.",
      },
      {
        id: "c",
        testo: "Diminuisce, perché con 200 euro non riesci più a comprare gli stessi prodotti",
        spiegazione: "Se i prezzi sono saliti, la stessa somma di denaro compra meno: il potere d'acquisto si è ridotto.",
      },
      {
        id: "d",
        testo: "Dipende dal tipo di prodotti che hai acquistato",
        lacuna: "potere-acquisto",
        spiegazione: "Il potere d'acquisto misura la capacità di acquisto complessiva rispetto al livello generale dei prezzi; non dipende dal tipo specifico di prodotti.",
      },
    ],
  },

  "v-l2a": {
    id: "v-l2a",
    momento: "verifica",
    concetto: "inflazione",
    gemella: "r-l2a",
    testo: "Quale delle seguenti situazioni descrive correttamente l'inflazione?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Il prezzo di qualche prodotto specifico sale molto",
        lacuna: "inflazione",
        spiegazione: "L'inflazione non riguarda uno o pochi prodotti: è l'aumento generalizzato e sostenuto del livello dei prezzi nell'economia.",
      },
      {
        id: "b",
        testo: "Il livello generale dei prezzi aumenta nel tempo",
        spiegazione: "L'inflazione è l'aumento generalizzato e continuativo dei prezzi. Non riguarda un singolo prodotto, ma la media di tutti i beni e servizi.",
      },
      {
        id: "c",
        testo: "La quantità di moneta in circolazione si riduce",
        lacuna: "inflazione",
        spiegazione: "La riduzione della moneta in circolazione tende a produrre deflazione (calo dei prezzi), non inflazione.",
      },
      {
        id: "d",
        testo: "Le banche abbassano i tassi di interesse",
        lacuna: "inflazione",
        spiegazione: "I tassi di interesse sono uno strumento per gestire l'inflazione, non una sua definizione.",
      },
    ],
  },

  "v-l3a": {
    id: "v-l3a",
    momento: "verifica",
    concetto: "investimento",
    gemella: "r-l3a",
    testo: "Risparmiare e investire sono due modi diversi di usare il denaro che non spendi. Che cosa li distingue?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Nessuna differenza: sono due parole per la stessa cosa",
        lacuna: "investimento",
        spiegazione: "Sono due usi distinti dello stesso denaro: il risparmio punta alla sicurezza e alla disponibilità immediata, l'investimento accetta un risultato incerto.",
      },
      {
        id: "b",
        testo: "Investire garantisce che il denaro cresca, risparmiare no",
        lacuna: "investimento",
        spiegazione: "L'investimento non garantisce nulla: mette in conto che il risultato futuro non sia noto in anticipo, né in positivo né in negativo.",
      },
      {
        id: "c",
        testo: "Il risparmio punta alla sicurezza e alla disponibilità immediata; l'investimento accetta un risultato incerto in cambio della possibilità di crescita nel tempo",
        spiegazione: "È la distinzione della lezione. Non descrive quale dei due sia preferibile: sono due usi diversi dello stesso denaro, con obiettivi diversi.",
      },
      {
        id: "d",
        testo: "Il risparmio riguarda somme piccole, l'investimento somme grandi",
        lacuna: "investimento",
        spiegazione: "La differenza non sta nell'importo, ma in che cosa si accetta: disponibilità e stabilità da una parte, incertezza sul risultato dall'altra.",
      },
    ],
  },

  "v-l4a": {
    id: "v-l4a",
    momento: "verifica",
    concetto: "rischio",
    gemella: "r-l4a",
    testo: "In ambito finanziario, cosa si intende con il termine 'rischio'?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "La certezza di perdere il denaro investito",
        lacuna: "rischio",
        spiegazione: "Il rischio non significa perdita certa: è l'incertezza sul risultato futuro, che può andare meglio o peggio del previsto.",
      },
      {
        id: "b",
        testo: "L'incertezza sul risultato futuro di un investimento",
        spiegazione: "Il rischio finanziario è l'incertezza: non si sa in anticipo se un investimento guadagnerà o perderà. Maggiore è l'incertezza, maggiore è il rischio.",
      },
      {
        id: "c",
        testo: "Il tasso di rendimento atteso in futuro",
        lacuna: "rendimento",
        spiegazione: "Il rendimento atteso è la stima di quanto si guadagnerà; il rischio è invece l'incertezza intorno a quella stima.",
      },
      {
        id: "d",
        testo: "Il costo per acquistare uno strumento finanziario",
        lacuna: "rischio",
        spiegazione: "Il costo di acquisto (commissione o prezzo di mercato) non coincide con il rischio: il rischio riguarda l'esito futuro incerto.",
      },
    ],
  },

  "v-l4b": {
    id: "v-l4b",
    momento: "verifica",
    concetto: "rendimento",
    gemella: "r-l4b",
    testo: "Qual è la relazione generale tra rischio e possibilità di rendimento?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Più il rischio è alto, minore è la possibilità di guadagno",
        lacuna: "rendimento",
        spiegazione: "È il contrario: chi accetta più rischio ha in genere la possibilità di un rendimento più alto, come compensazione per l'incertezza.",
      },
      {
        id: "b",
        testo: "Rischio e rendimento non hanno nessuna relazione",
        lacuna: "rischio",
        spiegazione: "In finanza esiste una relazione riconosciuta: a rischio più alto corrisponde, in generale, una maggiore possibilità di rendimento — e viceversa.",
      },
      {
        id: "c",
        testo: "A rischio più alto corrisponde in generale una maggiore possibilità di rendimento",
        spiegazione: "Questo è uno dei princìpi fondamentali della finanza: se vuoi la possibilità di guadagnare di più, devi accettare più incertezza. Non è una garanzia: è il compenso per l'incertezza.",
      },
      {
        id: "d",
        testo: "Gli strumenti a basso rischio hanno sempre un rendimento negativo",
        lacuna: "rendimento",
        spiegazione: "Gli strumenti a basso rischio tendono ad avere rendimenti contenuti, ma possono comunque essere positivi.",
      },
    ],
  },

  "v-l5a": {
    id: "v-l5a",
    momento: "verifica",
    concetto: "diversificazione",
    gemella: "r-l5a",
    testo: "Perché diversificare riduce il rischio complessivo di un portafoglio?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Perché elimina la possibilità di perdere denaro",
        lacuna: "rischio",
        spiegazione: "La diversificazione riduce il rischio, non lo elimina. Anche un portafoglio diversificato può perdere valore.",
      },
      {
        id: "b",
        testo: "Perché aumenta il rendimento medio degli strumenti",
        lacuna: "rendimento",
        spiegazione: "La diversificazione non garantisce rendimenti più alti: il suo scopo principale è ridurre il rischio, non massimizzare i guadagni.",
      },
      {
        id: "c",
        testo: "Perché quando alcuni strumenti perdono, altri possono compensare le perdite",
        spiegazione: "Investendo in strumenti che non si muovono tutti nello stesso modo, le perdite di alcuni possono essere parzialmente compensate dai guadagni di altri.",
      },
      {
        id: "d",
        testo: "Perché le commissioni sono più basse con molti strumenti",
        lacuna: "diversificazione",
        spiegazione: "Le commissioni dipendono dai prodotti e dai provider scelti, non dalla diversificazione in sé.",
      },
    ],
  },

  "v-l6a": {
    id: "v-l6a",
    momento: "verifica",
    concetto: "prestito",
    gemella: "r-l6a",
    testo: "Comprare un'obbligazione significa diventare...",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Proprietario di una quota dell'emittente",
        lacuna: "proprieta",
        spiegazione: "Diventare proprietario di una quota è ciò che accade comprando azioni, non obbligazioni.",
      },
      {
        id: "b",
        testo: "Creditore dell'emittente, che si impegna a restituire il denaro",
        spiegazione: "Chi compra un'obbligazione presta denaro all'emittente. L'emittente si impegna a restituire il capitale e a pagare interessi (cedole) periodici.",
      },
      {
        id: "c",
        testo: "Garante dell'emittente presso le banche",
        lacuna: "prestito",
        spiegazione: "Il compratore di un'obbligazione non garantisce nulla: è lui che riceve la promessa di rimborso da parte dell'emittente.",
      },
      {
        id: "d",
        testo: "Socio dell'emittente con diritti di voto nelle assemblee",
        lacuna: "proprieta",
        spiegazione: "I diritti di voto nelle assemblee sono prerogativa degli azionisti, non degli obbligazionisti.",
      },
    ],
  },

  "v-l6b": {
    id: "v-l6b",
    momento: "verifica",
    concetto: "titolo-stato",
    gemella: "r-l6b",
    testo: "Un titolo di Stato è uno strumento con cui lo Stato...",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Vende una quota della propria proprietà pubblica",
        lacuna: "proprieta",
        spiegazione: "Lo Stato non cede proprietà pubblica vendendo titoli di Stato: prende in prestito denaro dai compratori.",
      },
      {
        id: "b",
        testo: "Prende in prestito denaro dai compratori, impegnandosi a restituirlo",
        spiegazione: "Un titolo di Stato è un debito dello Stato: chi lo compra presta denaro allo Stato, che in cambio paga interessi e restituisce il capitale a scadenza.",
      },
      {
        id: "c",
        testo: "Distribuisce i proventi delle tasse tra i cittadini",
        lacuna: "titolo-stato",
        spiegazione: "I titoli di Stato non riguardano la distribuzione delle tasse: sono strumenti con cui lo Stato si finanzia prendendo in prestito.",
      },
      {
        id: "d",
        testo: "Garantisce un deposito bancario sicuro ai cittadini",
        lacuna: "titolo-stato",
        spiegazione: "I depositi bancari e i titoli di Stato sono strumenti diversi: entrambi a basso rischio, ma con meccanismi di funzionamento distinti.",
      },
    ],
  },

  "v-l6c": {
    id: "v-l6c",
    momento: "verifica",
    concetto: "obbligazione-societaria",
    gemella: "r-l6c",
    testo: "In cosa si differenzia principalmente un'obbligazione societaria da un titolo di Stato?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Con l'obbligazione societaria diventi proprietario dell'azienda, con il titolo di Stato sei creditore dello Stato",
        lacuna: "proprieta",
        spiegazione: "In entrambi i casi sei creditore: presti denaro all'emittente. Non diventi proprietario in nessuno dei due casi.",
      },
      {
        id: "b",
        testo: "Sono identici: funzionano esattamente nello stesso modo",
        lacuna: "obbligazione-societaria",
        spiegazione: "La logica di fondo è simile (rapporto creditore-debitore), ma l'emittente è diverso e di solito cambia anche il profilo di rischio.",
      },
      {
        id: "c",
        testo: "L'emittente è un'azienda invece che uno Stato, e di solito il rischio è maggiore",
        spiegazione: "Sia i titoli di Stato sia le obbligazioni societarie sono strumenti di debito. La differenza principale è l'emittente: le aziende presentano in genere un rischio maggiore rispetto agli Stati.",
      },
      {
        id: "d",
        testo: "Le obbligazioni societarie non hanno una scadenza fissa",
        lacuna: "obbligazione-societaria",
        spiegazione: "Le obbligazioni societarie, come i titoli di Stato, hanno quasi sempre una scadenza definita al momento dell'emissione.",
      },
    ],
  },

  "v-l6d": {
    id: "v-l6d",
    momento: "verifica",
    concetto: "azione",
    gemella: "r-l6d",
    testo: "Chi compra un'azione di un'azienda acquista...",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Un credito verso l'azienda, che verrà rimborsato a scadenza",
        lacuna: "prestito",
        spiegazione: "Il credito a scadenza è caratteristico delle obbligazioni, non delle azioni. Le azioni non prevedono un rimborso del capitale.",
      },
      {
        id: "b",
        testo: "Il diritto di ricevere interessi fissi ogni anno",
        lacuna: "obbligazione-societaria",
        spiegazione: "Gli interessi fissi (cedole) sono una caratteristica delle obbligazioni. Le azioni non garantiscono interessi: i dividendi dipendono dall'andamento dell'azienda.",
      },
      {
        id: "c",
        testo: "Una quota di proprietà nell'azienda, con i relativi diritti e rischi",
        spiegazione: "Un'azione rappresenta una piccola quota dell'azienda. L'azionista è comproprietario: partecipa ai profitti (dividendi) ma anche alle perdite, e ha diritto di voto nelle assemblee.",
      },
      {
        id: "d",
        testo: "Una garanzia che l'azienda non fallirà",
        lacuna: "rischio",
        spiegazione: "Nessun titolo garantisce contro il fallimento. Le azioni sono tra gli strumenti più rischiosi: in caso di fallimento, gli azionisti vengono rimborsati per ultimi.",
      },
    ],
  },

  "v-l6e": {
    id: "v-l6e",
    momento: "verifica",
    concetto: "etf",
    gemella: "r-l6e",
    testo: "Cos'è un ETF?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Un conto corrente che offre interessi garantiti",
        lacuna: "etf",
        spiegazione: "Un ETF non è un conto corrente e non offre interessi garantiti: è uno strumento di investimento il cui valore dipende dagli asset che contiene.",
      },
      {
        id: "b",
        testo: "Un'obbligazione emessa da un fondo privato",
        lacuna: "obbligazione-societaria",
        spiegazione: "Un ETF non è un'obbligazione: non prevede un rimborso a scadenza né cedole fisse. È un paniere di asset quotato in borsa.",
      },
      {
        id: "c",
        testo: "Uno strumento che replica l'andamento di un indice, come un paniere di azioni o obbligazioni",
        spiegazione: "ETF sta per Exchange-Traded Fund. È un fondo quotato in borsa che replica l'andamento di un indice. Chi lo compra ottiene esposizione a tutti gli asset del paniere con un unico acquisto.",
      },
      {
        id: "d",
        testo: "Un titolo che dà diritto di voto nelle assemblee delle maggiori aziende",
        lacuna: "azione",
        spiegazione: "Il diritto di voto nelle assemblee è prerogativa degli azionisti diretti. Comprare un ETF non trasferisce di solito gli stessi diritti di voto di un azionista.",
      },
    ],
  },

  // =========================================================================
  // RIVERIFICHE (r-lXX) — scenari diversi rispetto alla verifica
  // =========================================================================

  "r-l1a": {
    id: "r-l1a",
    momento: "riverifica",
    concetto: "risparmio",
    gemella: "v-l1a",
    testo: "Luca guadagna 1.500 euro al mese e spende 1.200 euro. Quale affermazione è corretta?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Luca non ha risparmio, perché guadagna poco",
        lacuna: "risparmio",
        spiegazione: "Il risparmio non dipende dall'ammontare assoluto del reddito, ma dalla differenza tra entrate e uscite. Luca ha un risparmio positivo.",
      },
      {
        id: "b",
        testo: "Luca risparmia 300 euro al mese",
        spiegazione: "Il risparmio mensile è la differenza tra reddito e spese: 1.500 − 1.200 = 300 euro. Questi 300 euro non vengono spesi e possono essere accantonati.",
      },
      {
        id: "c",
        testo: "Luca risparmia 1.500 euro al mese",
        lacuna: "risparmio",
        spiegazione: "1.500 euro è il reddito totale, non il risparmio. Il risparmio è solo la parte che rimane dopo le spese.",
      },
      {
        id: "d",
        testo: "Il risparmio di Luca corrisponde a 1.200 euro",
        lacuna: "risparmio",
        spiegazione: "1.200 euro sono le spese di Luca, non il risparmio. Il risparmio è la differenza tra reddito e spese.",
      },
    ],
  },

  "r-l1b": {
    id: "r-l1b",
    momento: "riverifica",
    concetto: "potere-acquisto",
    gemella: "v-l1b",
    testo: "Il governo annuncia che i salari aumenteranno del 3% il prossimo anno, ma l'inflazione prevista è del 6%. Cosa succede al potere d'acquisto dei lavoratori?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Aumenta, perché i salari crescono",
        lacuna: "inflazione",
        spiegazione: "Un aumento dei salari non migliora il potere d'acquisto se i prezzi crescono di più.",
      },
      {
        id: "b",
        testo: "Rimane invariato",
        lacuna: "potere-acquisto",
        spiegazione: "Se i prezzi crescono del 6% e i salari del 3%, i lavoratori riescono a comprare meno di prima: il potere d'acquisto scende.",
      },
      {
        id: "c",
        testo: "Diminuisce, perché i prezzi salgono più dei salari",
        spiegazione: "Il potere d'acquisto si calcola confrontando la variazione del reddito con quella dei prezzi. Se i prezzi crescono del 6% e i salari del 3%, in termini reali si guadagna meno.",
      },
      {
        id: "d",
        testo: "Aumenta solo per chi lavora nel settore pubblico",
        lacuna: "potere-acquisto",
        spiegazione: "Il potere d'acquisto non dipende dal settore lavorativo: dipende dal rapporto tra reddito e prezzi per tutti.",
      },
    ],
  },

  "r-l2a": {
    id: "r-l2a",
    momento: "riverifica",
    concetto: "inflazione",
    gemella: "v-l2a",
    testo: "L'aumento generalizzato dei prezzi dell'energia e dei generi alimentari ha un effetto sull'economia. Quale?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Aumenta la deflazione",
        lacuna: "inflazione",
        spiegazione: "La deflazione è la discesa generale dei prezzi. Se energia e cibo costano di più, si va nella direzione opposta.",
      },
      {
        id: "b",
        testo: "Aumenta il PIL reale",
        lacuna: "inflazione",
        spiegazione: "Il PIL reale misura la crescita della produzione depurata dall'inflazione. L'aumento dei prezzi non corrisponde automaticamente a un aumento di produzione.",
      },
      {
        id: "c",
        testo: "Aumenta l'inflazione",
        spiegazione: "L'aumento del prezzo di beni diffusi come energia e cibo si trasmette all'intera economia e fa salire il livello generale dei prezzi, cioè l'inflazione.",
      },
      {
        id: "d",
        testo: "Aumenta il potere d'acquisto",
        lacuna: "potere-acquisto",
        spiegazione: "Se i prezzi salgono, il potere d'acquisto diminuisce, non aumenta.",
      },
    ],
  },

  "r-l3a": {
    id: "r-l3a",
    momento: "riverifica",
    concetto: "investimento",
    gemella: "v-l3a",
    testo: "Due persone mettono da parte 1.000 euro ciascuna. La prima li tiene su un conto da cui può prelevarli in qualsiasi momento. La seconda li impiega in uno strumento il cui valore può cambiare nel tempo. Che cosa distingue le due situazioni?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "La seconda persona ha commesso un errore",
        lacuna: "investimento",
        spiegazione: "Non c'è un errore: sono due usi diversi dello stesso denaro. La lezione descrive la differenza, non stabilisce quale situazione sia preferibile.",
      },
      {
        id: "b",
        testo: "La seconda ha accettato un risultato incerto; la prima ha privilegiato la disponibilità immediata e la stabilità dell'importo",
        spiegazione: "È esattamente la differenza tra risparmiare e investire: cambia ciò che si accetta sul risultato futuro, non la somma di partenza.",
      },
      {
        id: "c",
        testo: "Nessuna: in entrambi i casi i 1.000 euro restano 1.000 euro",
        lacuna: "investimento",
        spiegazione: "Nel secondo caso l'importo può cambiare nel tempo, in aumento o in diminuzione: è il risultato incerto che caratterizza l'investimento.",
      },
      {
        id: "d",
        testo: "La prima persona sta investendo, la seconda sta risparmiando",
        lacuna: "investimento",
        spiegazione: "È il contrario: tenere il denaro disponibile e stabile descrive il risparmio, impiegarlo accettando un valore che può variare descrive l'investimento.",
      },
    ],
  },

  "r-l4a": {
    id: "r-l4a",
    momento: "riverifica",
    concetto: "rischio",
    gemella: "v-l4a",
    testo: "Due strumenti finanziari hanno avuto in media lo stesso rendimento su 10 anni. Il primo ha avuto fluttuazioni molto ampie; il secondo è rimasto stabile. Quale ha il rischio maggiore?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Il secondo, perché è rimasto stabile",
        lacuna: "rischio",
        spiegazione: "La stabilità indica meno rischio, non di più. Il rischio è legato alla variabilità dei risultati nel tempo.",
      },
      {
        id: "b",
        testo: "Entrambi allo stesso modo, perché il rendimento medio è uguale",
        lacuna: "rischio",
        spiegazione: "Un rendimento medio uguale non implica un rischio uguale: le fluttuazioni lungo il percorso rappresentano incertezza, e quindi rischio.",
      },
      {
        id: "c",
        testo: "Il primo, perché le sue fluttuazioni sono più ampie",
        spiegazione: "In finanza, la variabilità del rendimento (volatilità) è una misura del rischio. Fluttuazioni ampie significano più incertezza sul risultato finale.",
      },
      {
        id: "d",
        testo: "Nessuno dei due, perché il rischio si misura solo al momento della vendita",
        lacuna: "rischio",
        spiegazione: "Il rischio si manifesta durante tutto il percorso: le oscillazioni intermedie sono parte del rischio, non un dettaglio trascurabile.",
      },
    ],
  },

  "r-l4b": {
    id: "r-l4b",
    momento: "riverifica",
    concetto: "rendimento",
    gemella: "v-l4b",
    testo: "Un conto di risparmio paga un interesse basso. Uno strumento ipotetico alternativo offre potenzialmente il triplo, ma il suo valore può oscillare molto. Quale principio spiega questa differenza?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Il principio della diversificazione",
        lacuna: "diversificazione",
        spiegazione: "La diversificazione riguarda la distribuzione del rischio tra più strumenti; non spiega perché strumenti diversi offrono rendimenti potenziali diversi.",
      },
      {
        id: "b",
        testo: "Il principio per cui a rischio maggiore corrisponde una maggiore possibilità di rendimento",
        spiegazione: "La differenza di rendimento potenziale riflette la differenza di rischio: lo strumento che oscilla di più offre una possibilità di guadagno maggiore come compensazione per l'incertezza.",
      },
      {
        id: "c",
        testo: "Il principio dell'inflazione",
        lacuna: "inflazione",
        spiegazione: "L'inflazione erode il potere d'acquisto, ma non spiega il meccanismo per cui strumenti più rischiosi offrono rendimenti potenziali più alti.",
      },
      {
        id: "d",
        testo: "Il principio del potere d'acquisto",
        lacuna: "potere-acquisto",
        spiegazione: "Il potere d'acquisto riguarda quante cose puoi comprare con una somma di denaro; non spiega la relazione tra rischio e rendimento.",
      },
    ],
  },

  "r-l5a": {
    id: "r-l5a",
    momento: "riverifica",
    concetto: "diversificazione",
    gemella: "v-l5a",
    testo: "Un portafoglio ipotetico contiene azioni di sole aziende del settore tecnologico italiano. Quale affermazione è corretta riguardo alla sua diversificazione?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "È ben diversificato, perché contiene molte aziende diverse",
        lacuna: "diversificazione",
        spiegazione: "Avere molte aziende non basta: se sono tutte nello stesso settore e paese, un problema specifico di quel settore le colpisce tutte insieme.",
      },
      {
        id: "b",
        testo: "È poco diversificato, perché è concentrato in un solo settore e paese",
        spiegazione: "Una buona diversificazione distribuisce il rischio tra settori, aree geografiche e tipi di strumento diversi. Concentrarsi su un solo settore e paese riduce questa protezione.",
      },
      {
        id: "c",
        testo: "È sufficiente, perché le azioni sono già uno strumento diversificato per natura",
        lacuna: "diversificazione",
        spiegazione: "Le azioni in sé non sono diversificate: ciascuna rappresenta un'azienda specifica. Comprare azioni di molte aziende diverse, in settori e paesi diversi, crea diversificazione.",
      },
      {
        id: "d",
        testo: "La diversificazione non è necessaria se le aziende sono grandi",
        lacuna: "rischio",
        spiegazione: "Le dimensioni di un'azienda non la proteggono da crisi settoriali o nazionali. La diversificazione rimane utile indipendentemente dalla grandezza delle aziende.",
      },
    ],
  },

  "r-l6a": {
    id: "r-l6a",
    momento: "riverifica",
    concetto: "prestito",
    gemella: "v-l6a",
    testo: "Un'azienda ha bisogno di finanziamenti e decide di emettere obbligazioni. Chi compra queste obbligazioni, rispetto all'azienda, è...",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Un partner commerciale che condivide i profitti aziendali",
        lacuna: "proprieta",
        spiegazione: "Condividere i profitti è caratteristico di chi possiede azioni. Gli obbligazionisti ricevono interessi fissi, non una quota dei profitti.",
      },
      {
        id: "b",
        testo: "Un azionista con diritti speciali",
        lacuna: "proprieta",
        spiegazione: "Gli azionisti sono proprietari; gli obbligazionisti sono creditori. Sono due categorie con diritti diversi.",
      },
      {
        id: "c",
        testo: "Un creditore che ha prestato denaro all'azienda e verrà rimborsato",
        spiegazione: "Chi compra obbligazioni di un'azienda le ha prestato denaro. L'azienda deve restituirlo con gli interessi concordati alla scadenza.",
      },
      {
        id: "d",
        testo: "Un assicuratore che copre i rischi dell'azienda",
        lacuna: "prestito",
        spiegazione: "Le obbligazioni non hanno nulla a che fare con l'assicurazione: sono strumenti di debito con cui l'azienda si finanzia.",
      },
    ],
  },

  "r-l6b": {
    id: "r-l6b",
    momento: "riverifica",
    concetto: "titolo-stato",
    gemella: "v-l6b",
    testo: "Marco compra un BTP (Buono del Tesoro Poliennale) italiano. Quale relazione si stabilisce tra Marco e lo Stato italiano?",
    corretta: "b",
    opzioni: [
      {
        id: "a",
        testo: "Marco diventa comproprietario di asset pubblici italiani",
        lacuna: "proprieta",
        spiegazione: "Comprare un BTP non dà diritti di proprietà sullo Stato: Marco è un creditore, non un proprietario.",
      },
      {
        id: "b",
        testo: "Marco diventa creditore dello Stato, che si impegna a restituirgli il denaro con gli interessi",
        spiegazione: "Un BTP è un titolo di debito: Marco presta denaro allo Stato italiano, che in cambio paga cedole periodiche e rimborsa il capitale a scadenza.",
      },
      {
        id: "c",
        testo: "Marco partecipa alla gestione delle finanze pubbliche",
        lacuna: "titolo-stato",
        spiegazione: "I titoli di Stato non danno diritti di gestione o voto: sono un rapporto creditizio, non partecipativo.",
      },
      {
        id: "d",
        testo: "Marco apre un conto vincolato presso la Banca d'Italia",
        lacuna: "titolo-stato",
        spiegazione: "Un BTP è un titolo di mercato, non un conto bancario; può essere comprato e venduto sul mercato prima della scadenza.",
      },
    ],
  },

  "r-l6c": {
    id: "r-l6c",
    momento: "riverifica",
    concetto: "obbligazione-societaria",
    gemella: "v-l6c",
    testo: "Sofia compra un'obbligazione emessa da una grande azienda. Rispetto a chi ha comprato un titolo di Stato con caratteristiche simili, Sofia probabilmente...",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Ha un rendimento potenziale inferiore, perché le aziende sono più affidabili degli Stati",
        lacuna: "rischio",
        spiegazione: "In generale, le aziende sono considerate più rischiose degli Stati. Per compensare questo rischio, le obbligazioni societarie offrono un rendimento potenziale più alto, non più basso.",
      },
      {
        id: "b",
        testo: "Ha assunto un rischio simile, perché entrambe sono obbligazioni",
        lacuna: "obbligazione-societaria",
        spiegazione: "Pur avendo la stessa struttura logica (rapporto creditore-debitore), le obbligazioni societarie presentano in genere un rischio maggiore di quelle statali.",
      },
      {
        id: "c",
        testo: "Ha assunto un rischio maggiore e ha una possibilità di rendimento più alta",
        spiegazione: "In genere, le aziende presentano un rischio maggiore degli Stati. Per compensare questo rischio, le obbligazioni societarie offrono un interesse potenziale più alto.",
      },
      {
        id: "d",
        testo: "È diventata comproprietaria dell'azienda",
        lacuna: "proprieta",
        spiegazione: "Comprare obbligazioni di un'azienda non dà diritti di proprietà: Sofia è creditrice, non azionista.",
      },
    ],
  },

  "r-l6d": {
    id: "r-l6d",
    momento: "riverifica",
    concetto: "azione",
    gemella: "v-l6d",
    testo: "L'azienda XYZ realizza un profitto record quest'anno. In che modo questo può influenzare gli azionisti?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "Non influenza gli azionisti: i profitti appartengono solo al management",
        lacuna: "azione",
        spiegazione: "Il management gestisce l'azienda, ma i profitti appartengono agli azionisti: loro sono i proprietari.",
      },
      {
        id: "b",
        testo: "Gli azionisti ricevono automaticamente metà del profitto",
        lacuna: "azione",
        spiegazione: "Non è automatico né una percentuale fissa: la distribuzione dei profitti (dividendi) è decisa dall'assemblea degli azionisti.",
      },
      {
        id: "c",
        testo: "Gli azionisti possono beneficiare di dividendi e di un aumento del valore delle azioni",
        spiegazione: "Un buon risultato aziendale può tradursi in dividendi distribuiti agli azionisti e in un aumento del prezzo dell'azione sul mercato.",
      },
      {
        id: "d",
        testo: "Gli azionisti devono restituire una parte del profitto come creditori",
        lacuna: "prestito",
        spiegazione: "Gli azionisti sono proprietari, non creditori. Non devono restituire nulla: partecipano ai profitti, non finanziano l'azienda come un prestito.",
      },
    ],
  },

  "r-l6e": {
    id: "r-l6e",
    momento: "riverifica",
    concetto: "etf",
    gemella: "v-l6e",
    testo: "In che modo un ETF è diverso dall'acquisto diretto di una singola azione?",
    corretta: "c",
    opzioni: [
      {
        id: "a",
        testo: "L'ETF garantisce un rendimento fisso, mentre l'azione no",
        lacuna: "etf",
        spiegazione: "Né gli ETF né le azioni garantiscono rendimenti fissi. Entrambi dipendono dall'andamento del mercato.",
      },
      {
        id: "b",
        testo: "L'ETF è più sicuro perché non può perdere valore",
        lacuna: "rischio",
        spiegazione: "Anche un ETF può perdere valore: il suo prezzo riflette l'andamento degli asset nel paniere che replica.",
      },
      {
        id: "c",
        testo: "L'ETF replica un insieme di asset, offrendo diversificazione con un solo acquisto",
        spiegazione: "Comprando un ETF si ottiene esposizione a molti asset contemporaneamente, ottenendo diversificazione senza doverli acquistare uno per uno.",
      },
      {
        id: "d",
        testo: "L'ETF è emesso da un governo, mentre le azioni sono emesse da aziende",
        lacuna: "etf",
        spiegazione: "Gli ETF non sono emessi da governi: sono fondi gestiti da società finanziarie e quotati in borsa, acquistabili come le azioni.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Export pubblici
// ---------------------------------------------------------------------------

export const DOMANDE: Readonly<Record<DomandaId, Domanda>> = _DOMANDE;

export const VALUTAZIONE_INIZIALE: readonly DomandaId[] = [
  "i1", "i2", "i3", "i4", "i5",
];

export const VALUTAZIONE_FINALE: readonly DomandaId[] = [
  "f1", "f2", "f3", "f4", "f5",
];

/** Restituisce la domanda con l'id indicato. Lancia un errore se non esiste. */
export function domanda(id: DomandaId): Domanda {
  const d = _DOMANDE[id];
  if (!d) {
    throw new Error(`Domanda non trovata: "${id}"`);
  }
  return d;
}
