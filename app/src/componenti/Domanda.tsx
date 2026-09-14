import { useId } from "react";
import type { ReactElement } from "react";
import type { Domanda as DomandaTipo } from "@/dominio/tipi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface PropsDomanda {
  domanda: DomandaTipo;
  /** Indice e totale, per "Domanda 2 di 5". Assente nelle lezioni. */
  posizione?: { corrente: number; totale: number };
  /** L'opzione scelta, se già risposto. */
  scelta?: string;
  /** Mostrato dopo la risposta. Il chiamante lo calcola col motore adattivo. */
  esito?: { corretta: boolean; spiegazione: string };
  /** Assente durante le valutazioni: lì l'esito non si mostra subito. */
  mostraEsito?: boolean;
  onRispondi: (idOpzione: string) => void;
  onAvanti?: () => void;
  etichettaAvanti?: string;
}

export function Domanda({
  domanda,
  posizione,
  scelta,
  esito,
  mostraEsito = false,
  onRispondi,
  onAvanti,
  etichettaAvanti = "Avanti",
}: PropsDomanda): ReactElement {
  /*
   * useId garantisce id stabili e unici anche con più istanze di Domanda
   * sullo stesso albero (es. valutazione + remediation in parallelo).
   */
  const gruppoId = useId();
  const giàRisposte = scelta !== undefined;

  return (
    <div className="w-full">
      {/*
       * Il contatore è aria-hidden: è già incluso nella <legend> (sr-only)
       * per evitare che gli screen reader lo leggano due volte.
       */}
      {posizione !== undefined && (
        <p
          className="mb-4 text-sm font-medium text-muted"
          aria-hidden="true"
        >
          Domanda {posizione.corrente} di {posizione.totale}
        </p>
      )}

      {/*
       * <fieldset> + <legend>: il pattern nativo per gruppi radio.
       * Dà frecce, Home/End e annuncio corretto SENZA role="radio" fatto a mano.
       */}
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-6 text-xl font-semibold leading-snug tracking-tight text-ink">
          {posizione !== undefined && (
            <span className="sr-only">
              Domanda {posizione.corrente} di {posizione.totale}:{" "}
            </span>
          )}
          {domanda.testo}
        </legend>

        <div className="flex flex-col gap-3">
          {domanda.opzioni.map((opzione) => {
            const opzioneId = `${gruppoId}-${opzione.id}`;
            const selezionata = scelta === opzione.id;

            return (
              /*
               * La <label> avvolge tutta la riga: il target touch è l'intera
               * area, non solo il cerchio del radio. Soddisfa WCAG 2.2 target 24×24.
               */
              <label
                key={opzione.id}
                htmlFor={opzioneId}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border-2 px-4 py-3",
                  "motion-safe:transition-colors motion-safe:duration-[550ms]",
                  "motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]",
                  giàRisposte ? "cursor-default" : "hover:border-accent-text",
                  selezionata ? "border-accent" : "border-line",
                )}
              >
                {/*
                 * disabled={giàRisposte}: dopo la risposta il gruppo radio è
                 * bloccato in modo nativo (niente arrow key, niente click).
                 * Il contrasto del testo non è compromesso: la <span> adiacente
                 * non eredita l'opacità di un input disabilitato — solo il
                 * cerchio radio stesso viene attenuato dal browser, il che è
                 * un segnale visivo appropriato di "non modificabile".
                 */}
                <input
                  id={opzioneId}
                  type="radio"
                  name={`${gruppoId}-gruppo`}
                  value={opzione.id}
                  checked={selezionata}
                  disabled={giàRisposte}
                  onChange={() => {
                    if (!giàRisposte) onRispondi(opzione.id);
                  }}
                  className="mt-0.5 h-6 w-6 flex-shrink-0 accent-accent-text"
                />
                <span className="text-base leading-relaxed text-ink">
                  {opzione.testo}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/*
       * role="status" + aria-live="polite": annuncia l'esito senza spostare il
       * focus. aria-atomic="true" garantisce che la frase sia letta per intero.
       * L'esito non è veicolato dal solo colore: c'è anche il simbolo (aria-hidden)
       * e la parola "Corretto" / "Non ancora".
       */}
      {mostraEsito && esito !== undefined && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-6 border-2 border-line bg-surface p-4"
        >
          <p className="font-semibold text-ink">
            <span aria-hidden="true">{esito.corretta ? "✓" : "✗"}</span>{" "}
            {esito.corretta ? "Corretto" : "Non ancora"}
          </p>
          <p className="mt-2 text-muted">{esito.spiegazione}</p>
        </div>
      )}

      {onAvanti !== undefined && giàRisposte && (
        <div className="mt-6">
          <Button onClick={onAvanti}>{etichettaAvanti}</Button>
        </div>
      )}
    </div>
  );
}
