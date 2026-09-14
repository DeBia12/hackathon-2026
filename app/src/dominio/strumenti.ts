import type { ConcettoId, SchedaStrumento, TipoStrumento } from "./tipi";

// Dati statici a fini didattici. Nessun dato di mercato, nessun rendimento,
// nessuna classifica, nessuna raccomandazione.
// Gli strumenti reali sono usati come esempi illustrativi, non come consigli.

const _strumentiInterne: Record<TipoStrumento, SchedaStrumento> = {
  "titolo-stato": {
    id: "titolo-stato",
    nome: "BTP – Buono del Tesoro Poliennale",
    esempioReale: "BTP – Buono del Tesoro Poliennale con scadenza 2034",
    ruolo: "creditore",
    emittente: "Repubblica Italiana – Ministero dell'Economia e delle Finanze",
    caratteristiche: [
      {
        etichetta: "Emittente",
        valore: "Repubblica Italiana",
        spiegazione:
          "Il Ministero dell'Economia e delle Finanze emette i BTP per conto dello Stato italiano. " +
          "È lo Stato che si impegna a restituire il capitale e a pagare le cedole.",
      },
      {
        etichetta: "Cedola",
        valore: "Fissa, pagata ogni sei mesi",
        spiegazione:
          "La cedola è il pagamento periodico che ricevi per aver prestato denaro allo Stato. " +
          "È fissa: l'importo è stabilito al momento dell'emissione e non cambia nel tempo.",
      },
      {
        etichetta: "Scadenza",
        valore: "Data fissa, definita all'emissione",
        spiegazione:
          "La scadenza è il giorno in cui lo Stato ti restituisce il capitale nominale che " +
          "hai prestato. Fino ad allora continui a ricevere le cedole semestrali.",
      },
      {
        etichetta: "Capitale nominale",
        valore: "Pari all'importo investito",
        spiegazione:
          "Il capitale nominale è la somma che hai prestato allo Stato. " +
          "Ti viene restituita integralmente alla scadenza, se tieni il titolo fino ad allora.",
      },
    ],
    domandaChiave: {
      domanda: "Acquistando un BTP diventi proprietario dello Stato?",
      risposta:
        "No. Comprando un BTP presti denaro allo Stato: sei un creditore, non un proprietario. " +
        "Hai diritto a ricevere le cedole e il rimborso del capitale alla scadenza, " +
        "ma non acquisisci alcuna quota dello Stato.",
    },
    concetti: ["titolo-stato", "prestito"] satisfies ConcettoId[],
  },

  "obbligazione-societaria": {
    id: "obbligazione-societaria",
    nome: "Obbligazione societaria",
    esempioReale: "Obbligazione emessa da Enel S.p.A.",
    ruolo: "creditore",
    emittente: "Enel S.p.A.",
    caratteristiche: [
      {
        etichetta: "Emittente",
        valore: "Enel S.p.A.",
        spiegazione:
          "Enel è una grande azienda italiana che emette regolarmente obbligazioni " +
          "per raccogliere capitali. Chi acquista l'obbligazione presta denaro a Enel: " +
          "è suo creditore, non suo socio.",
      },
      {
        etichetta: "Cedola",
        valore: "Fissa o variabile, pagata periodicamente",
        spiegazione:
          "La cedola è il pagamento che ricevi per aver prestato denaro all'azienda. " +
          "Può essere fissa o variabile, secondo le condizioni definite al momento dell'emissione.",
      },
      {
        etichetta: "Scadenza",
        valore: "Data fissa, definita all'emissione",
        spiegazione:
          "Alla scadenza l'azienda si impegna a restituirti il capitale nominale. " +
          "Fino ad allora ricevi le cedole periodiche.",
      },
      {
        etichetta: "Rischio emittente",
        valore: "Dipende dalla solidità finanziaria dell'azienda",
        spiegazione:
          "A differenza dei titoli di Stato, l'azienda potrebbe incontrare difficoltà " +
          "a onorare i propri debiti. Il rimborso dipende dalla sua capacità finanziaria. " +
          "Questo non è un giudizio sull'azienda specifica: è una caratteristica strutturale " +
          "di tutti i prestiti a emittenti privati.",
      },
    ],
    domandaChiave: {
      domanda: "Comprando un'obbligazione Enel diventi socio di Enel?",
      risposta:
        "No. Sei un creditore di Enel, non un proprietario. " +
        "Non partecipi alle decisioni aziendali né agli utili come un azionista. " +
        "Hai diritto alle cedole e al rimborso del capitale alla scadenza.",
    },
    concetti: ["obbligazione-societaria", "prestito"] satisfies ConcettoId[],
  },

  azione: {
    id: "azione",
    nome: "Azione",
    esempioReale: "Azione ordinaria di Enel S.p.A., quotata alla Borsa Italiana",
    ruolo: "proprietario",
    emittente: "Enel S.p.A.",
    caratteristiche: [
      {
        etichetta: "Emittente",
        valore: "Enel S.p.A.",
        spiegazione:
          "Enel ha suddiviso il proprio capitale in azioni quotate in borsa. " +
          "Ogni azione rappresenta una quota di proprietà dell'azienda. " +
          "La stessa Enel che emette obbligazioni: ma il rapporto è opposto — " +
          "con l'obbligazione sei creditore, con l'azione sei proprietario.",
      },
      {
        etichetta: "Quota di proprietà",
        valore: "Percentuale del capitale sociale",
        spiegazione:
          "Chi acquista un'azione Enel diventa proprietario di una piccola parte di Enel. " +
          "Non è un prestatore: è un socio che partecipa alle sorti dell'azienda.",
      },
      {
        etichetta: "Cedola",
        valore: "Non esiste",
        assente: true,
        spiegazione:
          "L'azione non ha una cedola. Non c'è un pagamento periodico garantito. " +
          "L'azienda può decidere di distribuire parte degli utili ai soci (dividendo), " +
          "ma non è un obbligo: è una decisione dell'azienda stessa.",
      },
      {
        etichetta: "Scadenza",
        valore: "Non esiste",
        assente: true,
        spiegazione:
          "L'azione non ha scadenza. Non è previsto alcun rimborso del capitale. " +
          "Se vuoi uscire dall'investimento, devi vendere l'azione sul mercato " +
          "al prezzo che si forma in quel momento.",
      },
    ],
    domandaChiave: {
      domanda: "Comprando un'azione Enel diventi creditore di Enel?",
      risposta:
        "No, al contrario: diventi proprietario di una quota di Enel. " +
        "È l'opposto dell'obbligazione: lì sei creditore, qui sei socio. " +
        "Non hai diritto a un rimborso né a cedole garantite: " +
        "partecipi alle sorti dell'azienda come proprietario.",
    },
    concetti: ["azione", "proprieta"] satisfies ConcettoId[],
  },

  etf: {
    id: "etf",
    nome: "ETF – Exchange Traded Fund",
    esempioReale:
      "ETF che replica l'indice MSCI World — azioni di società a grande e media " +
      "capitalizzazione dei mercati sviluppati di tutto il mondo",
    ruolo: "quota di un paniere",
    emittente: "Una società di gestione del risparmio (asset manager)",
    caratteristiche: [
      {
        etichetta: "Indice replicato",
        valore: "MSCI World",
        spiegazione:
          "L'MSCI World è un indice che raccoglie azioni di centinaia di grandi e medie " +
          "società dei mercati sviluppati di tutto il mondo. Un ETF che lo replica contiene " +
          "tutte quelle azioni in proporzione. Con un solo acquisto partecipi a tutte.",
      },
      {
        etichetta: "Negoziazione",
        valore: "Quotato e scambiabile in borsa",
        spiegazione:
          "Puoi comprare e vendere un ETF in borsa come se fosse un'azione. " +
          "Non devi aspettare una scadenza o una finestra specifica di rimborso.",
      },
      {
        etichetta: "Diversificazione",
        valore: "Strutturalmente incorporata nel fondo",
        spiegazione:
          "Un ETF sull'MSCI World contiene azioni di centinaia di aziende diverse. " +
          "È l'applicazione diretta del principio di diversificazione che hai imparato " +
          "nel modulo 5: distribuire invece di concentrare tutto su un unico titolo.",
      },
      {
        etichetta: "Proventi e scadenza",
        valore: "Dipende dalla struttura del fondo",
        spiegazione:
          "Alcuni ETF distribuiscono periodicamente i proventi dei titoli che contengono. " +
          "Altri li reinvestono automaticamente all'interno del fondo. " +
          "Non ha una scadenza fissa: finché è quotato, puoi comprarlo e venderlo.",
      },
    ],
    domandaChiave: {
      domanda: "Comprando un ETF sull'MSCI World acquisti un singolo strumento?",
      risposta:
        "No. Acquisti una quota di un paniere che contiene azioni di centinaia di aziende. " +
        "Non è un singolo titolo: è un insieme strutturato che applica la diversificazione " +
        "che hai già studiato nel modulo 5.",
    },
    concetti: ["etf", "diversificazione"] satisfies ConcettoId[],
  },
};

export const STRUMENTI: Readonly<Record<TipoStrumento, SchedaStrumento>> = _strumentiInterne;

export const STRUMENTI_ELENCO: readonly SchedaStrumento[] = Object.values(_strumentiInterne);
