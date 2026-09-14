import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import type { Schermata } from "@/dominio/tipi";
import { CONCETTI } from "@/dominio/concetti";
import { avanzamento } from "@/dominio/percorso";
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

  // Unica fonte di verità su livello e progresso: contano i concetti acquisiti,
  // non le lezioni viste. Duplicare la soglia qui produrrebbe due livelli diversi
  // nella stessa schermata, uno in intestazione e uno nella mappa.
  const progresso = avanzamento(stato, CONCETTI);

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
        livello={percorsoIniziato ? progresso.livello : undefined}
        percentualeProgresso={percorsoIniziato ? progresso.percentuale : undefined}
        concettiAcquisiti={percorsoIniziato ? progresso.concettiAcquisiti : undefined}
        concettiTotali={percorsoIniziato ? progresso.concettiTotali : undefined}
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
