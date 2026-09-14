import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import type {
  ConcettoId,
  DomandaId,
  Lezione,
  MomentoDomanda,
  ModuloId,
  Padronanza,
} from "@/dominio/tipi";
import { CONCETTI } from "@/dominio/concetti";
import { MODULI, lezione as trovaLezione } from "@/dominio/moduli";
import { domanda as trovaDomanda } from "@/dominio/domande";
import {
  valuta,
  prossimoPasso,
  aggiornaPadronanza,
} from "@/dominio/motoreAdattivo";
import type { Esito, Passo } from "@/dominio/motoreAdattivo";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { Domanda } from "@/componenti/Domanda";
import { BarraProgresso } from "@/componenti/BarraProgresso";
import { PastigliaConcetto } from "@/componenti/PastigliaConcetto";
import { MicroLezione } from "@/componenti/MicroLezione";
import { Remediation } from "@/componenti/Remediation";
import { Button } from "@/components/ui/Button";

type PassoRimedia = Extract<Passo, { tipo: "rimedia" }>;

type FaseModulo = "lezione" | "dimostra" | "padroneggiato" | "remediation";

export function Modulo({ modulo }: { modulo: ModuloId }): ReactElement {
  const { stato, invia } = useApprendimento();

  // ── Stato locale ───────────────────────────────────────────────────────────
  const [indiceLezione, setIndiceLezione] = useState(0);
  /** Incrementato per rimontare MicroLezione al cambio lezione o dopo remediation. */
  const [chiaveLezione, setChiaveLezione] = useState(0);
  const [fase, setFase] = useState<FaseModulo>("lezione");
  const [scelta, setScelta] = useState<string | undefined>(undefined);
  const [esitoCorrente, setEsitoCorrente] = useState<Esito | undefined>(undefined);
  const [passoRimedia, setPassoRimedia] = useState<PassoRimedia | null>(null);
  /**
   * Dopo la prima remediation di una lezione, un secondo fallimento sul DIMOSTRA
   * non innesca un'altra remediation: si avanza lasciando il concetto in-corso.
   */
  const [hasRemediato, setHasRemediato] = useState(false);

  const padroneggiataRef = useRef<HTMLDivElement>(null);

  // ── Hook: registra lezione come vista ─────────────────────────────────────
  // Tutti gli hook devono essere dichiarati prima di qualsiasi return condizionale.
  useEffect(() => {
    const m = MODULI.find((m) => m.id === modulo);
    if (!m) return;
    const lid = m.lezioni[indiceLezione];
    if (lid === undefined) return;
    invia({ tipo: "lezione-vista", lezione: lid });
  }, [modulo, indiceLezione, invia]);

  // ── Hook: focus su PADRONEGGIATO quando compare ───────────────────────────
  useEffect(() => {
    if (fase === "padroneggiato") {
      padroneggiataRef.current?.focus();
    }
  }, [fase]);

  // ── Ricerca del modulo e della lezione corrente ───────────────────────────
  const moduloObj = MODULI.find((m) => m.id === modulo);

  if (!moduloObj) {
    return (
      <div className="py-8">
        <p className="text-muted">Modulo non trovato.</p>
      </div>
    );
  }

  const lezioneId = moduloObj.lezioni[indiceLezione];

  if (lezioneId === undefined) {
    return (
      <div className="py-8">
        <p className="text-muted">Lezione non trovata.</p>
      </div>
    );
  }

  const lezioneObj = trovaLezione(lezioneId);
  const verificaDomanda = trovaDomanda(lezioneObj.verifica);

  // Valori estratti per i gestori di evento: TypeScript non propaga il narrowing
  // di `moduloObj` nelle function declaration (closure capture).
  const moduloIdVal = moduloObj.id;
  const totalLezioni = moduloObj.lezioni.length;

  // ── Aiutante: assegna XP quando un concetto diventa acquisito ─────────────
  function xpSeNuovoAcquisito(
    _concettoId: ConcettoId,
    nuovaPad: Padronanza,
    padPrecedente: Padronanza | undefined,
  ): void {
    if (nuovaPad.stato === "acquisito" && padPrecedente?.stato !== "acquisito") {
      invia({ tipo: "assegna-xp", punti: 10 });
    }
  }

  /**
   * Marca tutti i concetti di una lezione come acquisiti, escludendo quello già
   * gestito dalla domanda principale.
   *
   * Regola speciale documentata nella specifica: quando una lezione viene superata
   * (verifica o riverifica), TUTTI i concetti in lezione.concetti risultano acquisiti.
   * Questo è necessario per `proprieta` in l6a, che non ha mai una domanda dedicata
   * ma viene insegnato insieme a `prestito`. Senza questa regola, `azione` non si
   * sbloccherebbe mai perché il motore trova `proprieta` non acquisito come prerequisito.
   */
  function marcaConceptiExtra(
    lez: Lezione,
    domandaId: DomandaId,
    opzioneCorretta: string,
    escludiConcetto: ConcettoId,
  ): void {
    for (const cid of lez.concetti) {
      if (cid === escludiConcetto) continue;
      const padConc = stato.padronanza[cid];
      const momentoExtra: MomentoDomanda = padConc?.attendeRiverifica
        ? "riverifica"
        : "verifica";
      const esitoExtra: Esito = { corretta: true, credito: 1, spiegazione: "" };
      const nuovaPadExtra = aggiornaPadronanza(padConc, esitoExtra, momentoExtra);
      invia({
        tipo: "risposta-data",
        risposta: {
          domandaId,
          concetto: cid,
          opzioneId: opzioneCorretta,
          corretta: true,
          credito: 1,
          momento: momentoExtra,
        },
        padronanza: nuovaPadExtra,
      });
      xpSeNuovoAcquisito(cid, nuovaPadExtra, padConc);
    }
  }

  // ── Handler DIMOSTRA ──────────────────────────────────────────────────────

  function handleDimostraRispondi(idOpzione: string): void {
    const esito = valuta(verificaDomanda, idOpzione);
    setScelta(idOpzione);
    setEsitoCorrente(esito);
  }

  function handleDimostraAvanti(): void {
    if (scelta === undefined || esitoCorrente === undefined) return;

    if (esitoCorrente.corretta) {
      // ── Risposta corretta ──────────────────────────────────────────────────
      const padConc = stato.padronanza[verificaDomanda.concetto];
      // Se il concetto attendeva riverifica, questo DIMOSTRA corretto la soddisfa.
      const momento: MomentoDomanda = padConc?.attendeRiverifica
        ? "riverifica"
        : "verifica";
      const nuovaPad = aggiornaPadronanza(padConc, esitoCorrente, momento);

      invia({
        tipo: "risposta-data",
        risposta: {
          domandaId: verificaDomanda.id,
          concetto: verificaDomanda.concetto,
          opzioneId: scelta,
          corretta: true,
          credito: 1,
          momento,
        },
        padronanza: nuovaPad,
      });
      xpSeNuovoAcquisito(verificaDomanda.concetto, nuovaPad, padConc);

      // Marca tutti gli altri concetti della lezione come acquisiti.
      marcaConceptiExtra(
        lezioneObj,
        verificaDomanda.id,
        verificaDomanda.corretta,
        verificaDomanda.concetto,
      );

      setFase("padroneggiato");
    } else {
      // ── Risposta errata ────────────────────────────────────────────────────
      const padConc = stato.padronanza[verificaDomanda.concetto];
      const momento: MomentoDomanda = padConc?.attendeRiverifica
        ? "riverifica"
        : "verifica";
      const nuovaPad = aggiornaPadronanza(padConc, esitoCorrente, momento);

      invia({
        tipo: "risposta-data",
        risposta: {
          domandaId: verificaDomanda.id,
          concetto: verificaDomanda.concetto,
          opzioneId: scelta,
          corretta: false,
          credito: esitoCorrente.credito,
          momento,
        },
        padronanza: nuovaPad,
      });

      if (hasRemediato) {
        // Secondo fallimento su questa lezione: non entrare in loop, si avanza.
        setFase("padroneggiato");
      } else {
        const p = prossimoPasso(
          esitoCorrente,
          verificaDomanda,
          CONCETTI,
          stato.padronanza,
        );
        if (p.tipo === "rimedia") {
          invia({ tipo: "lezione-vista", lezione: p.lezione });
          setPassoRimedia(p);
          setHasRemediato(true);
          setFase("remediation");
        } else {
          // "avanza" con risposta errata non dovrebbe accadere, ma si gestisce.
          setFase("padroneggiato");
        }
      }
    }
  }

  // ── Handler PADRONEGGIATO ─────────────────────────────────────────────────

  function handlePadroneggiataAvanti(): void {
    if (indiceLezione >= totalLezioni - 1) {
      invia({ tipo: "modulo-completato", modulo: moduloIdVal });
      invia({ tipo: "vai-a", schermata: { nome: "mappa" } });
    } else {
      setIndiceLezione((i) => i + 1);
      setChiaveLezione((k) => k + 1);
      setFase("lezione");
      setScelta(undefined);
      setEsitoCorrente(undefined);
      setPassoRimedia(null);
      setHasRemediato(false);
    }
  }

  // ── Handler REMEDIATION ───────────────────────────────────────────────────

  function handleRispostaRiverifica(idOpzione: string, esito: Esito): void {
    if (!passoRimedia) return;

    const lezioneRem = trovaLezione(passoRimedia.lezione);
    const riverificaDomandaObj = trovaDomanda(passoRimedia.riverifica);

    const momento: MomentoDomanda = "riverifica";
    const padRiv = stato.padronanza[riverificaDomandaObj.concetto];
    const nuovaPadRiv = aggiornaPadronanza(padRiv, esito, momento);

    invia({
      tipo: "risposta-data",
      risposta: {
        domandaId: riverificaDomandaObj.id,
        concetto: riverificaDomandaObj.concetto,
        opzioneId: idOpzione,
        corretta: esito.corretta,
        credito: esito.credito,
        momento,
      },
      padronanza: nuovaPadRiv,
    });
    xpSeNuovoAcquisito(riverificaDomandaObj.concetto, nuovaPadRiv, padRiv);

    // Riverifica corretta: marca tutti i concetti della lezione di remediation.
    if (esito.corretta) {
      marcaConceptiExtra(
        lezioneRem,
        riverificaDomandaObj.id,
        riverificaDomandaObj.corretta,
        riverificaDomandaObj.concetto,
      );
    }
  }

  function handleRemediationProsegui(): void {
    // Torna al DIMOSTRA della lezione originale (senza ripetere VEDI+CAPISCI+PROVA).
    setFase("dimostra");
    setScelta(undefined);
    setEsitoCorrente(undefined);
    setPassoRimedia(null);
  }

  // ── Valori calcolati ──────────────────────────────────────────────────────

  const percentualeModulo = Math.round((indiceLezione / totalLezioni) * 100);

  const isUltimaLezione = indiceLezione >= totalLezioni - 1;

  const tuttiConceptiAcquisiti = lezioneObj.concetti.every(
    (c) => stato.padronanza[c]?.stato === "acquisito",
  );

  // Props pre-calcolate per Remediation (evita narrowing dentro JSX).
  const remediationProps =
    fase === "remediation" && passoRimedia !== null
      ? {
          concettoNome:
            CONCETTI[passoRimedia.concetto]?.nome ?? passoRimedia.concetto,
          lezioneRem: trovaLezione(passoRimedia.lezione),
          riverificaDomandaObj: trovaDomanda(passoRimedia.riverifica),
        }
      : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl space-y-8 py-8">
      {/* ── Intestazione modulo ─────────────────────────────────────────
          Nascosta durante la remediation: focus sul cambio di contesto.
          La barra di avanzamento è in cima, prima del titolo, per dare
          subito il senso del percorso. */}
      {fase !== "remediation" && (
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Modulo {moduloObj.numero}
          </p>
          <BarraProgresso
            valore={percentualeModulo}
            etichetta={`Lezione ${indiceLezione + 1} di ${totalLezioni}`}
          />
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
            {moduloObj.titolo}
          </h1>
          <p className="text-base text-muted">{moduloObj.sottotitolo}</p>
        </header>
      )}

      {/* ── LEZIONE: VEDI → CAPISCI → PROVA ─────────────────────────── */}
      {fase === "lezione" && (
        <section aria-labelledby="lezione-titolo">
          <div className="mb-6 space-y-3">
            <h2
              id="lezione-titolo"
              className="text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl"
            >
              {lezioneObj.titolo}
            </h2>

            <div
              className="flex flex-wrap gap-2"
              aria-label="Concetti di questa lezione"
            >
              {lezioneObj.concetti.map((cid) => (
                <PastigliaConcetto
                  key={cid}
                  nome={CONCETTI[cid].nome}
                  stato={stato.padronanza[cid]?.stato ?? "ignoto"}
                />
              ))}
            </div>
          </div>

          <MicroLezione
            key={chiaveLezione}
            lezione={lezioneObj}
            onCompleta={() => setFase("dimostra")}
          />
        </section>
      )}

      {/* ── DIMOSTRA ─────────────────────────────────────────────────── */}
      {fase === "dimostra" && (
        <section aria-labelledby="dimostra-titolo">
          <div className="mb-6 space-y-2">
            <h2
              id="dimostra-titolo"
              className="text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl"
            >
              {lezioneObj.titolo}
            </h2>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-accent-text">
              Dimostra
            </h3>
          </div>

          <Domanda
            domanda={verificaDomanda}
            scelta={scelta}
            esito={
              esitoCorrente !== undefined
                ? {
                    corretta: esitoCorrente.corretta,
                    spiegazione: esitoCorrente.spiegazione,
                  }
                : undefined
            }
            mostraEsito={true}
            onRispondi={handleDimostraRispondi}
            onAvanti={scelta !== undefined ? handleDimostraAvanti : undefined}
            etichettaAvanti={
              esitoCorrente?.corretta === false && !hasRemediato
                ? "Scopri cosa manca"
                : "Avanti"
            }
          />
        </section>
      )}

      {/* ── PADRONEGGIATO ────────────────────────────────────────────── */}
      {fase === "padroneggiato" && (
        <div
          ref={padroneggiataRef}
          tabIndex={-1}
          className="space-y-6 focus:outline-none"
        >
          {tuttiConceptiAcquisiti ? (
            <>
              {/*
               * Card verde-tenue: segnala visivamente il successo.
               * role="status" + aria-live="polite" annuncia l'evento agli screen reader.
               * Il messaggio non è veicolato dal solo colore: "Padroneggiato" è testo.
               */}
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="bg-accent-tenue rounded-brand p-5 sm:p-6"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-ink">
                  Padroneggiato
                </h2>
                <p className="mt-2 text-base text-muted">
                  Hai dimostrato di capire questo concetto.
                </p>
              </div>

              <div
                className="flex flex-wrap gap-2"
                aria-label="Concetti acquisiti"
              >
                {lezioneObj.concetti.map((cid) => (
                  <PastigliaConcetto
                    key={cid}
                    nome={CONCETTI[cid].nome}
                    stato="acquisito"
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/*
               * Card neutra su surface: indica che si va avanti senza drammatizzare.
               * role="status" + aria-live="polite" mantiene l'annuncio agli screen reader.
               */}
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="bg-surface rounded-brand p-5 sm:p-6"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-ink">
                  Andiamo avanti
                </h2>
                <p className="mt-2 text-base text-muted">
                  Rivedremo questo concetto più avanti nel percorso.
                </p>
              </div>

              <div
                className="flex flex-wrap gap-2"
                aria-label="Stato concetti"
              >
                {lezioneObj.concetti.map((cid) => (
                  <PastigliaConcetto
                    key={cid}
                    nome={CONCETTI[cid].nome}
                    stato={stato.padronanza[cid]?.stato ?? "in-corso"}
                  />
                ))}
              </div>
            </>
          )}

          <Button onClick={handlePadroneggiataAvanti}>
            {isUltimaLezione ? "Completa il modulo" : "Prossima lezione"}
          </Button>
        </div>
      )}

      {/* ── REMEDIATION ──────────────────────────────────────────────── */}
      {remediationProps !== null && (
        <Remediation
          concettoNome={remediationProps.concettoNome}
          lezioneObj={remediationProps.lezioneRem}
          riverificaDomanda={remediationProps.riverificaDomandaObj}
          onRispostaRiverifica={handleRispostaRiverifica}
          onProsegui={handleRemediationProsegui}
        />
      )}
    </div>
  );
}
