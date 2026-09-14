import type { Lezione, LezioneId, Modulo } from "./tipi";

// Record interno non esportato direttamente: evita che il tipo Record<string, ...>
// convinca il compilatore che qualsiasi chiave è valida.
const _lezioniInterne: Record<string, Lezione> = {
  l1a: {
    id: "l1a",
    titolo: "Cosa vuol dire risparmiare",
    concetti: ["risparmio"],
    vedi: {
      tipo: "analogia",
      testo:
        "Immagina una pizza: se la mangi tutta adesso, non ne avrai per dopo. " +
        "Risparmiare è la stessa cosa con i soldi — scegli di mettere da parte una " +
        "fetta invece di spenderla subito. Non è una rinuncia: è una decisione su " +
        "quando usare quello che hai.",
    },
    capisci: [
      "Risparmiare significa spendere meno di quello che guadagni. " +
        "La parte che avanza la tieni da parte, disponibile per il futuro.",
      "Il risparmio non è rinunciare a tutto. " +
        "È scegliere consapevolmente cosa vuoi adesso e cosa puoi aspettare.",
      "Avere dei risparmi ti dà una rete di sicurezza. " +
        "Se succede qualcosa di inaspettato, hai risorse a cui attingere senza dover chiedere aiuto.",
    ],
    verifica: "v-l1a",
  },

  l1b: {
    id: "l1b",
    titolo: "Cento euro non valgono sempre cento euro",
    concetti: ["potere-acquisto"],
    vedi: {
      tipo: "analogia",
      testo:
        "Immagina di avere una banconota da 100 euro nel cassetto. " +
        "Il numero stampato sopra non cambia mai: è sempre 100. " +
        "Ma al mercato, quegli stessi 100 euro non comprano sempre le stesse cose. " +
        "Il prezzo del pane, del latte, delle scarpe — tutto può cambiare nel tempo.",
    },
    capisci: [
      "Un biglietto da 100 euro ha sempre scritto «100 euro». " +
        "Ma con quella stessa cifra non puoi comprare le stesse cose ogni anno.",
      "Quello che riesci a comprare con una somma si chiama potere d'acquisto. " +
        "Il numero stampato sulla banconota è il valore nominale. Sono due cose diverse.",
      "Come mai succede questo? Lo scopri nel modulo successivo.",
    ],
    prova: {
      componente: "potere-acquisto",
      consegna:
        "Il tasso è già impostato. Sposta solo gli anni e osserva " +
        "come cambia quello che riesci a comprare con la stessa somma.",
    },
    verifica: "v-l1b",
  },

  l2a: {
    id: "l2a",
    titolo: "Perché i prezzi salgono",
    concetti: ["inflazione"],
    vedi: {
      tipo: "analogia",
      testo:
        "Pensa al prezzo del caffè al bar. Se sale solo quello, non è inflazione: " +
        "è quel bar. L'inflazione è quando i prezzi salgono quasi ovunque, " +
        "su tante cose diverse, mese dopo mese. " +
        "Lo Stato la misura guardando un insieme fisso di prodotti che le famiglie comprano di solito.",
    },
    capisci: [
      "L'inflazione è l'aumento generale e continuato dei prezzi nel tempo. " +
        "Non un singolo prezzo che sale: quasi tutti, su tante categorie diverse.",
      "Per misurarla, lo Stato osserva un paniere di beni — un insieme fisso di prodotti " +
        "che le famiglie comprano di solito. " +
        "Se quel paniere costa di più rispetto all'anno prima, l'inflazione è positiva.",
      "Il numero pubblicato è una media. Quello che paghi tu può essere diverso: " +
        "dipende da cosa compri. L'inflazione ufficiale e quella che senti in tasca " +
        "non coincidono sempre.",
    ],
    prova: {
      componente: "potere-acquisto",
      consegna:
        "Gli anni sono già impostati. Scegli il tasso più basso e poi quello più alto: " +
        "osserva quanto cambia il risultato sullo stesso orizzonte di tempo.",
    },
    verifica: "v-l2a",
  },

  l3a: {
    id: "l3a",
    titolo: "Due usi diversi dello stesso denaro",
    concetti: ["risparmio", "rischio"],
    vedi: {
      tipo: "analogia",
      testo:
        "Hai 1.000 euro. Puoi tenerli in un posto sicuro, pronti per qualsiasi necessità. " +
        "Oppure puoi usarli per qualcosa che potrebbe crescere nel tempo, ma che porta con sé " +
        "dell'incertezza. Non c'è una risposta giusta in assoluto: sono due scelte diverse, " +
        "con obiettivi diversi.",
    },
    capisci: [
      "Risparmiare e investire sono due modi diversi di usare il denaro che non spendi. " +
        "Nessuno dei due è sbagliato in assoluto: dipende da cosa cerchi.",
      "Il risparmio punta alla sicurezza e alla disponibilità immediata. " +
        "L'investimento accetta un certo grado di incertezza in cambio della possibilità " +
        "di far crescere il denaro nel tempo.",
      "La differenza chiave è il rischio: chi investe accetta che il risultato futuro " +
        "non sia garantito in anticipo. Capire questa differenza è il primo passo.",
    ],
    verifica: "v-l3a",
  },

  l4a: {
    id: "l4a",
    titolo: "Cosa vuol dire rischio",
    concetti: ["rischio"],
    vedi: {
      tipo: "analogia",
      testo:
        "Pensi che domani piova? Anche se il meteo dice «alta probabilità di pioggia», " +
        "non puoi saperlo con certezza. Potresti bagnarti, oppure no. " +
        "Il rischio finanziario funziona così: non è la certezza di perdere, " +
        "è l'incertezza sul risultato.",
    },
    capisci: [
      "In finanza, il rischio è l'incertezza sul risultato futuro. " +
        "Non sai in anticipo quanto riceverai, né se riceverai qualcosa.",
      "Rischio non significa necessariamente perdita. " +
        "Significa che il risultato può essere diverso da quello che ti aspetti, " +
        "in meglio o in peggio.",
      "Strumenti diversi comportano livelli di incertezza diversi. " +
        "Capire il rischio di uno strumento è il primo passo per capire davvero cosa stai facendo.",
    ],
    verifica: "v-l4a",
  },

  l4b: {
    id: "l4b",
    titolo: "Rendimento: non si parla mai da solo",
    concetti: ["rendimento"],
    vedi: {
      tipo: "analogia",
      testo:
        "Se qualcuno ti chiede di fare un lavoro rischioso, vuoi essere pagato di più " +
        "rispetto a un lavoro sicuro. In finanza vale lo stesso principio: " +
        "a un rischio maggiore corrisponde la possibilità di un rendimento maggiore. " +
        "Non è una promessa: è una logica.",
    },
    capisci: [
      "Il rendimento è quello che ottieni da un investimento, di solito espresso come " +
        "percentuale. Ma parlare di rendimento senza menzionare il rischio non ha senso.",
      "In finanza vale un principio fondamentale: a rischi più elevati corrispondono " +
        "possibilità di rendimento più alte. Non garanzie: possibilità.",
      "Non esiste rendimento elevato garantito senza rischio. " +
        "Chi ti promette guadagni certi e alti allo stesso tempo sta omettendo qualcosa di importante.",
    ],
    verifica: "v-l4b",
  },

  l5a: {
    id: "l5a",
    titolo: "Tutto su una carta, o su dieci",
    concetti: ["diversificazione"],
    vedi: {
      tipo: "analogia",
      testo:
        "Immagina di portare le uova dal pollaio a casa in un unico cestino. " +
        "Se inciampi, le rompi tutte. Se le dividi in tre cestini diversi e inciampi, " +
        "rompi solo quelle in un cestino. " +
        "Con i soldi funziona allo stesso modo: distribuirli non elimina il rischio, " +
        "ma cambia quanto ti costa un singolo evento negativo.",
    },
    capisci: [
      "Se metti tutto il tuo denaro in un solo strumento, le sue sorti dipendono " +
        "completamente da quella sola scelta. Se va male quella, va male tutto.",
      "Distribuire il denaro su più strumenti diversi si chiama diversificazione. " +
        "Se uno va male, gli altri non sono necessariamente colpiti nella stessa misura.",
      "La diversificazione non elimina il rischio: lo distribuisce. " +
        "È un principio strutturale, non una formula magica che garantisce risultati.",
    ],
    prova: {
      componente: "diversificazione",
      consegna:
        "Applica un evento negativo a un'azienda e osserva la differenza tra " +
        "concentrare tutto su quella o distribuire su molte.",
    },
    verifica: "v-l5a",
  },

  // l6a è la lezione più importante: introduce la distinzione proprietario/creditore,
  // che è il perno dell'intero modulo 6 e del meccanismo adattivo.
  l6a: {
    id: "l6a",
    titolo: "Proprietario o creditore?",
    concetti: ["proprieta", "prestito"],
    vedi: {
      tipo: "analogia",
      testo:
        "Se presti la bici a un amico, sei ancora tu il proprietario: lui te la restituisce. " +
        "Se invece regali all'amico metà della bici, diventi comproprietario: " +
        "le decisioni su di essa vi riguardano entrambi. " +
        "Con il denaro succede qualcosa di simile: puoi prestarlo oppure comprare una quota di qualcosa. " +
        "Sono due ruoli con diritti e conseguenze completamente diversi.",
    },
    capisci: [
      "Quando metti denaro in qualcosa, puoi farlo in due modi fondamentalmente diversi: " +
        "puoi diventare proprietario di una parte di qualcosa, oppure puoi fare un prestito. " +
        "Sono due ruoli con diritti e rischi completamente diversi.",
      "Il creditore presta denaro e ha diritto a riceverlo indietro, con gli interessi " +
        "pattuiti, entro una scadenza definita. " +
        "Il proprietario acquista una quota: partecipa ai risultati, buoni o cattivi, " +
        "senza una scadenza e senza un rimborso garantito.",
      "Questa distinzione è la chiave per capire qualsiasi strumento finanziario. " +
        "Un titolo di Stato e un'obbligazione ti rendono creditore. " +
        "Un'azione ti rende proprietario. " +
        "Capirlo cambia tutto il modo in cui leggi uno strumento.",
    ],
    prova: {
      componente: "proprieta-o-prestito",
      consegna:
        "Scegli uno strumento e scopri se ti rende proprietario o creditore, " +
        "e cosa cambia in pratica tra i due ruoli.",
    },
    verifica: "v-l6a",
  },

  l6b: {
    id: "l6b",
    titolo: "Il titolo di Stato",
    concetti: ["titolo-stato"],
    vedi: {
      tipo: "analogia",
      testo:
        "Pensa a una ricevuta scritta che dice tre cose: chi ti deve i soldi, " +
        "quanto ricevi ogni anno nel frattempo, e quando ti viene restituito tutto. " +
        "Chi firma quella ricevuta è il debitore, tu sei il creditore. " +
        "Un titolo di Stato funziona esattamente così: tra poco ritrovi " +
        "quelle stesse tre informazioni.",
    },
    capisci: [
      "Un titolo di Stato è un prestito che fai allo Stato. " +
        "Lo Stato emette il titolo per raccogliere denaro e si impegna a restituirti " +
        "il capitale alla scadenza, pagando nel frattempo una cedola periodica.",
      "Comprando un BTP non diventi proprietario di niente dello Stato. " +
        "Sei un creditore: hai un contratto che definisce quanto riceverai e quando.",
      "Le parti fondamentali di un titolo di Stato sono: l'emittente (chi ha emesso il " +
        "titolo), la cedola (il pagamento periodico che ricevi), la scadenza (quando ti " +
        "viene restituito il capitale) e il capitale nominale (la somma che hai prestato).",
    ],
    prova: {
      componente: "anatomia-strumento",
      consegna:
        "Esplora le parti di un BTP: scopri chi lo emette, cosa ricevi nel tempo " +
        "e quando termina il prestito.",
    },
    verifica: "v-l6b",
  },

  l6c: {
    id: "l6c",
    titolo: "L'obbligazione societaria",
    concetti: ["obbligazione-societaria"],
    vedi: {
      tipo: "analogia",
      testo:
        "Quella ricevuta che hai visto nel titolo di Stato può firmarla anche un'azienda privata. " +
        "Stai prestando denaro all'azienda, non allo Stato. " +
        "Le tre informazioni della ricevuta restano le stesse: chi deve, quanto paga ogni anno, " +
        "e quando restituisce. Cambia solo chi ha firmato.",
    },
    capisci: [
      "Un'obbligazione societaria funziona come un titolo di Stato, " +
        "ma l'emittente non è lo Stato: è un'azienda privata. " +
        "Stai prestando denaro all'azienda, non diventando suo socio.",
      "Anche qui hai una cedola periodica e una scadenza. " +
        "Alla scadenza l'azienda si impegna a restituirti il capitale nominale. " +
        "Sei un creditore dell'azienda.",
      "Il rischio dipende dalla solidità dell'emittente. " +
        "Se l'azienda incontra difficoltà, potrebbe avere problemi a onorare il debito. " +
        "Questo non è un giudizio: è come funziona lo strumento.",
    ],
    prova: {
      componente: "anatomia-strumento",
      consegna:
        "Esplora le parti di un'obbligazione societaria: chi la emette, " +
        "cosa ricevi e quando ti restituisce il capitale.",
    },
    verifica: "v-l6c",
  },

  l6d: {
    id: "l6d",
    titolo: "L'azione",
    concetti: ["azione"],
    vedi: {
      tipo: "analogia",
      testo:
        "Quella ricevuta del prestito garantisce un rimborso e una data. " +
        "Un'azione è l'opposto: non è una ricevuta, è un documento di comproprietà. " +
        "Compri una piccola quota dell'azienda. " +
        "Non c'è una data di restituzione, non c'è un importo garantito: " +
        "sei dentro all'azienda come socio, non fuori come prestatore.",
    },
    capisci: [
      "Un'azione rappresenta una quota di proprietà di un'azienda. " +
        "Comprandola, diventi socio: partecipi alla sua storia, ai suoi successi " +
        "e alle sue difficoltà.",
      "A differenza delle obbligazioni, l'azione non ha scadenza e non ha una " +
        "cedola garantita. Il valore può variare e non hai diritto a ricevere nulla " +
        "di prefissato. L'azienda può decidere di distribuire parte degli utili, " +
        "ma non è un obbligo.",
      "Essere azionista significa avere diritti di proprietà, non di credito. " +
        "Sei dentro all'azienda come socio, non fuori come prestatore.",
    ],
    prova: {
      componente: "anatomia-strumento",
      consegna:
        "Scopri cosa rappresenta un'azione e in cosa è fondamentalmente diversa " +
        "dalle obbligazioni che hai appena studiato.",
    },
    verifica: "v-l6d",
  },

  l6e: {
    id: "l6e",
    titolo: "L'ETF",
    concetti: ["etf"],
    vedi: {
      tipo: "analogia",
      testo:
        "Immagina un sacchetto al supermercato già pronto: dentro c'è un po' di pane, " +
        "un po' di pasta e un po' di formaggio. Non scegli i singoli prodotti, prendi il sacchetto. " +
        "Un ETF funziona così: è un paniere già costruito che contiene molti strumenti diversi. " +
        "Con un solo acquisto partecipi a tutti quelli che ci sono dentro.",
    },
    capisci: [
      "Un ETF (Exchange Traded Fund) è un fondo che puoi comprare e vendere in borsa " +
        "come se fosse un'azione. Al suo interno contiene un insieme di strumenti " +
        "finanziari: azioni, obbligazioni, o entrambi.",
      "Comprando una quota di ETF, partecipi a tutti gli strumenti che contiene " +
        "in un solo acquisto. Ritrovi qui il principio di diversificazione che hai " +
        "imparato nel modulo 5: distribuire invece di concentrare.",
      "L'ETF non garantisce risultati. Il suo valore può variare nel tempo. " +
        "La sua caratteristica principale è strutturale: è un paniere di strumenti, " +
        "non un singolo titolo.",
    ],
    prova: {
      componente: "anatomia-strumento",
      consegna:
        "Guarda cosa c'è dentro un ETF e come si collega alla diversificazione " +
        "che hai già studiato.",
    },
    verifica: "v-l6e",
  },
};

