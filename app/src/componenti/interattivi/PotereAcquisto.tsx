import { useState, useId } from "react";
import type { TipoStrumento } from "@/dominio/tipi";
import { cn } from "@/lib/cn";

interface Props {
  strumento?: TipoStrumento;
}

const TASSI = [
  { valore: 0.01 as const, etichetta: "1% annuo" },
  { valore: 0.02 as const, etichetta: "2% annuo" },
  { valore: 0.04 as const, etichetta: "4% annuo" },
];

type Tasso = 0.01 | 0.02 | 0.04;

const fmt = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

function calcolaPotere(anni: number, tasso: number): number {
  if (anni === 0) return 100;
  return 100 / Math.pow(1 + tasso, anni);
}

/**
 * Visualizza l'erosione del potere d'acquisto nel tempo con un cursore anni
 * e tre tassi di inflazione ipotetica. Ogni valore è dichiaratamente ipotetico.
 */
export function PotereAcquisto(_props: Props) {
  const [anni, setAnni] = useState(10);
  const [tasso, setTasso] = useState<Tasso>(0.02);

  const rangeId = useId();

  const potere = calcolaPotere(anni, tasso);
  const percentualeRimanente = Math.round((potere / 100) * 100);

  const etichettaAnni =
    anni === 0 ? "oggi" : `tra ${anni} ${anni === 1 ? "anno" : "anni"}`;

  const descrizioneEsito =
    anni === 0
      ? "Con 0 anni il potere d'acquisto è invariato: 100 euro comprano quello che comprano oggi."
      : `${fmt.format(100)} tenuti fermi per ${anni} ${anni === 1 ? "anno" : "anni"} con un'inflazione ipotetica del ${(tasso * 100).toFixed(0)}% annuo ` +
        `potrebbero avere il potere d'acquisto di ${fmt.format(potere)} di oggi — ` +
        `il ${percentualeRimanente}% del valore originale.`;

  return (
    <article className="bg-surface p-4 sm:p-6 md:p-8">
      <h3 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        Il potere d'acquisto nel tempo
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted">
        La cifra sul conto non cambia. Quello che ci compri può cambiare nel tempo
        per via dell'inflazione. I tassi in questo simulatore sono{" "}
        <strong className="font-semibold text-ink">ipotetici</strong>: non sono
        previsioni né dati reali di mercato.
      </p>

      <div className="mt-8 space-y-8">
        {/* Slider anni */}
        <div>
          <label htmlFor={rangeId} className="block text-base font-semibold text-ink">
            Anni trascorsi:{" "}
            <span className="text-accent-text">
              {anni === 0 ? "nessuno (oggi)" : `${anni} ${anni === 1 ? "anno" : "anni"}`}
            </span>
          </label>
          <input
            id={rangeId}
            type="range"
            min={0}
            max={20}
            step={1}
            value={anni}
            onChange={(e) => setAnni(Number(e.target.value))}
            className={cn(
              "mt-3 w-full cursor-pointer",
              "accent-accent-text",
              "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text",
            )}
          />
          <div
            className="mt-1 flex justify-between text-sm text-muted"
            aria-hidden="true"
          >
            <span>Oggi (0)</span>
            <span>10 anni</span>
            <span>20 anni</span>
          </div>
        </div>

        {/* Selezione tasso — fieldset + legend obbligatori per un gruppo di radio */}
        <fieldset>
          <legend className="text-base font-semibold text-ink">
            Tasso di inflazione ipotetico
          </legend>
          <div className="mt-3 flex flex-wrap gap-4">
            {TASSI.map(({ valore, etichetta }) => (
              <label
                key={valore}
                className="flex min-h-11 cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="tasso-inflazione-potere-acquisto"
                  value={String(valore)}
                  checked={tasso === valore}
                  onChange={() => setTasso(valore)}
                  className={cn(
                    "h-6 w-6",
                    "accent-accent-text",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
                  )}
                />
                <span className="text-base text-ink">{etichetta}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Confronto visivo: due riquadri affiancati */}
        <div
          className="grid gap-4 sm:grid-cols-2"
          aria-hidden="true"
        >
          {/* Colonna sinistra: denaro nominale (invariato) */}
          <div className="border-2 border-line bg-paper p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              Oggi
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {fmt.format(100)}
            </p>
            <p className="mt-2 text-base text-muted">
              Sul conto — la cifra non cambia
            </p>
          </div>

          {/* Colonna destra: potere d'acquisto reale */}
          <div className="border-2 border-accent bg-paper p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              {etichettaAnni.charAt(0).toUpperCase() + etichettaAnni.slice(1)}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {fmt.format(100)}
            </p>
            <p className="mt-1 text-base text-muted">Sul conto (invariato)</p>

            <div className="mt-3 border-t border-line pt-3">
              <p className="text-sm text-muted">
                …ma acquista quanto se avessi
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-accent-text">
                {fmt.format(potere)}
              </p>
              <p className="text-sm text-muted">di oggi (ipotetico)</p>
            </div>
          </div>
        </div>

        {/* Equivalente testuale + live region */}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="border-l-4 border-accent bg-paper p-4 text-base leading-relaxed text-ink"
        >
          {descrizioneEsito}
        </p>
      </div>
    </article>
  );
}
