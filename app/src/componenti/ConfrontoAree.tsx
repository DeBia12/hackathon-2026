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
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-sm"
        aria-label="Confronto dei punteggi per area di competenza — prima e dopo il percorso"
      >
        <thead>
          <tr className="border-b-2 border-ink">
            <th
              scope="col"
              className="pb-3 pr-6 text-left text-xs font-semibold uppercase tracking-widest text-muted"
            >
              Area
            </th>
            <th
              scope="col"
              className="pb-3 pr-4 text-right text-xs font-semibold uppercase tracking-widest text-muted w-20"
            >
              Prima
            </th>
            <th
              scope="col"
              className="pb-3 pr-4 text-right text-xs font-semibold uppercase tracking-widest text-ink w-20"
            >
              Dopo
            </th>
            <th
              scope="col"
              className="pb-3 text-right text-xs font-semibold uppercase tracking-widest text-ink w-24"
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

            // Il colore del delta è un supplemento: il segno e il sr-only portano il significato
            const coloreDelta =
              delta > 0
                ? "text-accent-text"
                : delta < 0
                  ? "text-ink"
                  : "text-muted";

            return (
              <tr key={area.id}>
                {/* th scope="row": ogni riga ha un'intestazione → la tabella è navigabile */}
                <th
                  scope="row"
                  className="py-4 pr-6 text-left font-medium text-ink align-top"
                >
                  <span>{area.nome}</span>

                  {/* Barre decorative affiancate — supplemento visivo, non la fonte del dato */}
                  <div
                    className="mt-2 flex gap-1"
                    aria-hidden="true"
                  >
                    {/* Barra prima (grigia) */}
                    <div className="relative h-1.5 flex-1 overflow-hidden bg-line">
                      <div
                        className="absolute inset-y-0 left-0 bg-muted motion-safe:transition-[width] motion-safe:duration-[550ms] motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]"
                        style={{ width: `${valPrima}%` }}
                      />
                    </div>
                    {/* Barra dopo (viola) */}
                    <div className="relative h-1.5 flex-1 overflow-hidden bg-line">
                      <div
                        className="absolute inset-y-0 left-0 bg-accent motion-safe:transition-[width] motion-safe:duration-[550ms] motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]"
                        style={{ width: `${valDopo}%` }}
                      />
                    </div>
                  </div>
                </th>

                <td className="py-4 pr-4 text-right tabular-nums text-muted align-top">
                  {valPrima}%
                </td>

                <td className="py-4 pr-4 text-right tabular-nums font-medium text-ink align-top">
                  {valDopo}%
                </td>

                <td className="py-4 text-right tabular-nums font-semibold align-top">
                  {/* sr-only porta il testo completo; il visivo ha il segno ma l'assistente legge sr-only */}
                  <span className="sr-only">{srOnly}</span>
                  <span aria-hidden="true" className={coloreDelta}>
                    {visivo}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
