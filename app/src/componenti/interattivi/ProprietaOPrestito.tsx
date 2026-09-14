import { useState } from "react";
import type { TipoStrumento } from "@/dominio/tipi";
import { cn } from "@/lib/cn";

interface Props {
  strumento?: TipoStrumento;
}

type Prospettiva = "proprietario" | "creditore";

interface RigaConfronto {
  aspetto: string;
  proprietario: string;
  creditore: string;
}

const RIGHE: RigaConfronto[] = [
  {
    aspetto: "Cosa hai in mano",
    proprietario: "Una quota dell'azienda — sei socio.",
    creditore: "Un titolo di credito — sei prestatore.",
  },
  {
    aspetto: "Cosa ti spetta",
    proprietario: "Una parte dei profitti (dividendi), se e quando l'azienda decide di distribuirli.",
    creditore: "Gli interessi periodici (cedola) e il rimborso del capitale alla scadenza, come concordato.",
  },
  {
    aspetto: "Se l'azienda va bene",
    proprietario: "Il valore della tua quota può aumentare.",
    creditore: "Ricevi quanto pattuito — non di più, indipendentemente dai profitti.",
  },
  {
    aspetto: "Se l'azienda va male",
    proprietario: "Il valore della tua quota può scendere, anche fino a zero.",
    creditore: "Hai priorità di rimborso rispetto ai soci, ma il rischio di perdita esiste comunque.",
  },
  {
    aspetto: "Quando finisce",
    proprietario: "Nessuna scadenza: vendi quando vuoi, se trovi un acquirente.",
    creditore: "Alla scadenza del titolo: il rapporto termina e il capitale è restituito.",
  },
];

const CONSEGUENZA: Record<Prospettiva, string> = {
  proprietario:
    "In quanto proprietario (esempio: azionista) partecipi alla vita dell'azienda. " +
    "I tuoi guadagni e le tue perdite dipendono da come va l'azienda stessa.",
  creditore:
    "In quanto creditore (esempio: obbligazionista) hai un accordo preciso: interessi e rimborso. " +
    "Il successo dell'azienda oltre quel limite non ti appartiene — ma nemmeno le perdite eccedenti.",
};

/**
 * Distingue in modo netto la posizione del proprietario da quella del creditore.
 * È la distinzione fondante tra azione e obbligazione.
 * L'interazione: due pulsanti con aria-pressed evidenziano la colonna corrispondente.
 */
export function ProprietaOPrestito(_props: Props) {
  const [selezionato, setSelezionato] = useState<Prospettiva>("proprietario");

  return (
    <article className="bg-surface p-6 md:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-ink">
        Proprietario o creditore?
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted">
        Quando metti denaro in un'azienda puoi farlo in due modi
        fundamentalmente diversi. Questa distinzione è il punto di partenza
        per capire qualsiasi strumento finanziario.
      </p>

      {/* Selezione prospettiva con aria-pressed */}
      <div className="mt-6" role="group" aria-label="Seleziona la tua prospettiva">
        <p className="mb-3 text-sm font-semibold text-muted" id="etichetta-pulsanti">
          Scegli la posizione da evidenziare:
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            aria-pressed={selezionato === "proprietario"}
            onClick={() => setSelezionato("proprietario")}
            className={cn(
              "min-h-11 border-2 px-5 py-2 text-base font-semibold",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
              "motion-safe:transition-colors",
              selezionato === "proprietario"
                ? "border-accent-text bg-accent-text text-paper"
                : "border-line bg-paper text-ink hover:border-accent-text hover:text-accent-text",
            )}
          >
            Sono proprietario
          </button>
          <button
            type="button"
            aria-pressed={selezionato === "creditore"}
            onClick={() => setSelezionato("creditore")}
            className={cn(
              "min-h-11 border-2 px-5 py-2 text-base font-semibold",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
              "motion-safe:transition-colors",
              selezionato === "creditore"
                ? "border-accent-text bg-accent-text text-paper"
                : "border-line bg-paper text-ink hover:border-accent-text hover:text-accent-text",
            )}
          >
            Ho prestato
          </button>
        </div>
      </div>

      {/* Tabella di confronto */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-base">
          <caption className="sr-only">
            Confronto tra la posizione del proprietario (es. azionista) e del creditore
            (es. obbligazionista) in un'azienda ipotetica
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b-2 border-line py-3 pr-4 text-left text-sm font-semibold text-muted"
              >
                Aspetto
              </th>
              <th
                scope="col"
                className={cn(
                  "border-b-2 py-3 px-4 text-left text-sm font-semibold motion-safe:transition-colors",
                  selezionato === "proprietario"
                    ? "border-accent text-accent-text"
                    : "border-line text-muted",
                )}
              >
                Proprietario (es. azionista)
              </th>
              <th
                scope="col"
                className={cn(
                  "border-b-2 py-3 pl-4 text-left text-sm font-semibold motion-safe:transition-colors",
                  selezionato === "creditore"
                    ? "border-accent text-accent-text"
                    : "border-line text-muted",
                )}
              >
                Creditore (es. obbligazionista)
              </th>
            </tr>
          </thead>
          <tbody>
            {RIGHE.map((riga) => (
              <tr key={riga.aspetto} className="border-b border-line">
                <th
                  scope="row"
                  className="py-3 pr-4 text-left text-sm font-semibold text-ink align-top"
                >
                  {riga.aspetto}
                </th>
                <td
                  className={cn(
                    "py-3 px-4 text-base leading-relaxed align-top motion-safe:transition-colors",
                    selezionato === "proprietario"
                      ? "bg-surface text-ink"
                      : "text-muted",
                  )}
                >
                  {riga.proprietario}
                </td>
                <td
                  className={cn(
                    "py-3 pl-4 text-base leading-relaxed align-top motion-safe:transition-colors",
                    selezionato === "creditore"
                      ? "bg-surface text-ink"
                      : "text-muted",
                  )}
                >
                  {riga.creditore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conseguenza evidenziata + live region */}
      <p
        aria-live="polite"
        className="mt-6 border-l-4 border-accent bg-paper p-4 text-base leading-relaxed text-ink"
      >
        {CONSEGUENZA[selezionato]}
      </p>
    </article>
  );
}
