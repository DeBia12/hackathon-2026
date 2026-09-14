import type { StatoApprendimento } from "../dominio/tipi";

export const CHIAVE_ARCHIVIO = "capitolo-zero:v1";

export function statoIniziale(): StatoApprendimento {
  return {
    versione: 1,
    schermata: { nome: "benvenuto" },
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

function isStatoValido(v: unknown): v is StatoApprendimento {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  return (
    obj["versione"] === 1 &&
    typeof obj["xp"] === "number" &&
    typeof obj["iniziatoIl"] === "string" &&
    typeof obj["schermata"] === "object" && obj["schermata"] !== null &&
    Array.isArray(obj["risposteIniziali"]) &&
    Array.isArray(obj["risposteFinali"]) &&
    Array.isArray(obj["rispostePercorso"]) &&
    typeof obj["padronanza"] === "object" && obj["padronanza"] !== null &&
    Array.isArray(obj["lezioniViste"]) &&
    Array.isArray(obj["moduliCompletati"])
  );
}

export function caricaStato(): StatoApprendimento {
  try {
    const raw = localStorage.getItem(CHIAVE_ARCHIVIO);
    if (raw === null) return statoIniziale();
    const parsed: unknown = JSON.parse(raw);
    if (!isStatoValido(parsed)) return statoIniziale();
    return parsed;
  } catch {
    return statoIniziale();
  }
}

export function salvaStato(stato: StatoApprendimento): void {
  try {
    localStorage.setItem(CHIAVE_ARCHIVIO, JSON.stringify(stato));
  } catch {
    // quota piena o modalità privata: fallisce in silenzio
  }
}

export function azzeraStato(): void {
  try {
    localStorage.removeItem(CHIAVE_ARCHIVIO);
  } catch {
    // modalità privata: fallisce in silenzio
  }
}
