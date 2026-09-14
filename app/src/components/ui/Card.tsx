import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ColoreCategoria = "verde" | "blu" | "viola" | "ambra";

interface TesseraIcona {
  /** Glifo Unicode o testo breve da mostrare nella tessera colorata. */
  glifo: string;
  colore: ColoreCategoria;
}

interface CardProps {
  titolo: string;
  /** Livello di heading: va scelto in base alla gerarchia della pagina, non all'aspetto. */
  livello?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
  /** Tessera-icona colorata opzionale in alto alla card. Non rompe le chiamate senza prop. */
  tessera?: TesseraIcona;
}

const tessereColori: Record<ColoreCategoria, string> = {
  verde: "bg-accent-tenue text-accent-text",
  blu: "bg-blu-tenue text-blu",
  viola: "bg-viola-tenue text-viola",
  ambra: "bg-ambra-tenue text-ambra",
};

export function Card({ titolo, livello = 3, children, className, tessera }: CardProps) {
  const Heading = `h${livello}` as const;

  return (
    <article
      className={cn(
        // Il bordo è quello che tiene insieme la composizione quando l'ombra
        // quasi non c'è: il sollevamento lo fa il bianco sull'avena.
        "rounded-brand border border-line bg-paper shadow-riposo p-6",
        "motion-safe:transition-shadow motion-safe:duration-200",
        "motion-safe:hover:shadow-sollevata",
        className,
      )}
    >
      {tessera && (
        <div
          aria-hidden="true"
          className={cn(
            "mb-4 flex h-11 w-11 items-center justify-center rounded-tessera text-xl font-semibold select-none",
            tessereColori[tessera.colore],
          )}
        >
          {tessera.glifo}
        </div>
      )}
      <Heading className="text-xl font-semibold text-ink">{titolo}</Heading>
      <div className="mt-3 text-base leading-relaxed text-muted">{children}</div>
    </article>
  );
}
