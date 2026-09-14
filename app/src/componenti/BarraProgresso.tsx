import type { ReactElement } from "react";
import { cn } from "@/lib/cn";

interface PropsBarraProgresso {
  valore: number;
  etichetta: string;
  /** Compatta per l'intestazione, estesa per le schermate. */
  compatta?: boolean;
}

export function BarraProgresso({
  valore,
  etichetta,
  compatta = false,
}: PropsBarraProgresso): ReactElement {
  const val = Math.max(0, Math.min(100, Math.round(valore)));

  return (
    <div className={cn("flex flex-col gap-1.5", compatta ? "w-28" : "w-full")}>
      {!compatta && (
        <div className="flex items-center justify-between text-sm font-medium text-ink">
          <span>{etichetta}</span>
          {/* Il valore in cifre è obbligatorio: una barra senza numero non è
              leggibile da chi ha bassa visione */}
          <span aria-hidden="true">{val}%</span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={val}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${etichetta}: ${val}%`}
        className={cn(
          "overflow-hidden rounded-full bg-surface",
          compatta ? "h-2" : "h-4",
        )}
      >
        {/* La larghezza è un dato dinamico: inline style è l'unico modo corretto
            senza generare migliaia di classi Tailwind a build time */}
        <div
          className="h-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-[550ms] motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]"
          style={{ width: `${val}%` }}
          aria-hidden="true"
        />
      </div>

      {/* In modalità compatta il numero è visibile solo agli screen reader
          tramite aria-label; aggiungiamo anche il testo visivo in piccolo */}
      {compatta && (
        <span className="text-xs text-muted" aria-hidden="true">
          {val}%
        </span>
      )}
    </div>
  );
}
