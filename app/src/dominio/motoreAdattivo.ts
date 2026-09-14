import type {
  ConcettoId,
  Concetto,
  Domanda,
  MomentoDomanda,
  Padronanza,
  LezioneId,
  DomandaId,
} from "./tipi";

// ─── Tipi esportati ──────────────────────────────────────────────────────────

export interface Esito {
  corretta: boolean;
  /** 1 corretta, 0.5 parziale, 0 errata. */
  credito: number;
  /** Il concetto che la risposta scelta rivela mancante. Assente se corretta. */
  lacuna?: ConcettoId;
  /** La spiegazione dell'opzione scelta: si mostra sempre, anche se corretta. */
  spiegazione: string;
}

export type Passo =
  | { tipo: "avanza" }
  | {
      tipo: "rimedia";
      concetto: ConcettoId;
      lezione: LezioneId;
      riverifica: DomandaId;
    };

// ─── valuta ──────────────────────────────────────────────────────────────────

/**
 * Valuta la risposta dell'utente e restituisce l'esito.
 * Lancia se l'id dell'opzione non esiste nella domanda.
 */
export function valuta(domanda: Domanda, idOpzione: string): Esito {
  const opzione = domanda.opzioni.find((o) => o.id === idOpzione);
  if (!opzione) {
    throw new Error(
      `Opzione "${idOpzione}" non trovata nella domanda "${domanda.id}". ` +
        `Opzioni disponibili: ${domanda.opzioni.map((o) => o.id).join(", ")}.`,
    );
  }

  const corretta = opzione.id === domanda.corretta;

  if (corretta) {
    return {
      corretta: true,
      credito: 1,
      spiegazione: opzione.spiegazione,
    };
  }

  return {
    corretta: false,
    credito: opzione.credito ?? 0,
    lacuna: opzione.lacuna,
    spiegazione: opzione.spiegazione,
  };
}

// ─── radiceDellaLacuna ───────────────────────────────────────────────────────

/**
 * Risale il grafo dei prerequisiti e restituisce il primo concetto non acquisito
 * in profondità. Se tutti i prerequisiti sono acquisiti, restituisce il concetto
 * stesso. Termina correttamente anche in presenza di cicli nel grafo.
 */
export function radiceDellaLacuna(
  concetto: ConcettoId,
  padronanza: Partial<Record<ConcettoId, Padronanza>>,
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
): ConcettoId {
  const visitati = new Set<ConcettoId>();

  function cerca(id: ConcettoId): ConcettoId {
    if (visitati.has(id)) {
      // Ciclo rilevato: fermati qui per evitare loop infiniti.
      return id;
    }
    visitati.add(id);

    const c = catalogo[id];
    if (!c) return id;

    for (const prereq of c.prerequisiti) {
      const statoPrereq = padronanza[prereq]?.stato;
      if (statoPrereq !== "acquisito") {
        return cerca(prereq);
      }
    }

    // Tutti i prerequisiti sono acquisiti: questo concetto è la radice da affrontare.
    return id;
  }

  return cerca(concetto);
}

// ─── prossimoPasso ───────────────────────────────────────────────────────────

/**
 * Decide cosa succede dopo una risposta.
 *
 * `catalogo` è il dizionario dei concetti: passato come parametro perché il
 * motore resti testabile senza il contenuto reale.
 *
 * `padronanza` è facoltativa: se presente, usa `radiceDellaLacuna` per scegliere
 * il prerequisito non ancora acquisito più profondo, invece del concetto di superficie.
 */
export function prossimoPasso(
  esito: Esito,
  domanda: Domanda,
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
  padronanza?: Partial<Record<ConcettoId, Padronanza>>,
): Passo {
  if (esito.corretta) {
    return { tipo: "avanza" };
  }

  // Determina il concetto di partenza per la remediation.
  const concettoDiSuperficie: ConcettoId = esito.lacuna ?? domanda.concetto;

  // Se la padronanza è disponibile, scendi al prerequisito più profondo non acquisito.
  const concettoTarget: ConcettoId =
    padronanza !== undefined
      ? radiceDellaLacuna(concettoDiSuperficie, padronanza, catalogo)
      : concettoDiSuperficie;

  const concettoObj = catalogo[concettoTarget];
  const lezione: LezioneId = concettoObj?.lezione ?? `l-${concettoTarget}`;
  const riverifica: DomandaId = `r-${lezione}`;

  return {
    tipo: "rimedia",
    concetto: concettoTarget,
    lezione,
    riverifica,
  };
}

// ─── aggiornaPadronanza ──────────────────────────────────────────────────────

/**
 * Aggiorna la padronanza di un concetto dopo una risposta.
 *
 * Regole:
 * - `tentativi` si incrementa sempre.
 * - `corrette` si incrementa solo se `credito === 1` (non per 0.5).
 * - `momento === "iniziale"`: la valutazione iniziale misura, non insegna.
 *   Risposta corretta → "in-corso". Risposta errata/parziale → "ignoto".
 * - Risposta errata o parziale (credito < 1): "in-corso", `attendeRiverifica = true`.
 * - Risposta corretta con `attendeRiverifica = true`:
 *   - `momento === "riverifica"` → "acquisito".
 *   - altro momento → resta "in-corso" (riverifica non ancora arrivata).
 * - Risposta corretta con `attendeRiverifica = false` → "acquisito".
 */
export function aggiornaPadronanza(
  precedente: Padronanza | undefined,
  esito: Esito,
  momento: MomentoDomanda,
): Padronanza {
  const prevStato = precedente?.stato ?? "ignoto";
  const prevAttendeRiverifica = precedente?.attendeRiverifica ?? false;
  const prevTentativi = precedente?.tentativi ?? 0;
  const prevCorrette = precedente?.corrette ?? 0;

  const tentativi = prevTentativi + 1;
  // credito 0.5 non conta come risposta corretta ai fini di "corrette"
  const corrette = esito.credito === 1 ? prevCorrette + 1 : prevCorrette;

  // ── Caso speciale: valutazione iniziale ──────────────────────────────────
  if (momento === "iniziale") {
    if (esito.credito === 1) {
      // Corretta al check iniziale: l'utente ha la base, ma il percorso parte da capo.
      return { stato: "in-corso", tentativi, corrette, attendeRiverifica: false };
    }
    // Errata o parziale: lo stato rimane/torna "ignoto" (la valutazione non insegna).
    return { stato: "ignoto", tentativi, corrette: prevCorrette, attendeRiverifica: false };
  }

  // ── Risposta errata o parziale ───────────────────────────────────────────
  if (esito.credito < 1) {
    return { stato: "in-corso", tentativi, corrette, attendeRiverifica: true };
  }

  // ── Risposta corretta (credito === 1) ────────────────────────────────────
  if (prevAttendeRiverifica) {
    if (momento === "riverifica") {
      return { stato: "acquisito", tentativi, corrette, attendeRiverifica: false };
    }
    // La riverifica deve ancora arrivare: resta in-corso.
    return { stato: "in-corso", tentativi, corrette, attendeRiverifica: true };
  }

  // attendeRiverifica era false e la risposta è corretta → acquisito.
  // Questo vale sia per "verifica" sia per "finale".
  void prevStato; // non usato esplicitamente: lo stato precedente non è rilevante qui
  return { stato: "acquisito", tentativi, corrette, attendeRiverifica: false };
}
