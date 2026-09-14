import { useState } from "react";
import type { TipoStrumento } from "@/dominio/tipi";
import { cn } from "@/lib/cn";

interface Props {
  strumento?: TipoStrumento;
}

const CAPITALE = 1_000;
const N_AZIENDE = 10;
const QUOTA = CAPITALE / N_AZIENDE; // 100 per azienda in B
const PERDITA_PERCENTUALE = 0.5; // l'azienda colpita perde il 50%

const fmt = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function segnoVariazione(v: number): string {
  if (v === 0) return "Invariato";
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}

/**
 * Confronto interattivo tra concentrazione e distribuzione del capitale.
 * Un singolo evento ipotetico mostra come il peso cambia nei due scenari.
 * La conclusione descrive il meccanismo — non prescrive la scelta.
 */
export function Diversificazione(_props: Props) {
  const [eventoApplicato, setEventoApplicato] = useState(false);

  const totaleA = eventoApplicato
    ? CAPITALE * PERDITA_PERCENTUALE
    : CAPITALE;
  const variazPercA = eventoApplicato ? -50 : 0;

  const totaleB = eventoApplicato
    ? CAPITALE - QUOTA * PERDITA_PERCENTUALE
    : CAPITALE;
  const variazPercB = eventoApplicato
    ? -((QUOTA * PERDITA_PERCENTUALE) / CAPITALE) * 100
    : 0;

  // Altezze per il grafico SVG (viewBox 0 0 100 80)
  const SVG_H = 80;
  const altezzaA = eventoApplicato ? SVG_H * PERDITA_PERCENTUALE : SVG_H;

  const descrizioneAccessibile = eventoApplicato
    ? `Scenario A: il totale è sceso a ${fmt.format(totaleA)}, variazione ${segnoVariazione(variazPercA)} rispetto ai ${fmt.format(CAPITALE)} iniziali. ` +
      `Scenario B: il totale è ${fmt.format(totaleB)}, variazione ${segnoVariazione(variazPercB)} rispetto ai ${fmt.format(CAPITALE)} iniziali.`
    : `Entrambi gli scenari partono dallo stesso capitale ipotetico di ${fmt.format(CAPITALE)}.`;

  return (
    <article className="bg-surface p-6 md:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-ink">
        Cosa cambia distribuire
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted">
        Due scenari con lo stesso capitale{" "}
        <strong className="font-semibold text-ink">ipotetico</strong> di{" "}
        {fmt.format(CAPITALE)}. L'evento che puoi applicare è puramente
        ipotetico — non riflette andamenti reali.
      </p>

      {/* Pulsante evento — posizionato prima delle barre per logica di lettura */}
      <div className="mt-6">
        <button
          type="button"
          aria-pressed={eventoApplicato}
          onClick={() => setEventoApplicato((v) => !v)}
          className={cn(
            "min-h-11 border-2 px-6 py-2 text-base font-semibold",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
            "motion-safe:transition-colors",
            eventoApplicato
              ? "border-line bg-surface text-ink hover:border-accent-text hover:text-accent-text"
              : "border-accent-text bg-accent-text text-paper hover:bg-accent-deep",
          )}
        >
          {eventoApplicato
            ? "Azzera l'evento ipotetico"
            : "Applica evento negativo ipotetico a una sola azienda"}
        </button>
        {eventoApplicato && (
          <p className="mt-2 text-sm font-semibold text-ink">
            Una delle aziende ha perso il 50% del suo valore (scenario ipotetico).
          </p>
        )}
      </div>

      {/* Scenari affiancati */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Scenario A — concentrato */}
        <div className="border-2 border-line bg-paper p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Scenario A
          </p>
          <p className="mt-1 text-base font-semibold text-ink">
            Tutto su una sola azienda
          </p>

          {/* Grafico SVG — aria-hidden perché il totale è in testo */}
          <div
            className="mt-4 border-b-2 border-line"
            aria-hidden="true"
          >
            <svg
              viewBox={`0 0 100 ${SVG_H}`}
              preserveAspectRatio="none"
              className="h-24 w-full"
            >
              <rect
                x={20}
                y={SVG_H - altezzaA}
                width={60}
                height={altezzaA}
                className={cn(
                  eventoApplicato ? "fill-muted" : "fill-accent",
                  "motion-safe:transition-all motion-safe:duration-[550ms]",
                )}
              />
            </svg>
          </div>

          {/* Totale in testo — sempre visibile */}
          <div className="mt-3">
            <p className="text-3xl font-semibold tracking-tight text-ink">
              {fmt.format(totaleA)}
            </p>
            {eventoApplicato && (
              <p className="mt-1 text-sm font-semibold text-accent-text">
                {segnoVariazione(variazPercA)} rispetto a {fmt.format(CAPITALE)}
              </p>
            )}
          </div>
        </div>

        {/* Scenario B — distribuito */}
        <div className="border-2 border-line bg-paper p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Scenario B
          </p>
          <p className="mt-1 text-base font-semibold text-ink">
            Distribuito su {N_AZIENDE} aziende
          </p>

          {/* Grafico SVG — aria-hidden perché il totale è in testo */}
          <div
            className="mt-4 border-b-2 border-line"
            aria-hidden="true"
          >
            <svg
              viewBox={`0 0 100 ${SVG_H}`}
              preserveAspectRatio="none"
              className="h-24 w-full"
            >
              {Array.from({ length: N_AZIENDE }, (_, i) => {
                const colpita = eventoApplicato && i === 0;
                const h = colpita ? SVG_H * PERDITA_PERCENTUALE : SVG_H;
                const x = i * 10 + 1;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={SVG_H - h}
                    width={8}
                    height={h}
                    className={cn(
                      colpita ? "fill-muted" : "fill-accent",
                      "motion-safe:transition-all motion-safe:duration-[550ms]",
                    )}
                  />
                );
              })}
            </svg>
          </div>

          {/* Totale in testo — sempre visibile */}
          <div className="mt-3">
            <p className="text-3xl font-semibold tracking-tight text-ink">
              {fmt.format(totaleB)}
            </p>
            {eventoApplicato && (
              <p className="mt-1 text-sm font-semibold text-accent-text">
                {segnoVariazione(variazPercB)} rispetto a {fmt.format(CAPITALE)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Equivalente testuale + live region */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 bg-paper p-4 text-base leading-relaxed text-ink"
      >
        {descrizioneAccessibile}
      </p>

      {/* Nota educativa — descrive il meccanismo, non prescrive una scelta */}
      <p className="mt-4 border-l-4 border-accent pl-4 text-base leading-relaxed text-ink">
        Distribuire cambia quanto un singolo evento pesa sul totale.
      </p>
    </article>
  );
}
