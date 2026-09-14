import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import type { Padronanza, Schermata } from "@/dominio/tipi";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { SkipLink } from "@/components/SkipLink";
import { Intestazione } from "@/componenti/Intestazione";
import { PiePagina } from "@/componenti/PiePagina";
import { Benvenuto } from "@/schermate/Benvenuto";
import { Mappa } from "@/schermate/Mappa";
import { Valutazione } from "@/schermate/Valutazione";
import { Modulo } from "@/schermate/Modulo";
import { Risultato } from "@/schermate/Risultato";
import { Trasparenza } from "@/schermate/Trasparenza";

const TOTALE_CONCETTI = 12;

function livelloDaXp(xp: number): string {
  if (xp < 10) return "Principiante";
  if (xp < 30) return "Esploratore";
  if (xp < 60) return "Navigatore";
  return "Consapevole";
}

/** Etichetta leggibile da screen reader per ogni schermata. */
function etichettaSchermata(schermata: Schermata): string {
  switch (schermata.nome) {
    case "benvenuto":
      return "Benvenuto in Capitolo Zero";
    case "valutazione":
      return schermata.momento === "iniziale"
        ? "Valutazione iniziale"
        : "Valutazione finale";
    case "mappa":
      return "Il tuo percorso";
    case "modulo":
      return `Modulo ${schermata.modulo.toUpperCase()}`;
    case "risultato":
      return "I tuoi risultati";
    case "trasparenza":
      return "Come funziona Capitolo Zero";
  }
}

export function App(): ReactElement {
  const { stato, invia } = useApprendimento();
  const mainRef = useRef<HTMLElement>(null);

  /*
   * Al cambio di schermata sposta il focus su <main>.
   * In una SPA senza cambio di URL, lo screen reader non si accorge della
   * navigazione: spostare il focus su un landmark con aria-label è il modo
   * corretto per annunciare la nuova "pagina".
   */
  useEffect(() => {
    mainRef.current?.focus();
  }, [stato.schermata]);

  const percorsoIniziato = stato.risposteIniziali.length > 0;

  const concettiAcquisiti = Object.values(stato.padronanza).filter(
    (p): p is Padronanza => p !== undefined && p.stato === "acquisito",
  ).length;

  const percentualeProgresso = Math.round(
    (concettiAcquisiti / TOTALE_CONCETTI) * 100,
  );

  function renderSchermata(): ReactElement {
    const s = stato.schermata;
    switch (s.nome) {
      case "benvenuto":
        return <Benvenuto />;
      case "valutazione":
        return <Valutazione momento={s.momento} />;
      case "mappa":
        return <Mappa />;
      case "modulo":
        return <Modulo modulo={s.modulo} />;
      case "risultato":
        return <Risultato />;
      case "trasparenza":
        return <Trasparenza />;
    }
  }

  return (
    <>
      <SkipLink />
      <Intestazione
        livello={percorsoIniziato ? livelloDaXp(stato.xp) : undefined}
        percentualeProgresso={
          percorsoIniziato ? percentualeProgresso : undefined
        }
        concettiAcquisiti={percorsoIniziato ? concettiAcquisiti : undefined}
        concettiTotali={percorsoIniziato ? TOTALE_CONCETTI : undefined}
        onRicomincia={() => invia({ tipo: "azzera" })}
      />
      <main
        id="contenuto"
        ref={mainRef}
        tabIndex={-1}
        aria-label={etichettaSchermata(stato.schermata)}
        className="mx-auto max-w-5xl px-6 py-16 focus:outline-none"
      >
        {renderSchermata()}
      </main>
      <PiePagina
        onVaiATrasparenza={() =>
          invia({ tipo: "vai-a", schermata: { nome: "trasparenza" } })
        }
      />
    </>
  );
}
