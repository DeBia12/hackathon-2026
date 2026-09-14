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
  { simbolo: string; etichettaSr: string }
> = {
  ignoto: { simbolo: "○", etichettaSr: "da vedere" },
  "in-corso": { simbolo: "◑", etichettaSr: "in corso" },
  acquisito: { simbolo: "●", etichettaSr: "acquisito" },
};

export function PastigliaConcetto({
  nome,
  stato,
}: PropsPastigliaConcetto): ReactElement {
  const { simbolo, etichettaSr } = CONFIG[stato];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-2 px-2.5 py-1 text-sm font-medium",
        stato === "ignoto" && "border-line bg-paper text-muted",
        stato === "in-corso" && "border-accent-text bg-paper text-accent-text",
        stato === "acquisito" && "border-accent-text bg-accent-text text-paper",
      )}
    >
      <span aria-hidden="true">{simbolo}</span>
      <span>{nome}</span>
      <span className="sr-only"> — {etichettaSr}</span>
    </span>
  );
}
