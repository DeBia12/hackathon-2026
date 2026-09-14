import type { ReactElement } from "react";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { calcolaProfilo, confronta } from "@/dominio/punteggio";
import { CONCETTI, AREE } from "@/dominio/concetti";
import { avanzamento } from "@/dominio/percorso";
import type { ConcettoId, Concetto } from "@/dominio/tipi";
import { ConfrontoAree } from "@/componenti/ConfrontoAree";
import { DistintivoLivello } from "@/componenti/DistintivoLivello";
import { PastigliaConcetto } from "@/componenti/PastigliaConcetto";
import { Button } from "@/components/ui/Button";

// ─── Formattatori del delta complessivo ──────────────────────────────────────

function deltaTestoVisivo(delta: number): string {
  if (delta === 0) return "invariato rispetto alla valutazione iniziale";
  const segno = delta > 0 ? "+" : "−";
  return `${segno}${Math.abs(delta)} punti percentuali`;
}

function deltaSrOnly(delta: number): string {
  if (delta === 0) return "Nessuna variazione rispetto alla valutazione iniziale";
  const parola = delta > 0 ? "più" : "meno";
  return `${parola} ${Math.abs(delta)} punti percentuali rispetto alla valutazione iniziale`;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function Risultato(): ReactElement {
  const { stato, invia } = useApprendimento();

  const haValutazioneIniziale = stato.risposteIniziali.length > 0;
  const haValutazioneFinale = stato.risposteFinali.length > 0;

  const prima = calcolaProfilo(stato.risposteIniziali, CONCETTI);
  const dopo = haValutazioneFinale
    ? calcolaProfilo(stato.risposteFinali, CONCETTI)
    : prima;
  const esito = confronta(prima, dopo);

  const avanzamentoCorrente = avanzamento(stato, CONCETTI);

  // Concetti acquisiti — da padronanza, che è la fonte di verità del percorso
  const concettiAcquisiti: Concetto[] = (
    Object.entries(stato.padronanza) as Array<
      [ConcettoId, (typeof stato.padronanza)[ConcettoId]]
    >
  )
    .filter(([, p]) => p?.stato === "acquisito")
    .map(([id]) => CONCETTI[id])
    .filter((c): c is Concetto => c !== undefined);

  const andareAllaValutazioneFinale = () =>
    invia({ tipo: "vai-a", schermata: { nome: "valutazione", momento: "finale" } });

  const ricomincia = () => invia({ tipo: "azzera" });

  // ─── Caso: valutazione finale assente ───────────────────────────────────
  if (!haValutazioneFinale) {
    return (
      <div className="py-8">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          <span aria-hidden="true" className="text-accent">
            &gt;
          </span>{" "}
          {haValutazioneIniziale ? "Il tuo profilo iniziale" : "Nessuna valutazione"}
        </h1>

        <p className="mt-4 max-w-xl text-muted">
          {haValutazioneIniziale
            ? "Hai completato la valutazione iniziale. Completa anche la valutazione finale per vedere il confronto PRIMA vs DOPO."
            : "Inizia dalla valutazione iniziale per misurare il tuo punto di partenza."}
        </p>

        <div className="mt-8">
          {haValutazioneIniziale ? (
            <Button onClick={andareAllaValutazioneFinale}>
              Vai alla valutazione finale
            </Button>
          ) : (
            <Button
              onClick={() =>
                invia({
                  tipo: "vai-a",
                  schermata: { nome: "valutazione", momento: "iniziale" },
                })
              }
            >
              Inizia la valutazione
            </Button>
          )}
        </div>

        {/* Punteggi iniziali per area — solo se la valutazione è stata fatta */}
        {haValutazioneIniziale && (
          <section aria-labelledby="titolo-profilo-iniziale" className="mt-12">
            <h2
              id="titolo-profilo-iniziale"
              className="text-xl font-semibold tracking-tight text-ink"
            >
              Il tuo punto di partenza per area
            </h2>
            <ul className="mt-6 space-y-4" role="list">
              {AREE.map((area) => {
                const val = prima.perArea[area.id];
                return (
                  <li key={area.id} className="flex items-center gap-4">
                    <span className="w-48 shrink-0 text-sm font-medium text-ink">
                      {area.nome}
                    </span>
                    <div
                      role="progressbar"
                      aria-valuenow={val}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${area.nome}: ${val}%`}
                      className="h-2 flex-1 overflow-hidden bg-line"
                    >
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${val}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-sm font-medium text-ink">
                      {val}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Concetti già acquisiti nel percorso */}
        {concettiAcquisiti.length > 0 && (
          <section aria-labelledby="titolo-gia-acquisiti" className="mt-12">
            <h2
              id="titolo-gia-acquisiti"
              className="text-xl font-semibold tracking-tight text-ink"
            >
              Cosa sai già dire
            </h2>
            <ul className="mt-4 space-y-4" role="list">
              {concettiAcquisiti.map((c) => (
                <li key={c.id} className="flex flex-col items-start gap-1.5">
                  <PastigliaConcetto nome={c.nome} stato="acquisito" />
                  <p className="text-sm text-muted">{c.inUnaRiga}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // ─── Caso principale: entrambe le valutazioni presenti ──────────────────
  return (
    <div className="py-8">
      {/* Un solo h1 per pagina */}
      <h1 className="text-4xl font-semibold tracking-tight text-ink">
        <span aria-hidden="true" className="text-accent">
          &gt;
        </span>{" "}
        Il tuo progresso
      </h1>

      {/* Il principio del prodotto — font serif per la voce editoriale */}
      <blockquote className="mt-6 border-l-2 border-accent pl-5 font-serif text-xl font-light text-muted">
        Non misuriamo quanti contenuti hai letto. Misuriamo cosa hai capito.
      </blockquote>

      {/* ── Blocco 1: il numero grande ── */}
      {/*
       * È l'elemento dominante della pagina: due numeri enormi con la freccia.
       * Il senso è nel testo — la freccia è aria-hidden.
       * aria-live="polite" annuncia il delta appena renderizzato.
       */}
      <section aria-labelledby="titolo-punteggio" className="mt-14">
        <h2
          id="titolo-punteggio"
          className="text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Punteggio complessivo di alfabetizzazione finanziaria
        </h2>

        <div className="mt-6 flex flex-wrap items-end gap-4 sm:gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Prima
            </p>
            {/* Testo enorme: l'elemento più grande della pagina */}
            <p className="text-[clamp(4rem,12vw,7rem)] font-semibold leading-none tracking-tight text-ink">
              {prima.complessivo}%
            </p>
          </div>

          {/* Freccia decorativa */}
          <span
            aria-hidden="true"
            className="pb-2 text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-none text-accent"
          >
            →
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Dopo
            </p>
            <p className="text-[clamp(4rem,12vw,7rem)] font-semibold leading-none tracking-tight text-accent-text">
              {dopo.complessivo}%
            </p>
          </div>
        </div>

        {/* Delta in evidenza — mai solo colore: c'è sempre il segno e il testo sr-only */}
        <p
          className="mt-5 text-2xl font-medium text-ink"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">{deltaSrOnly(esito.deltaComplessivo)}</span>
          <span aria-hidden="true">{deltaTestoVisivo(esito.deltaComplessivo)}</span>
        </p>
      </section>

      {/* ── Blocco 2: confronto per area ── */}
      <section aria-labelledby="titolo-aree" className="mt-14">
        <h2
          id="titolo-aree"
          className="text-xl font-semibold tracking-tight text-ink"
        >
          Il confronto per area
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tutte e cinque le aree, anche quelle invariate.
        </p>
        <div className="mt-6">
          <ConfrontoAree esito={esito} />
        </div>
      </section>

      {/* ── Blocco 3: cosa sai dire adesso ── */}
      <section aria-labelledby="titolo-concetti" className="mt-14">
        <h2
          id="titolo-concetti"
          className="text-xl font-semibold tracking-tight text-ink"
        >
          Cosa sai dire adesso
        </h2>
        <p className="mt-1 text-sm text-muted">
          Non «hai letto 6 moduli», ma cosa puoi spiegare con parole tue.
        </p>

        {concettiAcquisiti.length === 0 ? (
          <p className="mt-4 text-muted">
            Nessun concetto ancora acquisito. Continua il percorso e poi
            rifai la valutazione finale.
          </p>
        ) : (
          <ul className="mt-6 space-y-5" role="list">
            {concettiAcquisiti.map((c) => (
              <li key={c.id} className="flex flex-col items-start gap-1.5">
                <PastigliaConcetto nome={c.nome} stato="acquisito" />
                <p className="text-sm text-muted">{c.inUnaRiga}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Chiusura: livello raggiunto e pulsante ricomincia ── */}
      <section
        className="mt-14 border-t border-line pt-8"
        aria-label="Livello raggiunto e opzioni"
      >
        <DistintivoLivello
          livello={avanzamentoCorrente.livello}
          concettiAcquisiti={avanzamentoCorrente.concettiAcquisiti}
          concettiTotali={avanzamentoCorrente.concettiTotali}
        />

        <p className="mt-4 max-w-md text-sm text-muted">
          Il livello riflette i concetti che hai dimostrato di aver capito,
          non quelli che hai solo letto.
        </p>

        <div className="mt-8">
          <Button variante="secondario" onClick={ricomincia}>
            Ricomincia dall'inizio
          </Button>
        </div>
      </section>
    </div>
  );
}
