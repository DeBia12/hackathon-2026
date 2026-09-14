import { describe, it, expect } from "vitest";
import type { Concetto, ConcettoId, Domanda, Padronanza } from "../tipi";
import {
  valuta,
  prossimoPasso,
  aggiornaPadronanza,
  radiceDellaLacuna,
} from "../motoreAdattivo";

// ─── Fixture ────────────────────────────────────────────────────────────────

/** Domanda sul tema obbligazione: usata per i test standard e per il caso wiki. */
const domandaObbligazione: Domanda = {
  id: "d-obbligazione-1",
  momento: "verifica",
  concetto: "obbligazione-societaria",
  testo: "Comprando un'obbligazione societaria diventi proprietario dell'azienda?",
  corretta: "a",
  opzioni: [
    {
      id: "a",
      testo: "No, diventi creditore: l'azienda ti deve restituire i soldi con gli interessi.",
      spiegazione:
        "Esatto: chi compra un'obbligazione presta denaro, non compra una quota.",
    },
    {
      id: "b",
      testo: "Sì, diventi proprietario di una parte dell'azienda.",
      lacuna: "prestito",
      spiegazione:
        "No: acquistare un'obbligazione significa prestare denaro all'azienda.",
    },
    {
      id: "c",
      testo: "Diventi qualcosa a metà tra creditore e proprietario.",
      credito: 0.5,
      lacuna: "proprieta",
      spiegazione: "Non esattamente: l'obbligazione conferisce solo diritti da creditore.",
    },
  ],
};

/**
 * Catalogo ridotto per i test: contiene i concetti necessari alle fixture.
 * I test non dipendono dal contenuto reale — è un requisito di progettazione.
 */
const catalogoRidotto = {
  "risparmio": {
    id: "risparmio",
    nome: "Risparmio",
    area: "basi",
    inUnaRiga: "...",
    prerequisiti: [] as ConcettoId[],
    lezione: "l1a",
  },
  "rischio": {
    id: "rischio",
    nome: "Rischio",
    area: "rischio-rendimento",
    inUnaRiga: "...",
    prerequisiti: [] as ConcettoId[],
    lezione: "l4a",
  },
  "prestito": {
    id: "prestito",
    nome: "Prestito",
    area: "strumenti",
    inUnaRiga: "...",
    prerequisiti: ["rischio"] as ConcettoId[],
    lezione: "l6a",
  },
  "proprieta": {
    id: "proprieta",
    nome: "Proprietà",
    area: "strumenti",
    inUnaRiga: "...",
    prerequisiti: ["rischio"] as ConcettoId[],
    lezione: "l6a",
  },
  "obbligazione-societaria": {
    id: "obbligazione-societaria",
    nome: "Obbligazione societaria",
    area: "strumenti",
    inUnaRiga: "...",
    prerequisiti: ["prestito", "rischio"] as ConcettoId[],
    lezione: "l6c",
  },
} as unknown as Readonly<Record<ConcettoId, Concetto>>;

// ─── valuta ─────────────────────────────────────────────────────────────────

describe("valuta", () => {
  it("su opzione corretta: corretta=true, credito=1, nessuna lacuna", () => {
    const esito = valuta(domandaObbligazione, "a");
    expect(esito.corretta).toBe(true);
    expect(esito.credito).toBe(1);
    expect(esito.lacuna).toBeUndefined();
    expect(esito.spiegazione).toBeTruthy();
  });

  it("su opzione errata: corretta=false, credito=0, lacuna dichiarata", () => {
    const esito = valuta(domandaObbligazione, "b");
    expect(esito.corretta).toBe(false);
    expect(esito.credito).toBe(0);
    expect(esito.lacuna).toBe("prestito");
  });

  it("su opzione parziale: credito=0.5, corretta=false", () => {
    const esito = valuta(domandaObbligazione, "c");
    expect(esito.corretta).toBe(false);
    expect(esito.credito).toBe(0.5);
    expect(esito.lacuna).toBe("proprieta");
  });

  it("con id inesistente lancia un errore leggibile", () => {
    expect(() => valuta(domandaObbligazione, "x-non-esiste")).toThrow();
  });

  it("include sempre la spiegazione dell'opzione scelta", () => {
    const esito = valuta(domandaObbligazione, "b");
    expect(typeof esito.spiegazione).toBe("string");
    expect(esito.spiegazione.length).toBeGreaterThan(0);
  });
});

