import type { ReactElement } from "react";

interface PropsDistintivoLivello {
  livello: string;
  concettiAcquisiti?: number;
  concettiTotali?: number;
}

export function DistintivoLivello({
  livello,
  concettiAcquisiti,
  concettiTotali,
}: PropsDistintivoLivello): ReactElement {
  const mostraCifre =
    concettiAcquisiti !== undefined && concettiTotali !== undefined;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-accent-tenue px-4 py-1.5"
      aria-label={
        mostraCifre
          ? `Livello ${livello} — ${concettiAcquisiti} di ${concettiTotali} concetti acquisiti`
          : `Livello ${livello}`
      }
    >
      {/* Il livello è scritto per esteso: mai solo colore o icona */}
      <span className="text-sm font-semibold text-accent-text" aria-hidden="true">
        {livello}
      </span>
      {mostraCifre && (
        <span className="text-xs text-muted" aria-hidden="true">
          {concettiAcquisiti}/{concettiTotali}
        </span>
      )}
    </div>
  );
}
