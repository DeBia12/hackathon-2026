import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variante = "primario" | "secondario" | "fantasma";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  children: ReactNode;
  /** Aggiunge la freccia → a destra dell'etichetta. Decorativa: aria-hidden. */
  freccia?: boolean;
}

const varianti: Record<Variante, string> = {
  // bianco su #047857 = 5.48:1 AA
  primario: "bg-accent-text text-paper hover:bg-accent-deep",
  secondario: "bg-paper text-accent-text border-2 border-accent-text hover:bg-surface",
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
        "motion-safe:transition-colors motion-safe:duration-150",
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
