import type { ReactElement } from "react";
import type { Confronto } from "@/dominio/punteggio";
import { AREE } from "@/dominio/concetti";

interface PropsConfrontoAree {
  esito: Confronto;
}

interface DeltaFormattato {
  visivo: string;
  srOnly: string;
}

function formatDelta(delta: number): DeltaFormattato {
  if (delta === 0) return { visivo: "=", srOnly: "invariato" };
  if (delta > 0)
    return { visivo: `+${delta}`, srOnly: `più ${delta} punti` };
  return {
    visivo: `−${Math.abs(delta)}`,
    srOnly: `meno ${Math.abs(delta)} punti`,
  };
}

/**
 * Tabella semantica PRIMA vs DOPO per le cinque aree.
 * Le barre sono decorative (aria-hidden): il dato è nelle celle numeriche.
 * Il delta è trasmesso da segno + testo sr-only, mai solo dal colore.
 */
export function ConfrontoAree({ esito }: PropsConfrontoAree): ReactElement {
  /*
   * Sotto i ~340px di larghezza la tabella non ci sta piu' nemmeno con le
   * colonne fluide e scorre di lato: il contenitore e' quindi un region con
   * tabIndex={0}, perche' una zona scorrevole va raggiunta anche da tastiera
   * (WCAG 2.1.1). Da 375px in su non scorre affatto.
   */
  return (
    <div
      role="region"
      aria-label="Confronto dei punteggi per area, prima e dopo"
      tabIndex={0}
      className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
    >
      <table
        className="w-full border-collapse text-sm"
        aria-label="Confronto dei punteggi per area di competenza — prima e dopo il percorso"
      >
        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="pb-3 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted sm:pr-6 sm:tracking-widest"
            >
              Area
            </th>
            <th
              scope="col"
              className="pb-3 pr-2 text-right text-xs font-semibold uppercase tracking-wide text-muted sm:w-20 sm:pr-4 sm:tracking-widest"
            >
              Prima
            </th>
            <th
              scope="col"
              className="pb-3 pr-2 text-right text-xs font-semibold uppercase tracking-wide text-ink sm:w-20 sm:pr-4 sm:tracking-widest"
            >
              Dopo
            </th>
            <th
              scope="col"
              className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-ink sm:w-28 sm:tracking-widest"
            >
              Variazione
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {AREE.map((area) => {
            const valPrima = esito.prima.perArea[area.id];
            const valDopo = esito.dopo.perArea[area.id];
            const delta = esito.deltaPerArea[area.id];
            const { visivo, srOnly } = formatDelta(delta);

            // Colore pastiglia: supplemento visivo — il segno e il sr-only portano il significato
            const classiPastiglia =
              delta > 0
                ? "bg-accent-tenue text-accent-text"
                : "bg-surface text-muted";

            return (
              <tr key={area.id}>
                {/* th scope="row": ogni riga ha un'intestazione → la tabella è navigabile */}
                <th
                  scope="row"
                  className="py-4 pr-3 text-left font-medium text-ink align-top sm:py-5 sm:pr-6"
                >
                  <span>{area.nome}</span>

                  {/* Barre decorative affiancate — supplemento visivo, non la fonte del dato */}
                  <div
                    className="mt-2 flex gap-1.5"
                    aria-hidden="true"
                  >
                    {/* Barra prima (grigia) */}
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-muted motion-safe:transition-[width] motion-safe:duration-[550ms] motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]"
                        style={{ width: `${valPrima}%` }}
                      />
                    </div>
                    {/* Barra dopo (verde) */}
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-[550ms] motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]"
                        style={{ width: `${valDopo}%` }}
                      />
                    </div>
                  </div>
                </th>

                <td className="py-4 pr-2 text-right tabular-nums text-muted align-top sm:py-5 sm:pr-4">
                  {valPrima}%
                </td>

                <td className="py-4 pr-2 text-right tabular-nums font-medium text-ink align-top sm:py-5 sm:pr-4">
                  {valDopo}%
                </td>

                <td className="py-4 align-top sm:py-5">
                  {/* sr-only porta il testo completo; il visivo ha il segno ma l'assistente legge sr-only */}
                  <span className="sr-only">{srOnly}</span>
                  <div className="flex justify-end" aria-hidden="true">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold sm:px-3 ${classiPastiglia}`}
                    >
                      {visivo}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