// ─── prossimoPasso ───────────────────────────────────────────────────────────

describe("prossimoPasso", () => {
  it("su esito corretto restituisce avanza", () => {
    const esito = valuta(domandaObbligazione, "a");
    const passo = prossimoPasso(esito, domandaObbligazione, catalogoRidotto);
    expect(passo.tipo).toBe("avanza");
  });

  it("su esito errato punta alla lezione del concetto della lacuna", () => {
    const esito = valuta(domandaObbligazione, "b"); // lacuna: prestito → lezione l6a
    const passo = prossimoPasso(esito, domandaObbligazione, catalogoRidotto);
    expect(passo.tipo).toBe("rimedia");
    if (passo.tipo === "rimedia") {
      expect(passo.concetto).toBe("prestito");
      expect(passo.lezione).toBe("l6a");
      expect(passo.riverifica).toBe("r-l6a");
    }
  });

  it("IL CASO DELLA WIKI — obbligazione sbagliata (opzione 'proprietario') → rimedia su prestito → lezione l6a → riverifica r-l6a", () => {
    const esito = valuta(domandaObbligazione, "b");
    const passo = prossimoPasso(esito, domandaObbligazione, catalogoRidotto);
    expect(passo).toEqual({
      tipo: "rimedia",
      concetto: "prestito",
      lezione: "l6a",
      riverifica: "r-l6a",
    });
  });

  it("usa radiceDellaLacuna quando la padronanza è passata", () => {
    // Con padronanza vuota e lacuna=prestito, il prerequisito non acquisito
    // di prestito è "rischio" → il motore rimanda a rischio
    const esito = valuta(domandaObbligazione, "b"); // lacuna: prestito
    const padronanzaVuota: Partial<Record<ConcettoId, Padronanza>> = {};
    const passo = prossimoPasso(
      esito,
      domandaObbligazione,
      catalogoRidotto,
      padronanzaVuota,
    );
    expect(passo.tipo).toBe("rimedia");
    if (passo.tipo === "rimedia") {
      // rischio ha prerequisiti vuoti ed è non acquisito → è la radice
      expect(passo.concetto).toBe("rischio");
      expect(passo.lezione).toBe("l4a");
      expect(passo.riverifica).toBe("r-l4a");
    }
  });
});

// ─── radiceDellaLacuna ───────────────────────────────────────────────────────

describe("radiceDellaLacuna", () => {
  it("scende al prerequisito non acquisito invece di fermarsi in superficie", () => {
    // prestito ha prerequisito rischio; con padronanza vuota la radice è rischio
    const padronanza: Partial<Record<ConcettoId, Padronanza>> = {};
    const radice = radiceDellaLacuna("prestito", padronanza, catalogoRidotto);
    expect(radice).toBe("rischio");
  });

  it("si ferma al concetto di superficie se i prerequisiti sono acquisiti", () => {
    const padronanza: Partial<Record<ConcettoId, Padronanza>> = {
      rischio: { stato: "acquisito", tentativi: 1, corrette: 1, attendeRiverifica: false },
    };
    const radice = radiceDellaLacuna("prestito", padronanza, catalogoRidotto);
    expect(radice).toBe("prestito");
  });

  it("restituisce sé stesso se tutti i prerequisiti sono acquisiti", () => {
    const padronanza: Partial<Record<ConcettoId, Padronanza>> = {
      rischio: { stato: "acquisito", tentativi: 1, corrette: 1, attendeRiverifica: false },
      prestito: { stato: "acquisito", tentativi: 1, corrette: 1, attendeRiverifica: false },
    };
    const radice = radiceDellaLacuna(
      "obbligazione-societaria",
      padronanza,
      catalogoRidotto,
    );
    expect(radice).toBe("obbligazione-societaria");
  });

  it("termina anche su un grafo con un ciclo", () => {
    // Costruiamo un mini-catalogo ciclico con ConcettoId reali per evitare cast impossibili.
    // Usiamo "risparmio" → ["potere-acquisto"] e "potere-acquisto" → ["risparmio"] nel fixture.
    const catalogoCiclico = {
      "risparmio": {
        id: "risparmio", nome: "A", area: "basi", inUnaRiga: "...",
        prerequisiti: ["potere-acquisto"] as ConcettoId[], lezione: "lX",
      },
      "potere-acquisto": {
        id: "potere-acquisto", nome: "B", area: "basi", inUnaRiga: "...",
        prerequisiti: ["risparmio"] as ConcettoId[], lezione: "lY",
      },
    } as unknown as Readonly<Record<ConcettoId, Concetto>>;

    // Deve terminare senza infinite loop e restituire una stringa
    const padronanza: Partial<Record<ConcettoId, Padronanza>> = {};
    const radice = radiceDellaLacuna("risparmio", padronanza, catalogoCiclico);
    expect(typeof radice).toBe("string");
    expect(radice.length).toBeGreaterThan(0);
  });
});

