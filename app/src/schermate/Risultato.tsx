import type { ReactElement } from "react";

export function Risultato(): ReactElement {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        <span aria-hidden="true" className="text-accent">
          &gt;
        </span>{" "}
        I tuoi risultati
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Il confronto PRIMA vs DOPO è in costruzione. Vedrai qui il tuo
        progresso per area e il punteggio complessivo.
      </p>
    </div>
  );
}
