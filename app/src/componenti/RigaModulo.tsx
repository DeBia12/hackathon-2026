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

// ─── Colori delle tessere-icona, ciclici per modulo ──────────────────────────

/*
 * Ciclo di quattro colori: verde, blu, viola, ambra.
 * L'indice si calcola da modulo.numero per essere deterministico.
 * Un modulo bloccato usa bg-surface e text-muted indipendentemente.
 */
const TESSERE = [
  { bg: "bg-accent-tenue", testo: "text-accent-text" },
  { bg: "bg-blu-tenue", testo: "text-blu" },
  { bg: "bg-viola-tenue", testo: "text-viola" },
  { bg: "bg-ambra-tenue", testo: "text-ambra" },
] as const;

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

  const bloccato = stato === "bloccato";
  // `noUncheckedIndexedAccess` rende l'accesso per indice possibilmente indefinito
  // anche con il modulo: il ripiego evita un'asserzione di tipo.
  const tessera = TESSERE[(modulo.numero - 1) % TESSERE.length];
  const classiTessera = tessera
    ? `${tessera.bg} ${tessera.testo}`
    : "bg-surface text-muted";

  // ── Tessera-icona: il quadrato colorato a sinistra ────────────────────────

  const tesseraIcona = (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-tessera text-sm font-semibold",
        bloccato ? "bg-surface text-muted" : classiTessera,
      )}
      aria-hidden="true"
    >
      {modulo.numero}
    </span>
  );

  // ── Corpo visivo condiviso tra le due varianti di rendering ────────────────

  const corpo = (
    <div className="flex items-start gap-4">
      {tesseraIcona}

      <div className="min-w-0 flex-1">
        {/* Riga principale: titolo + etichetta stato */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={cn(
                "font-semibold leading-snug",
                bloccato ? "text-muted" : "text-ink",
              )}
            >
              {modulo.titolo}
            </p>
            <p className="mt-0.5 text-sm leading-snug text-muted">
              {modulo.sottotitolo}
            </p>
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
         * Spiega il perché e dice cosa fare: è il meccanismo accessibile
         * principale. Il contrasto di questo testo resta pienamente leggibile
         * anche se la tessera e il titolo sono visivamente attenuati.
         */}
        {bloccato && moduloPrecedente !== undefined && (
          <p className="mt-2 text-sm text-muted">
            Per continuare, completa prima il modulo {moduloPrecedente.numero}:{" "}
            <span className="font-medium text-ink">{moduloPrecedente.titolo}</span>.
          </p>
        )}

        {/* Concetti del modulo con il loro stato di padronanza */}
        {concetti.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {concetti.map((c) => (
              <PastigliaConcetto key={c.id} nome={c.nome} stato={c.stato} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Variante interattiva (completato / disponibile / in-corso) ─────────────

  if (!bloccato) {
    return (
      <li>
        <button
          type="button"
          onClick={onClick}
          aria-label={nomeAccessibile}
          className={cn(
            "w-full rounded-brand bg-paper p-6 text-left shadow-riposo",
            "motion-safe:transition-shadow motion-safe:duration-[550ms]",
            "motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]",
            "motion-safe:hover:shadow-sollevata",
            "focus-visible:outline-2 focus-visible:outline-accent-text",
            "focus-visible:outline-offset-2",
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
   * Il testo di sblocco usa text-ink e text-muted per garantire 4.5:1
   * anche sul fondo bg-surface del blocco.
   */
  return (
    <li>
      <div className="rounded-brand bg-surface p-6">
        {corpo}
      </div>
    </li>
  );
}
