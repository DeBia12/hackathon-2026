import { useState } from "react";
import type { SchedaStrumento, TipoStrumento } from "@/dominio/tipi";
import { STRUMENTI } from "@/dominio/strumenti";
import { cn } from "@/lib/cn";

interface Props {
  strumento?: TipoStrumento;
}

/** Una frase per ruolo, non per strumento: i dati restano tutti in strumenti.ts. */
const RUOLO_IN_CHIARO: Record<SchedaStrumento["ruolo"], string> = {
  creditore:
    "Comprando questo strumento presti denaro all'emittente: sei un creditore, non un proprietario.",
  proprietario:
    "Comprando questo strumento diventi proprietario di una quota dell'azienda, non un creditore.",
  "quota di un paniere":
    "Comprando questo strumento acquisti una quota di un paniere che contiene molti strumenti diversi.",
};

/** L'id del pannello disclosure: deriva dall'etichetta, che è unica per scheda. */
function idParte(etichetta: string): string {
  return etichetta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Mostra le parti di uno strumento finanziario con il pattern disclosure.
 * Ogni parte è un pulsante che rivela la spiegazione — aria-expanded + aria-controls.
 * I dati vengono da strumenti.ts, unica sorgente per le schede degli strumenti.
 */
export function AnatomiaStrumento({ strumento = "titolo-stato" }: Props) {
  const [parteAperta, setParteAperta] = useState<string | null>(null);
  const dati = STRUMENTI[strumento];

  function toggleParte(id: string) {
    setParteAperta((corrente) => (corrente === id ? null : id));
  }

  return (
    <article className="bg-surface p-6 md:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-ink">
        {dati.nome}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted">
        Emittente: <strong className="font-semibold text-ink">{dati.emittente}</strong>
      </p>
      <p className="mt-1 border-l-4 border-accent pl-4 text-base leading-relaxed text-ink">
        {RUOLO_IN_CHIARO[dati.ruolo]}
      </p>

      <p className="mt-6 text-sm font-semibold text-muted">
        Seleziona una parte per leggerne la spiegazione:
      </p>

      {/* Lista disclosure — ogni item è un pulsante + pannello */}
      <ul className="mt-3 space-y-2" aria-label={`Parti di ${dati.nome}`}>
        {dati.caratteristiche.map((parte) => {
          const id = idParte(parte.etichetta);
          const pannelloId = `pannello-${strumento}-${id}`;
          const aperta = parteAperta === id;

          return (
            <li key={id} className="border-2 border-muted bg-paper">
              {/* Trigger disclosure */}
              <button
                type="button"
                aria-expanded={aperta}
                aria-controls={pannelloId}
                onClick={() => toggleParte(id)}
                className={cn(
                  "flex w-full min-h-11 items-center justify-between gap-4 px-4 py-3 text-left",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
                  aperta && "border-b-2 border-line",
                )}
              >
                <span className="flex flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                  <span
                    className={cn(
                      "text-base font-semibold",
                      parte.assente ? "text-muted line-through" : "text-ink",
                    )}
                  >
                    {parte.etichetta}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      parte.assente ? "text-muted italic" : "text-muted",
                    )}
                  >
                    {parte.valore}
                  </span>
                </span>

                {/* Icona +/× — ruota su open, aria-hidden perché decorativa */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex-shrink-0 text-xl font-semibold text-accent-text",
                    "motion-safe:transition-transform motion-safe:duration-[550ms]",
                    "motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]",
                    aperta && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>

              {/* Pannello di spiegazione — hidden gestito via attributo HTML */}
              <div
                id={pannelloId}
                hidden={!aperta}
                className="px-4 py-4"
              >
                <p
                  className={cn(
                    "text-base leading-relaxed",
                    parte.assente ? "font-semibold text-ink" : "text-ink",
                  )}
                >
                  {parte.spiegazione}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
