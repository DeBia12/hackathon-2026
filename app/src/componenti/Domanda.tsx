import { useId, useState, useEffect } from "react";
import type { ReactElement } from "react";
import type { Domanda as DomandaTipo } from "@/dominio/tipi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import "@/animazioni.css";

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

  /*
   * Slide-up del pannello di esito. Al mount del pannello (esito cambia da
   * undefined a definito) il componente parte con translate-y-4 opacity-0;
   * un requestAnimationFrame dopo la prima paint imposta esitoEntrante=true
   * e la transizione Tailwind anima la card verso translate-y-0 opacity-100.
   * Senza motion-safe le classi di traslazione non si applicano: il pannello
   * compare direttamente, senza animazione.
   */
  const [esitoEntrante, setEsitoEntrante] = useState(false);
  useEffect(() => {
    if (!mostraEsito || !esito) {
      setEsitoEntrante(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEsitoEntrante(true));
    return () => cancelAnimationFrame(raf);
  }, [mostraEsito, esito]);

  /*
   * Pop (corretto) o shake (sbagliato) sulla card selezionata.
   * Le classi animate-pop e animate-shake sono in animazioni.css, dentro
   * @media (prefers-reduced-motion: no-preference): senza animazioni attive,
   * le classi esistono ma non hanno proprietà, quindi non fanno nulla.
   */
  type TipoAnimazione = "pop" | "shake";
  const [animazione, setAnimazione] = useState<{ id: string; tipo: TipoAnimazione } | null>(null);
  useEffect(() => {
    if (!scelta || !esito) return;
    const tipo: TipoAnimazione = esito.corretta ? "pop" : "shake";
    setAnimazione({ id: scelta, tipo });
    const t = setTimeout(() => setAnimazione(null), tipo === "pop" ? 350 : 450);
    return () => clearTimeout(t);
  }, [scelta, esito]);

  return (
    <div className="w-full bg-paper rounded-brand shadow-riposo p-6 md:p-8">
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
            const corretta = giàRisposte && selezionata && esito?.corretta === true;
            const sbagliata = giàRisposte && selezionata && esito?.corretta === false;

            return (
              /*
               * .br-choice: riquadro alto, bordo 2px, raggio rounded-brand, fondo bianco.
               * La <label> avvolge tutta la riga: il target touch è l'intera area.
               * Il colore non è l'unico segnale: il radio nativo resta selezionato,
               * e i simboli ✓/✗ nel pannello di esito confermano il risultato.
               * Contrasti bordi verificati: border-verde (#007c23) su bg-verde-tenue
               * (#eafaee) = 4.97:1 AA; border-rosso (#9c2e2e) su bg-rosso-tenue
               * (#ffefef) = 6.63:1 AA. border-line (#e4e4e4) su bg-paper (#ffffff)
               * è decorativo (non è il solo indicatore di stato), esentato da 3:1.
               */
              <label
                key={opzione.id}
                htmlFor={opzioneId}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-brand border-2 px-4 py-3 min-h-11 bg-paper",
                  "motion-safe:transition-[border-color,background-color] motion-safe:duration-300",
                  corretta
                    ? "border-verde bg-verde-tenue"
                    : sbagliata
                    ? "border-rosso bg-rosso-tenue"
                    : selezionata
                    ? "border-accent-text"
                    : giàRisposte
                    ? "cursor-default border-line"
                    : "border-line hover:border-accent-text hover:bg-accent-tenue",
                  animazione?.id === opzione.id && animazione.tipo === "pop"
                    ? "animate-pop"
                    : "",
                  animazione?.id === opzione.id && animazione.tipo === "shake"
                    ? "animate-shake"
                    : "",
                )}
              >
                {/*
                 * disabled={giàRisposte}: dopo la risposta il gruppo radio è
                 * bloccato in modo nativo (niente arrow key, niente click).
                 * Il contrasto del testo non è compromesso: la <span> adiacente
                 * non eredita l'opacità di un input disabilitato — solo il
                 * cerchio radio stesso viene attenuato dal browser.
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
       * Il pannello sale dal basso con la curva a molla (ease-molla).
       * Al primo render esitoEntrante è false: con motion-safe attivo il pannello
       * parte a translate-y-4 opacity-0. Un rAF dopo la paint imposta
       * esitoEntrante=true → transition anima verso translate-y-0 opacity-100.
       * Senza motion-safe le classi motion-safe:* non si applicano: il pannello
       * compare direttamente (baseline accessibile).
       *
       * role="status" + aria-live="polite" + aria-atomic="true": annuncia l'esito
       * senza spostare il focus. Il colore non è l'unico segnale: ci sono anche
       * il simbolo (aria-hidden) e le parole "Corretto" / "Non ancora".
       *
       * Contrasti testo verificati:
       *   text-verde (#007c23) su bg-verde-tenue (#eafaee) = 4.97:1 AA
       *   text-rosso (#9c2e2e) su bg-rosso-tenue (#ffefef) = 6.63:1 AA
       * Mai bianco su verde chiaro: il testo usa sempre il token scuro.
       */}
      {mostraEsito && esito !== undefined && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "mt-6 rounded-brand p-4",
            "motion-safe:transition-[transform,opacity] motion-safe:duration-500",
            "motion-safe:[transition-timing-function:cubic-bezier(0.2,1.1,0.36,1)]",
            esitoEntrante
              ? "translate-y-0 opacity-100"
              : "motion-safe:translate-y-4 motion-safe:opacity-0",
            esito.corretta ? "bg-verde-tenue" : "bg-rosso-tenue",
          )}
        >
          <p
            className={cn(
              "font-semibold",
              esito.corretta ? "text-verde" : "text-rosso",
            )}
          >
            <span aria-hidden="true">{esito.corretta ? "✓" : "✗"}</span>{" "}
            {esito.corretta ? "Corretto" : "Non ancora"}
          </p>
          <p className="mt-2 text-base leading-relaxed text-muted">
            {esito.spiegazione}
          </p>
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
