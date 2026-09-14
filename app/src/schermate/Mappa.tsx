import type { ReactElement } from "react";
import type { ConcettoId, Schermata } from "@/dominio/tipi";
import { MODULI, LEZIONI } from "@/dominio/moduli";
import { CONCETTI } from "@/dominio/concetti";
import { avanzamento, statoModuli } from "@/dominio/percorso";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { DistintivoLivello } from "@/componenti/DistintivoLivello";
import { BarraProgresso } from "@/componenti/BarraProgresso";
import { RigaModulo } from "@/componenti/RigaModulo";
import type { ConcettoConStato } from "@/componenti/RigaModulo";
import { Button } from "@/components/ui/Button";

// ─── Aiutante puro — concetti di un modulo ───────────────────────────────────

/*
 * Deriva i concetti di un modulo leggendo le lezioni che lo compongono.
 * Deduplica: una stessa ConcettoId non compare due volte nella lista.
 * È definito fuori dal componente per non essere ricreato a ogni render.
 */
function concettiDelModulo(modulo: (typeof MODULI)[number]): ConcettoId[] {
  const ids: ConcettoId[] = [];
  for (const lezioneId of modulo.lezioni) {
    const lez = LEZIONI[lezioneId]; // Lezione | undefined (LezioneId = string)
    if (!lez) continue;
    for (const c of lez.concetti) {
      if (!ids.includes(c)) ids.push(c);
    }
  }
  return ids;
}

// ─── Schermata ────────────────────────────────────────────────────────────────

