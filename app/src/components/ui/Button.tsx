import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variante = "primario" | "secondario" | "fantasma";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  children: ReactNode;
  /** Aggiunge la freccia → a destra dell'etichetta. Decorativa: aria-hidden. */
  freccia?: boolean;
}

/*
 * Il primario ha uno SPESSORE, non un'ombra: un inset in basso, dello stesso
 * blu profondo della famiglia. Premendolo ci scende dentro — è il gesto fisico
 * dei tasti di una calcolatrice. Un nero puro sotto un colore saturo lo sporca.
 */
const varianti: Record<Variante, string> = {
  // bianco su #375CE3 = 5.52:1 AA
  primario:
    "bg-accent-text text-paper hover:bg-accent-deep shadow-spessore " +
    "active:translate-y-0.5 active:shadow-spessore-premuto",
  secondario:
    "bg-paper text-accent-text border-2 border-accent-text hover:bg-accent-tenue " +
    "active:translate-y-0.5",
  fantasma: "bg-transparent text-ink hover:bg-surface",
};

export function Button({ variante = "primario", className, children, freccia, ...props }: ButtonProps) {
  return (
    <button
      // type esplicito: dentro un form, il default "submit" causa invii involontari
      type={props.type ?? "button"}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2",
        "text-base font-semibold",
        "motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-molla",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
        "disabled:cursor-not-allowed disabled:opacity-50",
        varianti[variante],
        className,
      )}
      {...props}
    >
      {children}
      {freccia && (
        <span aria-hidden="true">→</span>
      )}
    </button>
  );
}
