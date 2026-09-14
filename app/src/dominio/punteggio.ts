import type { AreaId, ConcettoId, Concetto, RispostaData } from "./tipi";

// ─── Costanti di dominio ─────────────────────────────────────────────────────

const TUTTE_LE_AREE: readonly AreaId[] = [
  "basi",
  "inflazione",
  "rischio-rendimento",
  "diversificazione",
  "strumenti",
];

// ─── Tipi esportati ──────────────────────────────────────────────────────────

export interface Profilo {
  complessivo: number;               // 0-100, intero
  perArea: Record<AreaId, number>;   // 0-100, interi; tutte e 5 le aree sempre presenti
  concettiAcquisiti: number;
}

export interface Confronto {
  prima: Profilo;
  dopo: Profilo;
  deltaComplessivo: number;          // può essere negativo
  deltaPerArea: Record<AreaId, number>;
}

// ─── calcolaProfilo ──────────────────────────────────────────────────────────

/**
 * Calcola il profilo di punteggio dalle risposte date.
 *
 * - `complessivo`: media dei crediti su tutte le risposte, in centesimi, arrotondata.
 *   Lista vuota → 0 (non NaN).
 * - `perArea`: stessa media ristretta alle risposte il cui concetto appartiene a
 *   quell'area. Un'area senza risposte vale 0, non NaN — tutte e 5 le aree sono sempre
 *   presenti nel record.
 * - `concettiAcquisiti`: numero di ConcettoId unici con `corretta === true`.
 *
 * Usa `rispostaData.credito` direttamente — non ricalcola dalla domanda.
 */
export function calcolaProfilo(
  risposte: readonly RispostaData[],
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
): Profilo {
  // ── complessivo ──────────────────────────────────────────────────────────
  const complessivo =
    risposte.length === 0
      ? 0
      : Math.round((risposte.reduce((acc, r) => acc + r.credito, 0) / risposte.length) * 100);

  // ── perArea ──────────────────────────────────────────────────────────────
  const perArea = Object.fromEntries(
    TUTTE_LE_AREE.map((area) => {
      const risposteArea = risposte.filter(
        (r) => catalogo[r.concetto]?.area === area,
      );
      const valore =
        risposteArea.length === 0
          ? 0
          : Math.round(
              (risposteArea.reduce((acc, r) => acc + r.credito, 0) /
                risposteArea.length) *
                100,
            );
      return [area, valore] as const;
    }),
  ) as Record<AreaId, number>;

  // ── concettiAcquisiti ────────────────────────────────────────────────────
  const concettiCorretti = new Set<ConcettoId>(
    risposte.filter((r) => r.corretta).map((r) => r.concetto),
  );

  return {
    complessivo,
    perArea,
    concettiAcquisiti: concettiCorretti.size,
  };
}

// ─── confronta ───────────────────────────────────────────────────────────────

/**
 * Confronta due profili e restituisce i delta complessivi e per area.
 * I delta possono essere negativi.
 */
export function confronta(prima: Profilo, dopo: Profilo): Confronto {
  const deltaPerArea = Object.fromEntries(
    TUTTE_LE_AREE.map((area) => [
      area,
      dopo.perArea[area] - prima.perArea[area],
    ]),
  ) as Record<AreaId, number>;

  return {
    prima,
    dopo,
    deltaComplessivo: dopo.complessivo - prima.complessivo,
    deltaPerArea,
  };
}