export const LEZIONI: Readonly<Record<LezioneId, Lezione>> = _lezioniInterne;

export const MODULI: readonly Modulo[] = [
  {
    id: "m1",
    numero: 1,
    titolo: "Il denaro e il suo valore",
    sottotitolo:
      "Capire cosa significa tenere i soldi da parte e perché il loro valore cambia nel tempo",
    lezioni: ["l1a", "l1b"],
  },
  {
    id: "m2",
    numero: 2,
    titolo: "L'inflazione",
    sottotitolo: "Perché i prezzi crescono e cosa fa l'inflazione al tuo denaro",
    lezioni: ["l2a"],
  },
  {
    id: "m3",
    numero: 3,
    titolo: "Risparmiare o investire",
    sottotitolo: "Due usi diversi dello stesso denaro, con orizzonti e incertezze diverse",
    lezioni: ["l3a"],
  },
  {
    id: "m4",
    numero: 4,
    titolo: "Rischio e rendimento",
    sottotitolo: "Capire l'incertezza e il legame inscindibile tra rischio e rendimento",
    lezioni: ["l4a", "l4b"],
  },
  {
    id: "m5",
    numero: 5,
    titolo: "La diversificazione",
    // "è meglio" sarebbe una raccomandazione, che la consegna vieta: qui si
    // descrive l'effetto di distribuire, non si dice che convenga farlo.
    sottotitolo: "Come cambia il peso di un singolo evento se distribuisci invece di concentrare",
    lezioni: ["l5a"],
  },
  {
    id: "m6",
    numero: 6,
    titolo: "Gli strumenti finanziari",
    sottotitolo: "BTP, obbligazioni, azioni ed ETF: capire cosa rappresentano davvero",
    lezioni: ["l6a", "l6b", "l6c", "l6d", "l6e"],
  },
];

/** Restituisce la lezione con quell'id. Lancia un errore se non esiste. */
export function lezione(id: LezioneId): Lezione {
  const l = LEZIONI[id];
  if (!l) throw new Error(`Lezione non trovata: ${id}`);
  return l;
}

/** Restituisce il modulo che contiene la lezione. Lancia un errore se non trovato. */
export function moduloDiLezione(id: LezioneId): Modulo {
  const m = MODULI.find((mod) => mod.lezioni.includes(id));
  if (!m) throw new Error(`Nessun modulo contiene la lezione: ${id}`);
  return m;
}
