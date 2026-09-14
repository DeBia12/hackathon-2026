import { describe, it, expect } from "vitest";
import type { Concetto, ConcettoId, RispostaData } from "../tipi";
import { calcolaProfilo, confronta } from "../punteggio";

// ─── Fixture ────────────────────────────────────────────────────────────────

/**
 * Catalogo ridotto: 5 concetti, uno per area.
 * I test non dipendono dal contenuto reale — fixture autocontenute.
 */
const catalogoFisso = {
  "risparmio": {
    id: "risparmio", nome: "Risparmio", area: "basi",
    inUnaRiga: "...", prerequisiti: [] as ConcettoId[], lezione: "l1a",
  },
  "inflazione": {
    id: "inflazione", nome: "Inflazione", area: "inflazione",
    inUnaRiga: "...", prerequisiti: [] as ConcettoId[], lezione: "l2a",
  },
  "rischio": {
    id: "rischio", nome: "Rischio", area: "rischio-rendimento",
    inUnaRiga: "...", prerequisiti: [] as ConcettoId[], lezione: "l4a",
  },
  "diversificazione": {
    id: "diversificazione", nome: "Diversificazione", area: "diversificazione",
    inUnaRiga: "...", prerequisiti: [] as ConcettoId[], lezione: "l5a",
  },
  "prestito": {
    id: "prestito", nome: "Prestito", area: "strumenti",
    inUnaRiga: "...", prerequisiti: [] as ConcettoId[], lezione: "l6a",
  },
} as unknown as Readonly<Record<ConcettoId, Concetto>>;

function risposta(
  concetto: ConcettoId,
  credito: 0 | 0.5 | 1,
): RispostaData {
  return {
    domandaId: `d-${concetto}`,
    concetto,
    opzioneId: credito === 1 ? "corretta" : "sbagliata",
    corretta: credito === 1,
    credito,
    momento: "finale",
  };
}

// ─── calcolaProfilo ──────────────────────────────────────────────────────────

describe("calcolaProfilo", () => {
  it("cinque risposte tutte corrette → complessivo 100 e 100 in ogni area", () => {
    const risposte: readonly RispostaData[] = [
      risposta("risparmio", 1),
      risposta("inflazione", 1),
      risposta("rischio", 1),
      risposta("diversificazione", 1),
      risposta("prestito", 1),
    ];
    const profilo = calcolaProfilo(risposte, catalogoFisso);
    expect(profilo.complessivo).toBe(100);
    expect(profilo.perArea["basi"]).toBe(100);
    expect(profilo.perArea["inflazione"]).toBe(100);
    expect(profilo.perArea["rischio-rendimento"]).toBe(100);
    expect(profilo.perArea["diversificazione"]).toBe(100);
    expect(profilo.perArea["strumenti"]).toBe(100);
  });

  it("cinque risposte tutte errate → 0 ovunque, non NaN", () => {
    const risposte: readonly RispostaData[] = [
      risposta("risparmio", 0),
      risposta("inflazione", 0),
      risposta("rischio", 0),
      risposta("diversificazione", 0),
      risposta("prestito", 0),
    ];
    const profilo = calcolaProfilo(risposte, catalogoFisso);
    expect(profilo.complessivo).toBe(0);
    expect(Number.isNaN(profilo.complessivo)).toBe(false);
    for (const area of Object.values(profilo.perArea)) {
      expect(area).toBe(0);
      expect(Number.isNaN(area)).toBe(false);
    }
  });

  it("un'area senza risposte vale 0 ed è sempre presente nel record", () => {
    // Solo risposta su "basi", le altre aree sono vuote
    const risposte: readonly RispostaData[] = [risposta("risparmio", 1)];
    const profilo = calcolaProfilo(risposte, catalogoFisso);

    // Tutte e 5 le aree devono essere presenti
    const areeAttese = ["basi", "inflazione", "rischio-rendimento", "diversificazione", "strumenti"] as const;
    for (const area of areeAttese) {
      expect(profilo.perArea).toHaveProperty(area);
      expect(Number.isNaN(profilo.perArea[area])).toBe(false);
    }

    expect(profilo.perArea["basi"]).toBe(100);
    expect(profilo.perArea["inflazione"]).toBe(0);
    expect(profilo.perArea["rischio-rendimento"]).toBe(0);
    expect(profilo.perArea["diversificazione"]).toBe(0);
    expect(profilo.perArea["strumenti"]).toBe(0);
  });

  it("credito 0.5 produce un'area al 50", () => {
    const risposte: readonly RispostaData[] = [risposta("inflazione", 0.5)];
    const profilo = calcolaProfilo(risposte, catalogoFisso);
    expect(profilo.perArea["inflazione"]).toBe(50);
  });

  it("concettiAcquisiti conta i concetti unici con risposta corretta", () => {
    const risposte: readonly RispostaData[] = [
      risposta("risparmio", 1),
      risposta("risparmio", 1), // stesso concetto due volte
      risposta("inflazione", 0),
    ];
    const profilo = calcolaProfilo(risposte, catalogoFisso);
    expect(profilo.concettiAcquisiti).toBe(1); // solo risparmio, non inflazione
  });

  it("lista vuota → 0 ovunque, record con tutte le aree a 0", () => {
    const profilo = calcolaProfilo([], catalogoFisso);
    expect(profilo.complessivo).toBe(0);
    expect(profilo.concettiAcquisiti).toBe(0);
    const areeAttese = ["basi", "inflazione", "rischio-rendimento", "diversificazione", "strumenti"] as const;
    for (const area of areeAttese) {
      expect(profilo.perArea).toHaveProperty(area);
      expect(profilo.perArea[area]).toBe(0);
    }
  });
});

// ─── confronta ───────────────────────────────────────────────────────────────

describe("confronta", () => {
  it("calcola i delta complessivi e per area", () => {
    const prima = calcolaProfilo(
      [risposta("risparmio", 0), risposta("inflazione", 0)],
      catalogoFisso,
    );
    const dopo = calcolaProfilo(
      [risposta("risparmio", 1), risposta("inflazione", 1)],
      catalogoFisso,
    );
    const c = confronta(prima, dopo);
    expect(c.deltaComplessivo).toBe(dopo.complessivo - prima.complessivo);
    expect(c.deltaComplessivo).toBeGreaterThan(0);
    expect(c.deltaPerArea["basi"]).toBe(100);
    expect(c.deltaPerArea["inflazione"]).toBe(100);
  });

  it("delta può essere negativo", () => {
    const prima = calcolaProfilo([risposta("risparmio", 1)], catalogoFisso);
    const dopo = calcolaProfilo([risposta("risparmio", 0)], catalogoFisso);
    const c = confronta(prima, dopo);
    expect(c.deltaComplessivo).toBeLessThan(0);
    expect(c.deltaPerArea["basi"]).toBeLessThan(0);
  });

  it("include prima e dopo nel risultato", () => {
    const prima = calcolaProfilo([risposta("risparmio", 1)], catalogoFisso);
    const dopo = calcolaProfilo([risposta("risparmio", 1)], catalogoFisso);
    const c = confronta(prima, dopo);
    expect(c.prima).toBe(prima);
    expect(c.dopo).toBe(dopo);
  });
});
