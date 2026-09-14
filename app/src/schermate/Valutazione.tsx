import { useState, useRef, useEffect } from "react";
import type { ReactElement } from "react";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { Domanda } from "@/componenti/Domanda";
import { BarraProgresso } from "@/componenti/BarraProgresso";
import { Button } from "@/components/ui/Button";
import {
  DOMANDE,
  VALUTAZIONE_INIZIALE,
  VALUTAZIONE_FINALE,
} from "@/dominio/domande";
import { valuta, aggiornaPadronanza } from "@/dominio/motoreAdattivo";
import { calcolaProfilo } from "@/dominio/punteggio";
import { CONCETTI, AREE } from "@/dominio/concetti";
import type { RispostaData } from "@/dominio/tipi";

export function Valutazione({
  momento,
}: {
  momento: "iniziale" | "finale";
}): ReactElement {
  const { stato, invia } = useApprendimento();
  const ids = momento === "iniziale" ? VALUTAZIONE_INIZIALE : VALUTAZIONE_FINALE;
  const totale = ids.length;

  const [indiceDomanda, setIndiceDomanda] = useState(0);
  const [scelta, setScelta] = useState<string | undefined>(undefined);
  const [fase, setFase] = useState<"domanda" | "riepilogo">("domanda");
  const [risposteLocali, setRisposteLocali] = useState<RispostaData[]>([]);

  /*
   * Il focus torna sul titolo a ogni cambio di domanda e al passaggio al
   * riepilogo. Con tabIndex={-1} il titolo non entra nel tab order naturale:
   * il focus è solo programmatico, invisibile visivamente (outline-none),
   * ma annunciato dagli screen reader.
   */
  const titoloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titoloRef.current?.focus();
  }, [indiceDomanda, fase]);

  function gestisciAvanti(): void {
    if (scelta === undefined) return;

    const idCorrente = ids[indiceDomanda];
    if (idCorrente === undefined) return;

    const domanda = DOMANDE[idCorrente];
    if (domanda === undefined) return;

    const esito = valuta(domanda, scelta);
    const padronanza = aggiornaPadronanza(
      stato.padronanza[domanda.concetto],
      esito,
      momento,
    );

    const risposta: RispostaData = {
      domandaId: domanda.id,
      concetto: domanda.concetto,
      opzioneId: scelta,
      corretta: esito.corretta,
      credito: esito.credito,
      momento,
    };

    invia({ tipo: "risposta-data", risposta, padronanza });

    const nuoveRisposte = [...risposteLocali, risposta];
    setRisposteLocali(nuoveRisposte);

    if (indiceDomanda < totale - 1) {
      setScelta(undefined);
      setIndiceDomanda((i) => i + 1);
    } else if (momento === "iniziale") {
      setFase("riepilogo");
    } else {
      invia({ tipo: "vai-a", schermata: { nome: "risultato" } });
    }
  }

  // ── Riepilogo PRIMA — mostrato al termine della valutazione iniziale ──────
  if (fase === "riepilogo") {
    const profilo = calcolaProfilo(risposteLocali, CONCETTI);

    return (
      <div className="py-8">
        <h1
          ref={titoloRef}
          tabIndex={-1}
          className="text-3xl font-semibold tracking-tight text-ink outline-none"
        >
          <span aria-hidden="true" className="text-accent">
            &gt;
          </span>{" "}
          Ecco da dove partiamo
        </h1>

        <p className="mt-4 max-w-xl text-lg text-muted">
          Un punteggio basso qui è del tutto normale: è esattamente per questo
          che il percorso esiste. Queste cinque domande ci indicano dove
          concentrare l'attenzione.
        </p>

        <div className="mt-10 max-w-lg space-y-8">
          {/* Punteggio complessivo */}
          <div>
            <p
              aria-hidden="true"
              className="mb-3 text-xs font-medium uppercase tracking-widest text-muted"
            >
              Punteggio complessivo
            </p>
            <BarraProgresso
              valore={profilo.complessivo}
              etichetta="Punteggio complessivo"
            />
          </div>

          {/* Dettaglio per le cinque aree */}
          <div>
            <p
              aria-hidden="true"
              className="mb-4 text-xs font-medium uppercase tracking-widest text-muted"
            >
              Per area
            </p>
            <div className="space-y-4">
              {AREE.map((area) => (
                <BarraProgresso
                  key={area.id}
                  valore={profilo.perArea[area.id]}
                  etichetta={area.nome}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            onClick={() =>
              invia({ tipo: "vai-a", schermata: { nome: "mappa" } })
            }
          >
            Inizia il percorso
          </Button>
        </div>
      </div>
    );
  }

  // ── Schermata domanda ────────────────────────────────────────────────────
  const idCorrente = ids[indiceDomanda];
  const domandaCorrente =
    idCorrente !== undefined ? DOMANDE[idCorrente] : undefined;

  // Stato irraggiungibile nel flusso normale: indiceDomanda < totale è garantito.
  if (domandaCorrente === undefined) {
    return <p className="py-8 text-muted">Caricamento…</p>;
  }

  const numeroDomanda = indiceDomanda + 1;
  const progressoPercent = (numeroDomanda / totale) * 100;
  const titolo = momento === "iniziale" ? "Cosa sai già" : "Cosa hai imparato";

  const etichettaAvanti =
    indiceDomanda < totale - 1
      ? "Avanti"
      : momento === "iniziale"
        ? "Vedi il mio profilo iniziale"
        : "Concludi la valutazione";

  return (
    <div className="py-8">
      {/*
       * Regione aria-live: annuncia il cambio di domanda agli screen reader
       * senza spostare il focus. aria-atomic garantisce che la frase sia letta
       * per intero a ogni aggiornamento, non incrementalmente.
       */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Domanda {numeroDomanda} di {totale}
      </div>

      <h1
        ref={titoloRef}
        tabIndex={-1}
        className="text-3xl font-semibold tracking-tight text-ink outline-none"
      >
        <span aria-hidden="true" className="text-accent">
          &gt;
        </span>{" "}
        {titolo}
      </h1>

      {/* Barra di avanzamento — label include la posizione per gli screen reader */}
      <div className="mt-6">
        <BarraProgresso
          valore={progressoPercent}
          etichetta={`Domanda ${numeroDomanda} di ${totale}`}
        />
      </div>

      <div className="mt-10 max-w-2xl">
        {/*
         * key={indiceDomanda}: forza il rimontaggio del componente a ogni
         * avanzamento, assicurando che il fieldset/legend vengano re-annunciati
         * e che non rimanga stato residuo tra domande.
         *
         * mostraEsito={false}: durante una valutazione non si mostra mai
         * corretto/sbagliato. Misurare e insegnare nello stesso momento
         * falsifica la misura — ed è la misura che questo prodotto vende.
         */}
        <Domanda
          key={indiceDomanda}
          domanda={domandaCorrente}
          posizione={{ corrente: numeroDomanda, totale }}
          scelta={scelta}
          mostraEsito={false}
          onRispondi={(idOpzione) => setScelta(idOpzione)}
          onAvanti={gestisciAvanti}
          etichettaAvanti={etichettaAvanti}
        />

        {/*
         * Testo esplicativo prima di qualsiasi selezione.
         * Il motivo per cui "Avanti" non è ancora disponibile è scritto in
         * testo, non affidato al solo stato visivo del pulsante (WCAG 3.3.2).
         */}
        {scelta === undefined && (
          <p className="mt-6 text-sm text-muted">
            Scegli una risposta per continuare.
          </p>
        )}
      </div>
    </div>
  );
}
