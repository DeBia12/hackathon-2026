import type { Area, AreaId, Concetto, ConcettoId } from "./tipi";

export const AREE: readonly Area[] = [
  { id: "basi",              nome: "Le basi del denaro" },
  { id: "inflazione",        nome: "Inflazione" },
  { id: "rischio-rendimento", nome: "Rischio e rendimento" },
  { id: "diversificazione",  nome: "Diversificazione" },
  { id: "strumenti",         nome: "Strumenti finanziari" },
] as const;

export const CONCETTI: Readonly<Record<ConcettoId, Concetto>> = {
  "risparmio": {
    id: "risparmio",
    nome: "Risparmio",
    area: "basi",
    inUnaRiga: "Il risparmio è la parte del reddito che non viene spesa: è il punto di partenza di ogni scelta finanziaria.",
    prerequisiti: [],
    lezione: "l1a",
  },
  "investimento": {
    id: "investimento",
    nome: "Investimento",
    area: "basi",
    inUnaRiga: "Investire significa impiegare il denaro che non spendi accettando un risultato incerto, in cambio della possibilità che cresca nel tempo.",
    prerequisiti: ["risparmio"],
    lezione: "l3a",
  },
  "potere-acquisto": {
    id: "potere-acquisto",
    nome: "Potere d'acquisto",
    area: "basi",
    inUnaRiga: "Il potere d'acquisto misura quante cose puoi comprare con i tuoi soldi: se i prezzi salgono, il tuo potere d'acquisto scende.",
    prerequisiti: ["risparmio"],
    lezione: "l1b",
  },
  "inflazione": {
    id: "inflazione",
    nome: "Inflazione",
    area: "inflazione",
    inUnaRiga: "L'inflazione è l'aumento generalizzato dei prezzi nel tempo: erode il potere d'acquisto dei tuoi risparmi.",
    prerequisiti: ["potere-acquisto"],
    lezione: "l2a",
  },
  "rischio": {
    id: "rischio",
    nome: "Rischio",
    area: "rischio-rendimento",
    inUnaRiga: "Il rischio è l'incertezza sul risultato futuro: il valore può rivelarsi diverso da quello atteso, in meglio o in peggio.",
    prerequisiti: ["risparmio"],
    lezione: "l4a",
  },
  "rendimento": {
    id: "rendimento",
    nome: "Rendimento",
    area: "rischio-rendimento",
    inUnaRiga: "Il rendimento è il guadagno prodotto da un investimento nel tempo: di solito, maggiore il rischio, maggiore il rendimento potenziale.",
    prerequisiti: ["rischio"],
    lezione: "l4b",
  },
  "diversificazione": {
    id: "diversificazione",
    nome: "Diversificazione",
    area: "diversificazione",
    inUnaRiga: "Diversificare significa distribuire i risparmi su più strumenti diversi: così un singolo evento pesa su una parte dell'insieme, non su tutto. Non elimina il rischio: lo distribuisce.",
    prerequisiti: ["rischio"],
    lezione: "l5a",
  },
  "prestito": {
    id: "prestito",
    nome: "Prestito",
    area: "strumenti",
    inUnaRiga: "Chi presta denaro è un creditore: gli deve essere restituito, ma non possiede nulla di chi lo ha ricevuto.",
    prerequisiti: ["rischio"],
    lezione: "l6a",
  },
  "proprieta": {
    id: "proprieta",
    nome: "Proprietà",
    area: "strumenti",
    inUnaRiga: "Essere proprietario significa avere una quota di un'azienda: si partecipa ai guadagni ma anche alle perdite.",
    prerequisiti: ["rischio"],
    lezione: "l6a",
  },
  "titolo-stato": {
    id: "titolo-stato",
    nome: "Titolo di Stato",
    area: "strumenti",
    inUnaRiga: "Un titolo di Stato è un prestito allo Stato: lo Stato restituisce il capitale e paga interessi periodici.",
    prerequisiti: ["prestito"],
    lezione: "l6b",
  },
  "obbligazione-societaria": {
    id: "obbligazione-societaria",
    nome: "Obbligazione societaria",
    area: "strumenti",
    inUnaRiga: "Un'obbligazione societaria è un prestito a un'azienda: l'azienda rimborsa il debito con interessi, ma il rischio è maggiore che per i titoli di Stato.",
    prerequisiti: ["prestito", "rischio"],
    lezione: "l6c",
  },
  "azione": {
    id: "azione",
    nome: "Azione",
    area: "strumenti",
    inUnaRiga: "Un'azione è una quota di proprietà di un'azienda: il suo valore dipende dall'andamento dell'azienda, senza garanzie.",
    prerequisiti: ["proprieta"],
    lezione: "l6d",
  },
  "etf": {
    id: "etf",
    nome: "ETF",
    area: "strumenti",
    inUnaRiga: "Un ETF è un paniere di strumenti finanziari che si compra come un'azione: permette di diversificare con un unico acquisto.",
    prerequisiti: ["diversificazione", "azione"],
    lezione: "l6e",
  },
};

export const CONCETTI_ELENCO: readonly Concetto[] = Object.values(CONCETTI);

export function concettiDellArea(area: AreaId): readonly Concetto[] {
  return CONCETTI_ELENCO.filter((c) => c.area === area);
}
