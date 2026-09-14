import type { ReactElement } from "react";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { Button } from "@/components/ui/Button";

export function Trasparenza(): ReactElement {
  const { stato, invia } = useApprendimento();

  const percorsoIniziato = stato.risposteIniziali.length > 0;
  const valutazioneFinaleFatta = stato.risposteFinali.length > 0;

  /*
   * Se il percorso è già iniziato, "indietro" torna alla mappa.
   * Altrimenti torna al benvenuto: la schermata precedente sensata
   * per chi arriva dal link nel piè di pagina prima di iniziare.
   */
  function torna(): void {
    if (percorsoIniziato) {
      invia({ tipo: "vai-a", schermata: { nome: "mappa" } });
    } else {
      invia({ tipo: "vai-a", schermata: { nome: "benvenuto" } });
    }
  }

  return (
    <div className="max-w-prose">
      {/* Navigazione rapida in cima — tastiera e screen reader trovano il ritorno subito */}
      <button
        type="button"
        onClick={torna}
        className="mb-10 text-sm font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
      >
        ← Torna indietro
      </button>

      <h1 className="text-4xl font-semibold tracking-tight text-ink">
        Come funziona Capitolo Zero
      </h1>

      {/* ================================================================
          Sezione 1 — Risk & Clarity Note
          Dice con chiarezza cosa lo strumento NON fa.
          È la parte più importante: deve essere la più leggibile, non la
          più legale. Nessun gergo da disclaimer.
          ================================================================ */}
      <section aria-labelledby="titolo-limiti" className="mt-16">
        <h2
          id="titolo-limiti"
          className="font-serif text-2xl font-light tracking-tight text-ink"
        >
          Che cosa è questo strumento — e cosa non è
        </h2>

        <p className="mt-6 text-muted">
          Capitolo Zero è uno strumento didattico. Ti aiuta a capire i concetti
          finanziari di base. Non ti dice cosa fare con i tuoi soldi.
        </p>

        {/* Card chiara per l'elenco dei limiti — si legge senza sforzo */}
        <div className="mt-6 rounded-brand bg-paper p-6 shadow-riposo">
          <p className="font-semibold text-ink">Non fa queste cose:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>consiglia dove mettere i tuoi soldi</li>
            <li>suggerisce cosa comprare o vendere</li>
            <li>confronta prodotti finanziari e dice qual è il migliore</li>
            <li>prevede quanto guadagnerai</li>
            <li>crea un tuo profilo finanziario personale</li>
            <li>usa dati di mercato in tempo reale</li>
          </ul>

          <p className="mt-6 font-semibold text-ink">Garantisce queste cose:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>
              le definizioni e le caratteristiche degli strumenti sono corrette,
              verificate su fonti ufficiali
            </li>
            <li>
              la semplificazione cambia le parole e le immagini, mai il
              significato finanziario
            </li>
            <li>
              BTP, obbligazione, azione ed ETF sono esempi con dati statici,
              a scopo di studio
            </li>
          </ul>
        </div>
      </section>

      {/* ================================================================
          Sezione 2 — User Difficulty Statement
          Chi ha questa difficoltà, in quale momento, perché è rilevante.
          ================================================================ */}
      <section aria-labelledby="titolo-difficolta" className="mt-16">
        <h2
          id="titolo-difficolta"
          className="font-serif text-2xl font-light tracking-tight text-ink"
        >
          La difficoltà da cui siamo partiti
        </h2>

        <p className="mt-6 text-muted">
          Chi ha tra i 18 e i 30 anni incontra parole come inflazione, rischio,
          obbligazione, azione, ETF senza capire come si tengono insieme.
        </p>

        <p className="mt-4 text-muted">
          Non è una mancanza di intelligenza. È una barriera cognitiva: i
          concetti finanziari arrivano tutti insieme, senza un ordine. Chi non
          conosce il concetto di rischio non può capire il rendimento. Chi non
          sa cosa vuol dire "prestare soldi" non può capire cos'è un BTP.
        </p>

        <p className="mt-4 text-muted">
          Capitolo Zero abbassa questa barriera. Costruisce i concetti uno alla
          volta, dal più semplice agli strumenti reali. Se una risposta sbagliata
          rivela una lacuna, il percorso torna a colmarla prima di andare avanti.
        </p>
      </section>

      {/* ================================================================
          Sezione 3 — Before/After Simplicity Evidence
          Dato tabellare: <table> con <th scope="col">, non due div affiancati.
          ================================================================ */}
      <section aria-labelledby="titolo-prima-dopo" className="mt-16">
        <h2
          id="titolo-prima-dopo"
          className="font-serif text-2xl font-light tracking-tight text-ink"
        >
          Prima e dopo
        </h2>

        <p className="mt-6 text-muted">
          Queste due colonne mostrano la distanza concreta tra il punto di
          partenza e il punto di arrivo.
        </p>

        {/* overflow-x-auto: su schermi stretti la tabella scorre orizzontalmente
            senza perdere contenuto. Regge lo zoom al 200%. Il raggio è sul
            wrapper esterno per clippare correttamente lo scroll. */}
        <div className="mt-6 overflow-x-auto rounded-brand bg-paper shadow-riposo">
          <div className="p-6">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-line pb-3 pr-8 text-sm font-semibold uppercase tracking-wider text-muted"
                  >
                    Prima
                  </th>
                  <th
                    scope="col"
                    className="border-b border-line pb-3 text-sm font-semibold uppercase tracking-wider text-accent-text"
                  >
                    Dopo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <td className="py-4 pr-8 align-top text-muted">
                    Vedo le parole BTP, obbligazione, azione, ETF, rischio,
                    rendimento, diversificazione.
                  </td>
                  <td className="py-4 align-top text-ink">
                    So dire se sono proprietario o creditore.
                  </td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-4 pr-8 align-top text-muted">
                    Non so spiegare cosa distingue un'azione da un ETF.
                  </td>
                  <td className="py-4 align-top text-ink">
                    So chi è l'emittente e cosa vuol dire.
                  </td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-4 pr-8 align-top text-muted">
                    Sento parlare di rischio e rendimento come fossero concetti
                    separati.
                  </td>
                  <td className="py-4 align-top text-ink">
                    So cosa vuol dire rischio. So perché non si parla di quanto
                    guadagni senza parlarne.
                  </td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-4 pr-8 align-top text-muted">
                    Non so cosa vuol dire diversificare, né perché sia utile.
                  </td>
                  <td className="py-4 align-top text-ink">
                    So cosa vuol dire dividere i soldi tra investimenti diversi,
                    e cosa cambia.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-8 align-top text-muted">
                    Non conosco la struttura degli strumenti finanziari.
                  </td>
                  <td className="py-4 align-top text-ink">
                    Conosco la struttura di base di ciascuno strumento.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-8 text-muted">
          La differenza non la dichiariamo noi. La misurano la valutazione
          iniziale e quella finale.
        </p>

        {/*
         * Se la valutazione finale è stata fatta, offre un collegamento diretto
         * alla schermata risultato. La prova è a un clic, non in un allegato.
         */}
        {valutazioneFinaleFatta && (
          <p className="mt-4 text-muted">
            Hai già completato la valutazione finale.{" "}
            <button
              type="button"
              onClick={() =>
                invia({ tipo: "vai-a", schermata: { nome: "risultato" } })
              }
              className="font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
            >
              Vedi i tuoi risultati
            </button>{" "}
            — la prova è a un clic.
          </p>
        )}
      </section>

      {/* ================================================================
          Sezione 4 — Come è fatto (capability software)
          La consegna valuta il COME: qui si spiega la logica adattiva.
          ================================================================ */}
      <section aria-labelledby="titolo-come-fatto" className="mt-16">
        <h2
          id="titolo-come-fatto"
          className="font-serif text-2xl font-light tracking-tight text-ink"
        >
          Come è fatto
        </h2>

        <p className="mt-6 text-muted">
          Il prodotto tiene un modello di prerequisiti tra dodici concetti
          finanziari. Ogni opzione sbagliata dichiara quale lacuna rivela.
        </p>

        <p className="mt-4 text-muted">
          Quando rispondi in modo sbagliato, il sistema riconosce quale concetto
          specifico manca. Apre la micro-lezione di quel concetto. Poi riverifica
          con una domanda diversa sulla stessa idea.
        </p>

        <p className="mt-4 text-muted">
          La padronanza si assegna solo dopo una verifica superata. Mai per aver
          letto una pagina. Non "sbagliato, riprova": il percorso sa esattamente
          cosa non è chiaro, e torna lì.
        </p>
      </section>

      {/* Pulsante di ritorno in fondo — per chi ha letto tutto */}
      <div className="mt-16 border-t border-line pt-8">
        <Button variante="secondario" onClick={torna}>
          Torna indietro
        </Button>
      </div>
    </div>
  );
}
