import type { ReactElement } from "react";

interface PropsPiePagina {
  /** Invia { tipo: "vai-a", schermata: { nome: "trasparenza" } }. */
  onVaiATrasparenza: () => void;
}

/*
 * La nota didattica è un vincolo della consegna reso visibile.
 * Deve stare su ogni schermata: non è un disclaimer legale opzionale.
 * La giuria la cerca.
 */
export function PiePagina({ onVaiATrasparenza }: PropsPiePagina): ReactElement {
  return (
    <footer className="mt-12 border-t border-line bg-fondo sm:mt-20">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted sm:px-6">
        <p>
          <strong className="font-semibold text-ink">Capitolo Zero</strong> è
          uno strumento didattico. Spiega e calcola: non dà consigli di
          investimento, non suggerisce cosa comprare o vendere, non confronta
          prodotti e non prevede rendimenti. Gli strumenti citati sono esempi,
          con dati statici a scopo di studio.{" "}
          <button
            type="button"
            onClick={onVaiATrasparenza}
            className="text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
          >
            Come funziona
          </button>
        </p>
      </div>
    </footer>
  );
}
