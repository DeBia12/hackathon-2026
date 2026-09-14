export type ConcettoId =
  | "risparmio" | "potere-acquisto" | "inflazione"
  | "rischio" | "rendimento" | "diversificazione"
  | "proprieta" | "prestito"
  | "titolo-stato" | "obbligazione-societaria" | "azione" | "etf";

export type AreaId =
  | "basi" | "inflazione" | "rischio-rendimento" | "diversificazione" | "strumenti";

export type ModuloId = "m1" | "m2" | "m3" | "m4" | "m5" | "m6";
export type LezioneId = string;
export type DomandaId = string;

/** Le visualizzazioni educative. Il registro sta in componenti/interattivi/registro.ts */
export type InterattivoId =
  | "potere-acquisto" | "diversificazione" | "proprieta-o-prestito" | "anatomia-strumento";

export interface Area {
  id: AreaId;
  nome: string;          // mostrato all'utente: "Rischio e rendimento"
}

export interface Concetto {
  id: ConcettoId;
  nome: string;
  area: AreaId;
  /** Cosa deve saper dire l'utente perché il concetto sia acquisito. Una riga. */
  inUnaRiga: string;
  /** Grafo dei prerequisiti. È questo che rende adattivo il motore. */
  prerequisiti: ConcettoId[];
  /** La micro-lezione che lo spiega. La remediation manda qui. */
  lezione: LezioneId;
}

export type StatoPadronanza = "ignoto" | "in-corso" | "acquisito";

export interface Padronanza {
  stato: StatoPadronanza;
  tentativi: number;
  corrette: number;
  /** true se il concetto è stato sbagliato e attende ancora la riverifica. */
  attendeRiverifica: boolean;
}

export type MomentoDomanda = "iniziale" | "finale" | "verifica" | "riverifica";

export interface Opzione {
  id: string;
  testo: string;
  /**
   * Se questa opzione viene scelta, rivela una lacuna su questo concetto.
   * Assente sull'opzione corretta. È il perno del motore adattivo.
   */
  lacuna?: ConcettoId;
  /**
   * Credito parziale: 0.5 per una risposta imprecisa ma non sbagliata.
   * Assente significa 1 sull'opzione corretta e 0 sulle altre.
   * Un'opzione con `credito: 0.5` può avere comunque una `lacuna`.
   */
  credito?: 0.5;
  /** Mostrato DOPO la risposta. Spiega il perché, non giudica la persona. */
  spiegazione: string;
}

export interface Domanda {
  id: DomandaId;
  momento: MomentoDomanda;
  concetto: ConcettoId;
  testo: string;
  opzioni: Opzione[];
  /** id dell'opzione corretta. */
  corretta: string;
  /**
   * Domanda che misura la stessa cosa con parole diverse.
   * Collega iniziale a finale, e verifica a riverifica.
   */
  gemella?: DomandaId;
}

export type Vedi =
  | { tipo: "interattivo"; componente: InterattivoId }
  | { tipo: "analogia"; testo: string };

export interface Lezione {
  id: LezioneId;
  titolo: string;
  concetti: ConcettoId[];
  /** VEDI - analogia o visualizzazione */
  vedi: Vedi;
  /** CAPISCI - massimo 3 paragrafi brevi. Frasi corte. */
  capisci: string[];
  /** PROVA - interazione facoltativa */
  prova?: { componente: InterattivoId; consegna: string };
  /** DIMOSTRA - la domanda di verifica */
  verifica: DomandaId;
}

export interface Modulo {
  id: ModuloId;
  numero: number;
  titolo: string;
  sottotitolo: string;
  lezioni: LezioneId[];
}

export type TipoStrumento = "titolo-stato" | "obbligazione-societaria" | "azione" | "etf";

export interface SchedaStrumento {
  id: TipoStrumento;
  nome: string;              // "BTP - Buono del Tesoro Poliennale"
  esempioReale: string;      // "BTP 3,85% scadenza 01/07/2034"
  /** La distinzione che il prodotto insegna. */
  ruolo: "proprietario" | "creditore" | "quota di un paniere";
  emittente: string;
  /** Coppie etichetta/valore: scadenza, cedola, capitale. Dati STATICI. */
  caratteristiche: Array<{ etichetta: string; valore: string; spiegazione: string }>;
  /** "Comprando questo diventi proprietario?" con risposta netta. */
  domandaChiave: { domanda: string; risposta: string };
  concetti: ConcettoId[];
}

// ---- Stato dell'applicazione ----

export type Schermata =
  | { nome: "benvenuto" }
  | { nome: "valutazione"; momento: "iniziale" | "finale" }
  | { nome: "mappa" }
  | { nome: "modulo"; modulo: ModuloId }
  | { nome: "risultato" }
  | { nome: "trasparenza" };

export interface RispostaData {
  domandaId: DomandaId;
  concetto: ConcettoId;
  opzioneId: string;
  corretta: boolean;
  /** 1 se corretta, 0.5 se parziale, 0 se errata. Lo calcola il motore adattivo. */
  credito: number;
  momento: MomentoDomanda;
}

export interface StatoApprendimento {
  versione: 1;
  schermata: Schermata;
  risposteIniziali: RispostaData[];
  risposteFinali: RispostaData[];
  /** Solo verifiche e riverifiche del percorso. */
  rispostePercorso: RispostaData[];
  padronanza: Partial<Record<ConcettoId, Padronanza>>;
  lezioniViste: LezioneId[];
  moduliCompletati: ModuloId[];
  xp: number;
  iniziatoIl: string;   // ISO
}
