import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  titolo: string;
  /** Livello di heading: va scelto in base alla gerarchia della pagina, non all'aspetto. */
  livello?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}

export function Card({ titolo, livello = 3, children, className }: CardProps) {
  const Heading = `h${livello}` as const;

  return (
    <article className={cn("rounded-brand bg-surface p-6", className)}>
      <Heading className="text-xl font-semibold text-ink">{titolo}</Heading>
      <div className="mt-3 text-base leading-relaxed text-muted-surface">{children}</div>
    </article>
  );
}
