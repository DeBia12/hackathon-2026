import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variante = "primario" | "secondario" | "fantasma";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  children: ReactNode;
}

const varianti: Record<Variante, string> = {
  // bianco su #7500C0 = 8.34:1
  primario: "bg-accent-text text-paper hover:bg-accent-deep",
  secondario: "bg-paper text-accent-text border-2 border-accent-text hover:bg-surface",
  fantasma: "bg-transparent text-ink hover:bg-surface",
};

export function Button({ variante = "primario", className, children, ...props }: ButtonProps) {
  return (
    <button
      // type esplicito: dentro un form, il default "submit" causa invii involontari
      type={props.type ?? "button"}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-brand px-6 py-2",
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
    </button>
  );
}
