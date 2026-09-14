import { describe, it, expect } from "vitest";
import type {
  Concetto,
  ConcettoId,
  Modulo,
  ModuloId,
  Padronanza,
  Schermata,
  StatoApprendimento,
} from "../tipi";
import {
  statoModuli,
  avanzamento,
  moduloCompletato,
  moduloDaRiprendere,
} from "../percorso";

// ─── Fixture ────────────────────────────────────────────────────────────────

const moduliTest: readonly Modulo[] = [
  { id: "m1", numero: 1, titolo: "Modulo 1", sottotitolo: "Basi", lezioni: ["l1a", "l1b"] },
  { id: "m2", numero: 2, titolo: "Modulo 2", sottotitolo: "Inflazione", lezioni: ["l2a"] },
  { id: "m3", numero: 3, titolo: "Modulo 3", sottotitolo: "Rischio", lezioni: ["l4a"] },
];

/**
 * Catalogo minimale: 12 concetti con area assegnata.
 * Serve per avanzamento() che conta dai concetti del catalogo.
 */
const catalogoFisso = {
  "risparmio":             { id: "risparmio",             area: "basi",                prerequisiti: [], lezione: "l1a", nome: "Risparmio",             inUnaRiga: "..." },
  "potere-acquisto":       { id: "potere-acquisto",       area: "basi",                prerequisiti: [], lezione: "l1b", nome: "Potere d'acquisto",      inUnaRiga: "..." },
  "inflazione":            { id: "inflazione",            area: "inflazione",          prerequisiti: [], lezione: "l2a", nome: "Inflazione",             inUnaRiga: "..." },
  "rischio":               { id: "rischio",               area: "rischio-rendimento",  prerequisiti: [], lezione: "l4a", nome: "Rischio",                inUnaRiga: "..." },
  "rendimento":            { id: "rendimento",            area: "rischio-rendimento",  prerequisiti: [], lezione: "l4b", nome: "Rendimento",             inUnaRiga: "..." },
  "diversificazione":      { id: "diversificazione",      area: "diversificazione",    prerequisiti: [], lezione: "l5a", nome: "Diversificazione",       inUnaRiga: "..." },
  "proprieta":             { id: "proprieta",             area: "strumenti",           prerequisiti: [], lezione: "l6a", nome: "Proprietà",              inUnaRiga: "..." },
  "prestito":              { id: "prestito",              area: "strumenti",           prerequisiti: [], lezione: "l6a", nome: "Prestito",               inUnaRiga: "..." },
  "titolo-stato":          { id: "titolo-stato",          area: "strumenti",           prerequisiti: [], lezione: "l6b", nome: "Titolo di Stato",        inUnaRiga: "..." },
  "obbligazione-societaria": { id: "obbligazione-societaria", area: "strumenti",       prerequisiti: [], lezione: "l6c", nome: "Obbligazione societaria", inUnaRiga: "..." },
  "azione":                { id: "azione",                area: "strumenti",           prerequisiti: [], lezione: "l6d", nome: "Azione",                 inUnaRiga: "..." },
  "etf":                   { id: "etf",                   area: "strumenti",           prerequisiti: [], lezione: "l6e", nome: "ETF",                    inUnaRiga: "..." },
} as unknown as Readonly<Record<ConcettoId, Concetto>>;

const schermataDefault: Schermata = { nome: "mappa" };

function statoVuoto(): StatoApprendimento {
  return {
    versione: 1,
    schermata: schermataDefault,
    risposteIniziali: [],
    risposteFinali: [],
    rispostePercorso: [],
    padronanza: {},
    lezioniViste: [],
    moduliCompletati: [],
    xp: 0,
    iniziatoIl: new Date().toISOString(),
  };
}

function padronanzaAcquisita(n: number): Partial<Record<ConcettoId, Padronanza>> {
  const concetti: ConcettoId[] = [
    "risparmio", "potere-acquisto", "inflazione", "rischio", "rendimento",
    "diversificazione", "proprieta", "prestito", "titolo-stato",
    "obbligazione-societaria", "azione", "etf",
  ];
  const result: Partial<Record<ConcettoId, Padronanza>> = {};
  // slice evita l'indicizzazione diretta: noUncheckedIndexedAccess renderebbe
  // concetti[i] di tipo ConcettoId | undefined, vietato come chiave di record.
  concetti.slice(0, n).forEach((concetto) => {
    result[concetto] = { stato: "acquisito", tentativi: 1, corrette: 1, attendeRiverifica: false };
  });
  return result;
}

// ─── moduloCompletato ────────────────────────────────────────────────────────

// Riferimento diretto ai moduli per evitare l'indicizzazione con noUncheckedIndexedAccess
const moduloUno: Modulo = { id: "m1", numero: 1, titolo: "Modulo 1", sottotitolo: "Basi", lezioni: ["l1a", "l1b"] };

describe("moduloCompletato", () => {
  it("modulo non in moduliCompletati → false", () => {
    const stato = statoVuoto();
    expect(moduloCompletato(moduloUno, stato)).toBe(false);
  });

  it("modulo in moduliCompletati → true", () => {
    const stato = { ...statoVuoto(), moduliCompletati: ["m1"] as ModuloId[] };
    expect(moduloCompletato(moduloUno, stato)).toBe(true);
  });
});

// ─── statoModuli ─────────────────────────────────────────────────────────────

