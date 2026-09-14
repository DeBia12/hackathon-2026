import { useState, useRef, useEffect } from "react";
import type { ReactElement } from "react";
import type { Domanda as TipoDomanda, Lezione } from "@/dominio/tipi";
import { valuta } from "@/dominio/motoreAdattivo";
import type { Esito } from "@/dominio/motoreAdattivo";
import { Domanda } from "@/componenti/Domanda";
import { MicroLezione } from "@/componenti/MicroLezione";
import { Button } from "@/components/ui/Button";

interface PropsRemediation {
  /** Nome leggibile del concetto mancante (es. «Proprietà»). */
  concettoNome: string;
  /** La micro-lezione del concetto mancante da mostrare. */
  lezioneObj: Lezione;
  /** La domanda di riverifica, diversa da quella sbagliata. */
  riverificaDomanda: TipoDomanda;
  /**
   * Chiamato non appena la riverifica è stata risposta (corretta o errata).
   * Il chiamante (Modulo) esegue il dispatch; Remediation gestisce solo l'UX.
   */
  onRispostaRiverifica: (idOpzione: string, esito: Esito) => void;
  /** Chiamato quando la remediation è conclusa: successo o secondo tentativo fallito. */
  onProsegui: () => void;
}

type FaseRemediation = "lezione" | "riverifica";

/**
 * Schermata di remediation adattiva.
 *
 * Flusso:
 * 1. Annuncio del concetto mancante (focus sul titolo, live region).
 * 2. Micro-lezione del concetto (VEDI → CAPISCI → PROVA).
 * 3. Riverifica — domanda diversa da quella sbagliata.
 * 4. Corretta → conferma, poi onProsegui.
 *    Sbagliata (1°): mostra spiegazione, permette di rivedere la lezione.
 *    Sbagliata (2°): mostra spiegazione, continua senza loop.
 */
export function Remediation({
  concettoNome,
  lezioneObj,
  riverificaDomanda,
  onRispostaRiverifica,
  onProsegui,
}: PropsRemediation): ReactElement {
  const [fase, setFase] = useState<FaseRemediation>("lezione");
  const [scelta, setScelta] = useState<string | undefined>(undefined);
  const [esito, setEsito] = useState<Esito | undefined>(undefined);
  const [tentativi, setTentativi] = useState(0);
  // Incrementato per rimontare MicroLezione quando l'utente sceglie «Rivedi».
  const [chiaveLezione, setChiaveLezione] = useState(0);

  // Focus sul titolo appena la remediation compare: cambio di contesto esplicito.
  const titoloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titoloRef.current?.focus();
  }, []);

  // Focus sull'intestazione della riverifica quando la fase cambia.
  const riverificaHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (fase === "riverifica") {
      riverificaHeadingRef.current?.focus();
    }
  }, [fase]);

  // Ref per il focus quando si torna alla lezione dopo un tentativo fallito.
  const lezioneRef = useRef<HTMLDivElement>(null);

  function handleLezionCompleta(): void {
    setFase("riverifica");
  }

  function handleRiverificaRispondi(idOpzione: string): void {
    const e = valuta(riverificaDomanda, idOpzione);
    setScelta(idOpzione);
    setEsito(e);
    onRispostaRiverifica(idOpzione, e);
  }

  function handleRiverificaAvanti(): void {
    if (!esito) return;

    if (esito.corretta) {
      onProsegui();
      return;
    }

    const nuoviTentativi = tentativi + 1;
    setTentativi(nuoviTentativi);

    if (nuoviTentativi >= 2) {
      // Secondo fallimento: si prosegue lasciando il concetto in-corso.
      onProsegui();
    }
    // Al primo fallimento: l'utente può rivedere la lezione.
    // Il render mostrerà la sezione di recupero.
  }

  function handleRivediLezione(): void {
    setFase("lezione");
    setScelta(undefined);
    setEsito(undefined);
    setChiaveLezione((k) => k + 1);
    // Focus sulla sezione lezione al prossimo render.
    setTimeout(() => lezioneRef.current?.focus(), 50);
  }

  // Il primo tentativo fallito non ha ancora raggiunto il limite.
  const hasFallitoUnaVolta = esito !== undefined && !esito.corretta && tentativi < 2;
  // Il secondo tentativo fallito: il pulsante "Continua" è già gestito in handleRiverificaAvanti.

  return (
    <div className="space-y-8">
      {/*
       * Live region: annuncia il cambio di contesto senza spostare il focus
       * a un elemento non ancora renderizzato. Il titolo ha tabIndex={-1}
       * per poter ricevere il focus programmatico.
       */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        Momento di pausa: guardiamo insieme un concetto che manca prima di continuare.
      </div>

      {/* ── Intestazione remediation ──────────────────────────────── */}
      {/*
       * Fondo ambra-tenue: colore caldo, non punitivo, diverso dal verde d'azione.
       * text-ink per il titolo (0F172A su #fffbeb = altissimo contrasto).
       * Il nome del concetto è in text-ambra (4.84:1 su #fffbeb, AA).
       */}
      <div className="bg-ambra-tenue rounded-brand p-6">
        <h2
          ref={titoloRef}
          tabIndex={-1}
          className="text-xl font-semibold leading-snug tracking-tight text-ink focus:outline-none"
        >
          Fermiamoci un momento:{" "}
          <strong className="text-ambra">{concettoNome}</strong>.
        </h2>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-muted">
          Non è un errore tuo — è un concetto che non abbiamo ancora visto insieme.
          Prima di tornare alla domanda, guardiamo cosa vuol dire.
        </p>
      </div>

      {/* ── Micro-lezione del concetto mancante ───────────────────── */}
      {fase === "lezione" && (
        <div ref={lezioneRef} tabIndex={-1} className="focus:outline-none">
          <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink">
            {lezioneObj.titolo}
          </h3>
          <MicroLezione
            key={chiaveLezione}
            lezione={lezioneObj}
            onCompleta={handleLezionCompleta}
          />
        </div>
      )}

      {/* ── Riverifica ────────────────────────────────────────────── */}
      {fase === "riverifica" && (
        <section aria-label="Riverifica — verifica il concetto appena visto">
          <h3
            ref={riverificaHeadingRef}
            tabIndex={-1}
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent-text focus:outline-none"
          >
            Riverifica
          </h3>

          <Domanda
            domanda={riverificaDomanda}
            scelta={scelta}
            esito={
              esito !== undefined
                ? { corretta: esito.corretta, spiegazione: esito.spiegazione }
                : undefined
            }
            mostraEsito={true}
            onRispondi={handleRiverificaRispondi}
            onAvanti={
              scelta !== undefined
                ? handleRiverificaAvanti
                : undefined
            }
            etichettaAvanti={
              esito?.corretta
                ? "Avanti — torna alla lezione"
                : tentativi >= 1
                ? "Continua comunque"
                : "Avanti"
            }
          />

          {/* Recupero dopo il primo fallimento: offre di rivedere la lezione */}
          {hasFallitoUnaVolta && scelta !== undefined && (
            <div className="mt-4">
              <Button variante="secondario" onClick={handleRivediLezione}>
                Rivedi la lezione
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
