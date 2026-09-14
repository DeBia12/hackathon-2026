import type {
  ConcettoId,
  Concetto,
  Modulo,
  ModuloId,
  StatoApprendimento,
} from "./tipi";

// ─── Tipi esportati ──────────────────────────────────────────────────────────

export type StatoModulo = "bloccato" | "disponibile" | "in-corso" | "completato";

export type Livello = "Principiante" | "Esploratore" | "Navigatore" | "Consapevole";

export interface Avanzamento {
  livello: Livello;
  xp: number;
  concettiAcquisiti: number;
  concettiTotali: number;
  /** 0-100 */
  percentuale: number;
  prossimoLivello?: Livello;
  concettiAlProssimoLivello: number;
}

// ─── moduloCompletato ────────────────────────────────────────────────────────

/**
 * Restituisce true se il modulo è stato completato (tutte le verifiche superate).
 * La sorgente di verità è `stato.moduliCompletati`, aggiornato dal riduttore.
 * Il motore di percorso non importa lezioni o domande — è il riduttore che
 * decide quando un modulo è completato e aggiorna il flag.
 */
export function moduloCompletato(
  modulo: Modulo,
  stato: StatoApprendimento,
): boolean {
  return stato.moduliCompletati.includes(modulo.id);
}

// ─── statoModuli ─────────────────────────────────────────────────────────────

/**
 * Calcola lo stato di ogni modulo in base all'avanzamento corrente.
 *
 * Regole di sblocco:
 * - Il primo modulo è sempre almeno `disponibile`.
 * - Un modulo è `disponibile` solo se il precedente è `completato`.
 * - È `in-corso` se almeno una delle sue lezioni è in `lezioniViste`
 *   ma non è ancora `completato`.
 * - È `bloccato` se il precedente non è `completato`.
 */
export function statoModuli(
  moduli: readonly Modulo[],
  stato: StatoApprendimento,
): Record<ModuloId, StatoModulo> {
  const result: Partial<Record<ModuloId, StatoModulo>> = {};
  // Il primo modulo è sempre sbloccabile; `prevCompletato` tiene il flag per la
  // sequenza: un modulo è disponibile solo se il precedente è completato.
  let prevCompletato = true;

  for (const modulo of moduli) {
    if (!prevCompletato) {
      result[modulo.id] = "bloccato";
      // prevCompletato rimane false: tutti i successivi saranno bloccati
      continue;
    }

    if (moduloCompletato(modulo, stato)) {
      result[modulo.id] = "completato";
      prevCompletato = true;
      continue;
    }

    const haLezioneVista = modulo.lezioni.some((l) =>
      stato.lezioniViste.includes(l),
    );
    result[modulo.id] = haLezioneVista ? "in-corso" : "disponibile";
    prevCompletato = false;
  }

  return result as Record<ModuloId, StatoModulo>;
}

// ─── avanzamento ─────────────────────────────────────────────────────────────

/**
 * La wiki chiede che il progresso premi la **comprensione dimostrata**, non le
 * pagine viste. XP e livello si calcolano sempre dai concetti `acquisito`.
 *
 * Livelli (su 12 concetti totali):
 * - 0–2  → Principiante
 * - 3–6  → Esploratore
 * - 7–10 → Navigatore
 * - 11–12 → Consapevole
 */
export function avanzamento(
  stato: StatoApprendimento,
  catalogo: Readonly<Record<ConcettoId, Concetto>>,
): Avanzamento {
  const concettiTotali = Object.keys(catalogo).length;

  const concettiAcquisiti = Object.values(stato.padronanza).filter(
    (p) => p?.stato === "acquisito",
  ).length;

  const percentuale =
    concettiTotali === 0
      ? 0
      : Math.round((concettiAcquisiti / concettiTotali) * 100);

  const xp = concettiAcquisiti * 100;

  const livello = calcolaLivello(concettiAcquisiti);
  const prossimoLivello = prossimoDopo(livello);
  const concettiAlProssimoLivello =
    prossimoLivello === undefined
      ? 0
      : sogliaLivello(prossimoLivello) - concettiAcquisiti;

  return {
    livello,
    xp,
    concettiAcquisiti,
    concettiTotali,
    percentuale,
    prossimoLivello,
    concettiAlProssimoLivello,
  };
}

// ─── moduloDaRiprendere ───────────────────────────────────────────────────────

/**
 * Il primo modulo non completato accessibile, per il pulsante "Riprendi".
 * Preferisce i moduli già `in-corso` rispetto a quelli `disponibili`.
 */
export function moduloDaRiprendere(
  moduli: readonly Modulo[],
  stato: StatoApprendimento,
): Modulo | undefined {
  const stati = statoModuli(moduli, stato);

  return (
    moduli.find((m) => stati[m.id] === "in-corso") ??
    moduli.find((m) => stati[m.id] === "disponibile")
  );
}

// ─── Aiutanti interni ────────────────────────────────────────────────────────

function calcolaLivello(acquisiti: number): Livello {
  if (acquisiti <= 2) return "Principiante";
  if (acquisiti <= 6) return "Esploratore";
  if (acquisiti <= 10) return "Navigatore";
  return "Consapevole";
}

function prossimoDopo(livello: Livello): Livello | undefined {
  const sequenza: Livello[] = [
    "Principiante",
    "Esploratore",
    "Navigatore",
    "Consapevole",
  ];
  const idx = sequenza.indexOf(livello);
  return idx < sequenza.length - 1 ? sequenza[idx + 1] : undefined;
}

/** Numero minimo di concetti acquisiti per raggiungere il livello. */
function sogliaLivello(livello: Livello): number {
  switch (livello) {
    case "Principiante":  return 0;
    case "Esploratore":   return 3;
    case "Navigatore":    return 7;
    case "Consapevole":   return 11;
  }
}
