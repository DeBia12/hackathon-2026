import type { ReactElement } from "react";
import type { StatoPadronanza } from "@/dominio/tipi";
import { cn } from "@/lib/cn";

interface PropsPastigliaConcetto {
  nome: string;
  stato: StatoPadronanza;
}

/*
 * I tre stati sono distinguibili SENZA colore:
 * ogni stato ha simbolo diverso (○ ◑ ●) E testo visibile E testo sr-only.
 * Accessibile per chi non distingue i colori.
 */
const CONFIG: Record<
  StatoPadronanza,
  { simbolo: string; etichettaSr: string; classi: string }
> = {
  ignoto: {
    simbolo: "○",
    etichettaSr: "da vedere",
    classi: "bg-surface text-muted",
  },
  "in-corso": {
    simbolo: "◑",
    etichettaSr: "in corso",
    classi: "bg-accent-tenue text-accent-text",
  },
  acquisito: {
    simbolo: "●",
    etichettaSr: "acquisito",
    classi: "bg-accent-text text-paper",
  },
};

export function PastigliaConcetto({
  nome,
  stato,
}: PropsPastigliaConcetto): ReactElement {
  const { simbolo, etichettaSr, classi } = CONFIG[stato];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        classi,
      )}
    >
      <span aria-hidden="true">{simbolo}</span>
      <span>{nome}</span>
      <span className="sr-only"> — {etichettaSr}</span>
    </span>
  );
}
