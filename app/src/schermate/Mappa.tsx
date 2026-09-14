import type { ReactElement } from "react";

export function Mappa(): ReactElement {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        <span aria-hidden="true" className="text-accent">
          &gt;
        </span>{" "}
        Il tuo percorso
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        La mappa dei moduli è in costruzione. Presto potrai vedere i tuoi
        progressi e sbloccare i moduli successivi.
      </p>
    </div>
  );
}
