import type { ReactElement } from "react";

export function Trasparenza(): ReactElement {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        <span aria-hidden="true" className="text-accent">
          &gt;
        </span>{" "}
        Come funziona Capitolo Zero
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        La schermata di trasparenza è in costruzione. Troverai qui la
        spiegazione del metodo adattivo, i limiti del prodotto e la nota
        didattica completa.
      </p>
    </div>
  );
}
