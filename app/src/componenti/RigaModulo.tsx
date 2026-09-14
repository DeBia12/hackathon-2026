import type { ReactElement } from "react";
import type { Modulo, ConcettoId, StatoPadronanza } from "@/dominio/tipi";
import type { StatoModulo } from "@/dominio/percorso";
import { PastigliaConcetto } from "@/componenti/PastigliaConcetto";
import { cn } from "@/lib/cn";

// ─── Tipi pubblici ────────────────────────────────────────────────────────────

export interface ConcettoConStato {
  id: ConcettoId;
  nome: string;
  stato: StatoPadronanza;
}

// ─── Interfaccia del componente ───────────────────────────────────────────────

interface PropsRigaModulo {
  modulo: Modulo;
  stato: StatoModulo;
  concetti: ConcettoConStato[];
  /**
   * Modulo che precede questo nella sequenza.
   * Usato per costruire il messaggio di sblocco quando `stato === "bloccato"`.
   */
  moduloPrecedente?: Modulo;
  onClick?: () => void;
}

// ─── Etichette leggibili per lo stato ─────────────────────────────────────────

const ETICHETTE_STATO: Record<StatoModulo, string> = {
  completato: "Completato",
  disponibile: "Disponibile",
  "in-corso": "In corso",
  bloccato: "Bloccato",
};

// ─── Componente ───────────────────────────────────────────────────────────────

export function RigaModulo({
  modulo,
  stato,
  concetti,
  moduloPrecedente,
  onClick,
}: PropsRigaModulo): ReactElement {
  const etichettaStato = ETICHETTE_STATO[stato];

  /*
   * Il nome accessibile include numero, titolo e stato in sequenza.
   * Chi naviga per elementi interattivi sente tutto in una singola
   * annuncio: «Modulo 3, Risparmiare o investire, In corso».
   */
  const nomeAccessibile = `Modulo ${modulo.numero}, ${modulo.titolo}, ${etichettaStato}`;

  // ── Corpo visivo condiviso tra le due varianti di rendering ────────────────

  const corpo = (
    <div className="py-5">
      {/* Riga principale: numero + titolo + etichetta stato */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Il numero è decorativo: il nome accessibile già lo include */}
          <span
            className="w-6 shrink-0 pt-0.5 text-sm font-medium tabular-nums text-muted"
            aria-hidden="true"
          >
            {modulo.numero}
          </span>
          <div>
            <p className="font-semibold leading-snug text-ink">{modulo.titolo}</p>
            <p className="mt-0.5 text-sm leading-snug text-muted">
              {modulo.sottotitolo}
            </p>
          </div>
        </div>

        {/*
         * L'etichetta di stato è visiva: il colore non è l'unico segnale,
         * la parola è sempre presente.
         */}
        <span
          className={cn(
            "shrink-0 text-sm font-medium",
            stato === "completato" ? "text-accent-text" : "text-muted",
          )}
          aria-hidden="true"
        >
          {etichettaStato}
        </span>
      </div>

      {/*
       * Messaggio di sblocco — solo quando bloccato.
       * Spiega il perché e dice cosa fare: un blocco silenzioso è un difetto
       * di accessibilità oltre che un cattivo UX.
       */}
      {stato === "bloccato" && moduloPrecedente !== undefined && (
        <p className="ml-10 mt-2 text-sm text-muted">
          Per continuare, completa prima il modulo {moduloPrecedente.numero}:{" "}
          <span className="font-medium text-ink">{moduloPrecedente.titolo}</span>.
        </p>
      )}

      {/* Concetti del modulo con il loro stato di padronanza */}
      {concetti.length > 0 && (
        <div className="ml-10 mt-3 flex flex-wrap gap-2">
          {concetti.map((c) => (
            <PastigliaConcetto key={c.id} nome={c.nome} stato={c.stato} />
          ))}
        </div>
      )}
    </div>
  );

  // ── Variante interattiva (completato / disponibile / in-corso) ─────────────

  if (stato !== "bloccato") {
    return (
      <li>
        <button
          type="button"
          onClick={onClick}
          aria-label={nomeAccessibile}
          className={cn(
            "w-full text-left",
            "hover:bg-surface",
            "focus-visible:outline-2 focus-visible:outline-accent-text",
            "focus-visible:outline-offset-[-2px]",
            "motion-safe:transition-colors",
            "motion-safe:duration-[550ms]",
            "motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]",
          )}
        >
          {corpo}
        </button>
      </li>
    );
  }

  // ── Variante bloccata — non interattiva ────────────────────────────────────

  /*
   * La spiegazione testuale interna è il meccanismo a11y principale:
   * qualunque lettore di schermo la legge indipendentemente dal ruolo.
   */
  return (
    <li>{corpo}</li>
  );
}
