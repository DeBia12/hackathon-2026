import { useId, useState, useEffect, useMemo } from "react";
import type { ReactElement } from "react";
import type { Domanda as DomandaTipo } from "@/dominio/tipi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { mescola } from "@/lib/mescola";

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
  /** Etichetta del passo di conferma, presente solo quando c'è un esito da rivelare. */
  etichettaConferma?: string;
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
  etichettaConferma = "Conferma",
}: PropsDomanda): ReactElement {
  /*
   * useId garantisce id stabili e unici anche con più istanze di Domanda
   * sullo stesso albero (es. valutazione + remediation in parallelo).
   */
  const gruppoId = useId();
  const giàRisposte = scelta !== undefined;

  /*
   * Ordine delle opzioni mescolato a ogni presentazione della domanda: nella
   * banca la risposta corretta cadeva quasi sempre in terza posizione.
   * `corretta` è un id, non un indice, quindi la valutazione non ne risente.
   * useMemo sull'id tiene l'ordine stabile finché la domanda resta a schermo:
   * rimescolare a ogni render sposterebbe le opzioni sotto le dita di chi
   * naviga da tastiera o con uno screen reader.
   */
  const opzioni = useMemo(() => mescola(domanda.opzioni), [domanda.id]);

  /*
   * `selezione` è la scelta ancora modificabile, `scelta` quella confermata dal
   * chiamante. Quando c'è un esito da rivelare la conferma è un passo a sé:
   * finché non la premi puoi cambiare idea. Senza esito (le valutazioni) la
   * selezione si propaga subito e resta modificabile fino all'avanzamento.
   */
  const [selezione, setSelezione] = useState<string | undefined>(scelta);
  useEffect(() => {
    setSelezione(scelta);
  }, [scelta, domanda.id]);

  const evidenziata = giàRisposte ? scelta : selezione;
  const bloccato = giàRisposte && mostraEsito;

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
    <div className="w-full bg-paper rounded-brand shadow-riposo p-5 sm:p-6 md:p-8">
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
        <legend className="mb-6 text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
          {posizione !== undefined && (
            <span className="sr-only">
              Domanda {posizione.corrente} di {posizione.totale}:{" "}
            </span>
          )}
          {domanda.testo}
        </legend>

        <div className="flex flex-col gap-3">
          {opzioni.map((opzione) => {
            const opzioneId = `${gruppoId}-${opzione.id}`;
            const selezionata = evidenziata === opzione.id;
            const corretta = mostraEsito && selezionata && esito?.corretta === true;
            const sbagliata = mostraEsito && selezionata && esito?.corretta === false;

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
                    ? "border-accent-text bg-accent-tenue"
                    : bloccato
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
                 * disabled solo dopo che l'esito è stato rivelato: prima di
                 * quel momento la scelta resta modificabile.
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
                  disabled={bloccato}
                  onChange={() => {
                    if (bloccato) return;
                    setSelezione(opzione.id);
                    // Senza esito da rivelare la scelta si propaga subito: il
                    // passo di conferma raddoppierebbe i clic senza dare nulla.
                    if (!mostraEsito) onRispondi(opzione.id);
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

      {/*
       * Un pulsante per volta: prima si conferma, poi si avanza. Il pulsante
       * resta disabilitato finché non c'è una selezione, con il motivo scritto
       * in chiaro sotto (WCAG 3.3.2): lo stato visivo non è l'unico segnale.
       */}
      {mostraEsito && !giàRisposte && (
        <div className="mt-6 space-y-2">
          {/*
           * aria-disabled invece di disabled: il pulsante resta raggiungibile da
           * tastiera anche prima di aver scelto, così chi naviga con Tab scopre
           * che esiste e legge, via aria-describedby, che cosa manca per usarlo.
           */}
          <Button
            onClick={() => {
              if (selezione !== undefined) onRispondi(selezione);
            }}
            aria-disabled={selezione === undefined}
            aria-describedby={`${gruppoId}-aiuto`}
            className={cn(selezione === undefined && "opacity-50")}
          >
            {etichettaConferma}
          </Button>
          <p id={`${gruppoId}-aiuto`} className="text-sm text-muted">
            {selezione === undefined
              ? "Scegli una risposta per continuare."
              : "Puoi cambiare risposta finché non confermi."}
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