export function Mappa(): ReactElement {
  const { stato, invia } = useApprendimento();

  // Avanzamento: livello e percentuale derivano dai concetti `acquisito`,
  // non dalle pagine viste. È un principio del prodotto.
  const av = avanzamento(stato, CONCETTI);

  // Stato di ogni modulo secondo le regole di sblocco sequenziale.
  const statiModuli = statoModuli(MODULI, stato);

  const tuttiCompletati = MODULI.every(
    (m) => statiModuli[m.id] === "completato",
  );
  const moduliRimanenti = MODULI.filter(
    (m) => statiModuli[m.id] !== "completato",
  ).length;

  // Se la valutazione finale è già stata fatta, offre il collegamento al risultato.
  const haRisultato = stato.risposteFinali.length > 0;

  function naviga(schermata: Schermata): void {
    invia({ tipo: "vai-a", schermata });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* ── Sezione: dove sei — card bianca su fondo lavanda ─────────────── */}
      <section aria-labelledby="titolo-percorso" className="mb-10">
        <div className="rounded-brand bg-paper p-5 shadow-riposo sm:p-6">
          <h1
            id="titolo-percorso"
            className="mb-6 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Il tuo percorso
          </h1>

          {/* Livello e XP */}
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <DistintivoLivello
              livello={av.livello}
              concettiAcquisiti={av.concettiAcquisiti}
              concettiTotali={av.concettiTotali}
            />
            <p className="text-sm text-muted">
              {av.xp}&thinsp;XP
            </p>
          </div>

          {/* Barra di progresso estesa */}
          <BarraProgresso
            valore={av.percentuale}
            etichetta="Concetti acquisiti"
          />

          {/*
           * Spiega come funziona il progresso — è un principio del prodotto:
           * contiamo la comprensione dimostrata, non le pagine lette.
           */}
          <p className="mt-3 text-sm text-muted">
            La percentuale misura i concetti che hai dimostrato di aver capito,
            non quante pagine hai letto.
          </p>

          {/* Quanti concetti mancano al livello successivo */}
          {av.prossimoLivello !== undefined && (
            <p className="mt-2 text-sm text-muted">
              Mancano{" "}
              <strong className="font-medium text-ink">
                {av.concettiAlProssimoLivello}
              </strong>{" "}
              {av.concettiAlProssimoLivello === 1 ? "concetto" : "concetti"} per
              raggiungere il livello{" "}
              <strong className="font-medium text-ink">
                {av.prossimoLivello}
              </strong>
              .
            </p>
          )}
        </div>
      </section>

      {/* ── Sezione: i sei moduli ─────────────────────────────────────────── */}
      <section aria-labelledby="titolo-moduli" className="mb-10">
        <h2
          id="titolo-moduli"
          className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Moduli
        </h2>

        {/*
         * <ol> perché l'ordine è semanticamente rilevante:
         * ogni modulo si sblocca solo dopo il precedente.
         * Le card sono distanziate con gap invece dei divisori a linea.
         */}
        <ol className="flex flex-col gap-3">
          {MODULI.map((modulo, idx) => {
            const statoModulo = statiModuli[modulo.id];
            const moduloPrecedente = idx > 0 ? MODULI[idx - 1] : undefined;

            // Deriva i concetti del modulo con il loro stato di padronanza corrente.
            const concetti: ConcettoConStato[] = concettiDelModulo(modulo).map(
              (id) => {
                const def = CONCETTI[id];
                const pad = stato.padronanza[id];
                return {
                  id,
                  nome: def.nome,
                  stato: pad?.stato ?? "ignoto",
                };
              },
            );

            return (
              <RigaModulo
                key={modulo.id}
                modulo={modulo}
                stato={statoModulo}
                concetti={concetti}
                moduloPrecedente={moduloPrecedente}
                onClick={() =>
                  naviga({ nome: "modulo", modulo: modulo.id })
                }
              />
            );
          })}
        </ol>
      </section>

      {/* ── Sezione: valutazione finale ──────────────────────────────────── */}
      <section aria-labelledby="titolo-valutazione" className="mb-10">
        <h2
          id="titolo-valutazione"
          className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Valutazione finale
        </h2>

        {tuttiCompletati ? (
          /*
           * Tutti i moduli completati: CTA principale in evidenza.
           */
          <div className="rounded-brand bg-paper p-5 shadow-riposo sm:p-6">
            <p className="mb-2 font-semibold text-ink">
              Hai completato tutti i moduli.
            </p>
            <p className="mb-6 text-sm text-muted">
              Risponderai a cinque nuove domande — diverse da quelle iniziali —
              per misurare quanto hai imparato. Il confronto prima/dopo sarà
              il risultato concreto del tuo percorso.
            </p>
            <Button
              variante="primario"
              onClick={() => naviga({ nome: "valutazione", momento: "finale" })}
            >
              Rimisuriamo quello che sai
            </Button>
          </div>
        ) : (
          /*
           * Moduli non ancora completati: il blocco è visibile ma spiega dove
           * si va a finire. Sapere la destinazione aiuta a proseguire.
           */
          <div className="rounded-brand bg-surface p-5 sm:p-6">
            <p className="text-sm text-muted">
              La valutazione finale si sblocca dopo aver completato tutti e
              sei i moduli.{" "}
              {moduliRimanenti === 1
                ? "Manca ancora un modulo."
                : `Mancano ancora ${moduliRimanenti} moduli.`}
            </p>
            <p className="mt-2 text-sm text-muted">
              Alla fine risponderai a cinque nuove domande sugli stessi concetti
              del punto di partenza: vedrai quanto è cresciuta la tua
              comprensione.
            </p>
          </div>
        )}

        {/* Collegamento ai risultati già calcolati (demo: si torna spesso) */}
        {haRisultato && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => naviga({ nome: "risultato" })}
              className={[
                "text-sm font-medium text-accent-text",
                "underline underline-offset-4",
                "focus-visible:outline-2 focus-visible:outline-accent-text",
                "focus-visible:outline-offset-2",
              ].join(" ")}
            >
              Torna ai risultati della valutazione
            </button>
          </div>
        )}
      </section>

      {/* ── Accesso diretto — per la presentazione ────────────────────────── */}
      {/*
       * Un pulsante secondario sempre attivo per la demo dal vivo.
       * Durante la presentazione non c'è tempo per completare sei moduli:
       * questo permette di raggiungere subito il momento wow.
       * L'etichetta è onesta: la giuria può vederlo, va bene così.
       */}
      <div className="border-t border-line pt-6">
        <p className="mb-3 text-xs text-muted">Accesso diretto per la presentazione:</p>
        <Button
          variante="secondario"
          onClick={() => naviga({ nome: "valutazione", momento: "finale" })}
        >
          Vai alla valutazione finale
        </Button>
      </div>
    </div>
  );
}