// ─── aggiornaPadronanza ──────────────────────────────────────────────────────

describe("aggiornaPadronanza", () => {
  const esitoCorretto = { corretta: true, credito: 1 as const, spiegazione: "ok" };
  const esitoErrato = { corretta: false, credito: 0 as const, spiegazione: "no" };
  const esitoParziale = { corretta: false, credito: 0.5 as const, spiegazione: "quasi" };

  it("errata poi corretta al momento 'verifica' resta in-corso (riverifica ancora mancante)", () => {
    const dopoErrata = aggiornaPadronanza(undefined, esitoErrato, "verifica");
    expect(dopoErrata.stato).toBe("in-corso");
    expect(dopoErrata.attendeRiverifica).toBe(true);

    const dopoCorretta = aggiornaPadronanza(dopoErrata, esitoCorretto, "verifica");
    expect(dopoCorretta.stato).toBe("in-corso");
    expect(dopoCorretta.attendeRiverifica).toBe(true);
  });

  it("errata poi corretta al momento 'riverifica' diventa acquisito", () => {
    const dopoErrata = aggiornaPadronanza(undefined, esitoErrato, "verifica");
    const dopoRiveifica = aggiornaPadronanza(dopoErrata, esitoCorretto, "riverifica");
    expect(dopoRiveifica.stato).toBe("acquisito");
    expect(dopoRiveifica.attendeRiverifica).toBe(false);
  });

  it("corretta al primo colpo in 'verifica' diventa acquisito", () => {
    const padronanza = aggiornaPadronanza(undefined, esitoCorretto, "verifica");
    expect(padronanza.stato).toBe("acquisito");
    expect(padronanza.tentativi).toBe(1);
    expect(padronanza.corrette).toBe(1);
  });

  it("corretta al momento 'iniziale' non diventa mai acquisito", () => {
    const padronanza = aggiornaPadronanza(undefined, esitoCorretto, "iniziale");
    expect(padronanza.stato).toBe("in-corso");
    expect(padronanza.stato).not.toBe("acquisito");
  });

  it("errata al momento 'iniziale' resta ignoto", () => {
    const padronanza = aggiornaPadronanza(undefined, esitoErrato, "iniziale");
    expect(padronanza.stato).toBe("ignoto");
  });

  it("credito 0.5 vale come errata ai fini della padronanza, ma non incrementa corrette", () => {
    const padronanza = aggiornaPadronanza(undefined, esitoParziale, "verifica");
    expect(padronanza.stato).toBe("in-corso");
    expect(padronanza.attendeRiverifica).toBe(true);
    expect(padronanza.corrette).toBe(0);
    expect(padronanza.tentativi).toBe(1);
  });

  it("tentativi e corrette si accumulano correttamente su più cicli", () => {
    const s1 = aggiornaPadronanza(undefined, esitoErrato, "verifica");
    expect(s1.tentativi).toBe(1);
    expect(s1.corrette).toBe(0);

    const s2 = aggiornaPadronanza(s1, esitoCorretto, "riverifica");
    expect(s2.tentativi).toBe(2);
    expect(s2.corrette).toBe(1);
    expect(s2.stato).toBe("acquisito");
  });
});