describe("statoModuli", () => {
  it("a stato vuoto il primo modulo è disponibile, gli altri bloccati", () => {
    const stati = statoModuli(moduliTest, statoVuoto());
    expect(stati["m1"]).toBe("disponibile");
    expect(stati["m2"]).toBe("bloccato");
    expect(stati["m3"]).toBe("bloccato");
  });

  it("completato m1 → m2 disponibile, m3 bloccato", () => {
    const stato = { ...statoVuoto(), moduliCompletati: ["m1"] as ModuloId[] };
    const stati = statoModuli(moduliTest, stato);
    expect(stati["m1"]).toBe("completato");
    expect(stati["m2"]).toBe("disponibile");
    expect(stati["m3"]).toBe("bloccato");
  });

  it("completati m1 e m2 → entrambi completati, m3 disponibile", () => {
    const stato = { ...statoVuoto(), moduliCompletati: ["m1", "m2"] as ModuloId[] };
    const stati = statoModuli(moduliTest, stato);
    expect(stati["m1"]).toBe("completato");
    expect(stati["m2"]).toBe("completato");
    expect(stati["m3"]).toBe("disponibile");
  });

  it("almeno una lezione vista nel secondo modulo (m2) ma m1 non completato → m2 bloccato", () => {
    const stato = {
      ...statoVuoto(),
      lezioniViste: ["l2a"],
    };
    const stati = statoModuli(moduliTest, stato);
    expect(stati["m2"]).toBe("bloccato");
  });

  it("almeno una lezione vista nel primo modulo → in-corso", () => {
    const stato = { ...statoVuoto(), lezioniViste: ["l1a"] };
    const stati = statoModuli(moduliTest, stato);
    expect(stati["m1"]).toBe("in-corso");
  });
});

// ─── avanzamento ─────────────────────────────────────────────────────────────

describe("avanzamento", () => {
  it("conta solo i concetti acquisito, non le lezioni viste", () => {
    const stato = {
      ...statoVuoto(),
      lezioniViste: ["l1a", "l1b", "l2a", "l4a", "l5a"],
      padronanza: {},
    };
    const av = avanzamento(stato, catalogoFisso);
    expect(av.concettiAcquisiti).toBe(0);
  });

  it("concettiAcquisiti riflette la padronanza effettiva", () => {
    const stato = {
      ...statoVuoto(),
      padronanza: padronanzaAcquisita(3),
    };
    const av = avanzamento(stato, catalogoFisso);
    expect(av.concettiAcquisiti).toBe(3);
  });

  it("confine livello: 2 acquisiti → Principiante", () => {
    const stato = { ...statoVuoto(), padronanza: padronanzaAcquisita(2) };
    expect(avanzamento(stato, catalogoFisso).livello).toBe("Principiante");
  });

  it("confine livello: 3 acquisiti → Esploratore", () => {
    const stato = { ...statoVuoto(), padronanza: padronanzaAcquisita(3) };
    expect(avanzamento(stato, catalogoFisso).livello).toBe("Esploratore");
  });

  it("confine livello: 10 acquisiti → Navigatore", () => {
    const stato = { ...statoVuoto(), padronanza: padronanzaAcquisita(10) };
    expect(avanzamento(stato, catalogoFisso).livello).toBe("Navigatore");
  });

  it("confine livello: 11 acquisiti → Consapevole", () => {
    const stato = { ...statoVuoto(), padronanza: padronanzaAcquisita(11) };
    expect(avanzamento(stato, catalogoFisso).livello).toBe("Consapevole");
  });

  it("Consapevole non ha prossimoLivello e concettiAlProssimoLivello=0", () => {
    const stato = { ...statoVuoto(), padronanza: padronanzaAcquisita(12) };
    const av = avanzamento(stato, catalogoFisso);
    expect(av.livello).toBe("Consapevole");
    expect(av.prossimoLivello).toBeUndefined();
    expect(av.concettiAlProssimoLivello).toBe(0);
  });

  it("Principiante indica il prossimoLivello Esploratore e i concetti mancanti", () => {
    const stato = { ...statoVuoto(), padronanza: padronanzaAcquisita(1) };
    const av = avanzamento(stato, catalogoFisso);
    expect(av.livello).toBe("Principiante");
    expect(av.prossimoLivello).toBe("Esploratore");
    expect(av.concettiAlProssimoLivello).toBe(2); // ne mancano 2 per arrivare a 3
  });

  it("percentuale è calcolata su 12 concetti totali", () => {
    const stato = { ...statoVuoto(), padronanza: padronanzaAcquisita(6) };
    const av = avanzamento(stato, catalogoFisso);
    expect(av.percentuale).toBe(50); // 6/12 = 50%
    expect(av.concettiTotali).toBe(12);
  });
});

// ─── moduloDaRiprendere ───────────────────────────────────────────────────────

describe("moduloDaRiprendere", () => {
  it("con stato vuoto restituisce il primo modulo (disponibile)", () => {
    const modulo = moduloDaRiprendere(moduliTest, statoVuoto());
    expect(modulo?.id).toBe("m1");
  });

  it("con m1 in-corso restituisce m1", () => {
    const stato = { ...statoVuoto(), lezioniViste: ["l1a"] };
    const modulo = moduloDaRiprendere(moduliTest, stato);
    expect(modulo?.id).toBe("m1");
  });

  it("con m1 completato restituisce m2 (prossimo disponibile)", () => {
    const stato = { ...statoVuoto(), moduliCompletati: ["m1"] as ModuloId[] };
    const modulo = moduloDaRiprendere(moduliTest, stato);
    expect(modulo?.id).toBe("m2");
  });

  it("tutti completati → undefined", () => {
    const stato = { ...statoVuoto(), moduliCompletati: ["m1", "m2", "m3"] as ModuloId[] };
    const modulo = moduloDaRiprendere(moduliTest, stato);
    expect(modulo).toBeUndefined();
  });
});
