import { useState, useRef, useEffect } from "react";
import type { ReactElement } from "react";
import type { Lezione } from "@/dominio/tipi";
import { INTERATTIVI } from "@/componenti/interattivi/registro";
import { Button } from "@/components/ui/Button";

interface PropsMicroLezione {
  /** La lezione da mostrare: VEDI → CAPISCI → PROVA (se presente). */
  lezione: Lezione;
  /** Chiamato quando l'utente ha attraversato tutti i passi educativi. */
  onCompleta: () => void;
}

type FaseEducativa = "vedi" | "capisci" | "prova";

/**
 * Mostra i tre passi educativi di una lezione: VEDI → CAPISCI → PROVA (facoltativo).
 * Non gestisce DIMOSTRA né PADRONEGGIATO: spetta al chiamante (Modulo o Remediation).
 */
export function MicroLezione({ lezione, onCompleta }: PropsMicroLezione): ReactElement {
  const haPart = lezione.prova !== undefined;
  const [fase, setFase] = useState<FaseEducativa>("vedi");

  /*
   * Al cambio di fase il pulsante precedente scompare: senza refocus
   * lo screen reader perderebbe il contesto. Il titolo di sezione h3
   * (tabIndex=-1) riceve il focus programmatico ad ogni transizione.
   */
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [fase]);

  function avanza(): void {
    if (fase === "vedi") {
      setFase("capisci");
    } else if (fase === "capisci") {
      if (haPart) {
        setFase("prova");
      } else {
        onCompleta();
      }
    } else {
      // prova → done
      onCompleta();
    }
  }

  return (
    <div className="space-y-6">
      {/* ── VEDI ──────────────────────────────────────────────────── */}
      {fase === "vedi" && (
        <section aria-label="Vedi — cosa stiamo per capire">
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-text focus:outline-none"
          >
            Vedi
          </h3>

          {lezione.vedi.tipo === "analogia" ? (
            <blockquote className="mb-6 border-l-4 border-accent pl-5 text-base italic leading-relaxed text-ink">
              {lezione.vedi.testo}
            </blockquote>
          ) : (
            (() => {
              const Comp = INTERATTIVI[lezione.vedi.componente];
              return (
                <div className="mb-6">
                  <Comp />
                </div>
              );
            })()
          )}

          <Button onClick={avanza}>Capisci →</Button>
        </section>
      )}

      {/* ── CAPISCI ───────────────────────────────────────────────── */}
      {fase === "capisci" && (
        <section aria-label="Capisci — i concetti chiave">
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-text focus:outline-none"
          >
            Capisci
          </h3>

          <div className="space-y-4">
            {lezione.capisci.map((paragrafo, i) => (
              <p key={i} className="text-base leading-relaxed text-ink">
                {paragrafo}
              </p>
            ))}
          </div>

          <Button onClick={avanza} className="mt-6">
            {haPart ? "Prova →" : "Dimostra →"}
          </Button>
        </section>
      )}

      {/* ── PROVA ─────────────────────────────────────────────────── */}
      {fase === "prova" &&
        (() => {
          const prova = lezione.prova;
          if (prova === undefined) return null;
          const Comp = INTERATTIVI[prova.componente];
          return (
            <section aria-label="Prova — interagisci con il concetto">
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-text focus:outline-none"
              >
                Prova
              </h3>
              <p className="mb-4 text-base text-muted">{prova.consegna}</p>
              <div className="mb-6">
                <Comp />
              </div>
              <Button onClick={avanza}>Dimostra →</Button>
            </section>
          );
        })()}
    </div>
  );
}
