import { describe, it, expect } from "vitest";
import { CONCETTI, CONCETTI_ELENCO } from "../concetti";
import type { ConcettoId } from "../tipi";

describe("CONCETTI — grafo dei prerequisiti", () => {
  it("ogni prerequisito citato esiste in CONCETTI", () => {
    for (const concetto of CONCETTI_ELENCO) {
      for (const prereq of concetto.prerequisiti) {
        expect(
          Object.prototype.hasOwnProperty.call(CONCETTI, prereq),
          `Il concetto "${concetto.id}" dichiara prerequisito "${prereq}" che non esiste`
        ).toBe(true);
      }
    }
  });

  it("il grafo dei prerequisiti è aciclico (nessun ciclo raggiungibile)", () => {
    // DFS con marcatura: bianco=non visitato, grigio=in visita, nero=completato
    const colore: Partial<Record<ConcettoId, "grigio" | "nero">> = {};

    function visita(id: ConcettoId): void {
      if (colore[id] === "nero") return;
      expect(
        colore[id],
        `Ciclo rilevato nel grafo dei prerequisiti: "${id}" visitato due volte`
      ).not.toBe("grigio");

      colore[id] = "grigio";
      const concetto = CONCETTI[id];
      for (const prereq of concetto.prerequisiti) {
        visita(prereq);
      }
      colore[id] = "nero";
    }

    for (const concetto of CONCETTI_ELENCO) {
      visita(concetto.id);
    }
  });
});
