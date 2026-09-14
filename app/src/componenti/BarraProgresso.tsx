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

  /*
   * Variante compatta: barra piena con la percentuale scritta sopra.
   * Il numero è stampato due volte e sovrapposto — in scuro sul fondo chiaro,
   * in bianco sul riempimento — e il secondo strato è ritagliato con clip-path
   * esattamente dove arriva il riempimento. Così la cifra resta leggibile sia
   * sopra il verde sia sopra il grigio, a qualsiasi percentuale:
   *   ink (#141414) su surface (#f2f2f2)   = 15.9:1
   *   bianco su accent-text (#007c23)      =  5.37:1
   * Un solo strato bianco sarebbe illeggibile finché la barra è quasi vuota.
   */
  if (compatta) {
    return (
      <div
        role="progressbar"
        aria-valuenow={val}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${etichetta}: ${val}%`}
        className="relative h-6 w-28 overflow-hidden rounded-full bg-surface"
      >
        <div
          className="absolute inset-y-0 left-0 bg-accent-text motion-safe:transition-[width] motion-safe:duration-[550ms] motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]"
          style={{ width: `${val}%` }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-ink"
          aria-hidden="true"
        >
          {val}%
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-paper"
          style={{ clipPath: `inset(0 ${100 - val}% 0 0)` }}
          aria-hidden="true"
        >
          {val}%
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm font-medium text-ink">
        <span>{etichetta}</span>
        {/* Il valore in cifre è obbligatorio: una barra senza numero non è
            leggibile da chi ha bassa visione */}
        <span aria-hidden="true">{val}%</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={val}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${etichetta}: ${val}%`}
        className={cn("h-4 overflow-hidden rounded-full bg-surface")}
      >
        {/* La larghezza è un dato dinamico: inline style è l'unico modo corretto
            senza generare migliaia di classi Tailwind a build time */}
        <div
          className="h-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-[550ms] motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]"
          style={{ width: `${val}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
