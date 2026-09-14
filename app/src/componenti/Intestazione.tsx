import type { ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import { BarraProgresso } from "@/componenti/BarraProgresso";
import { DistintivoLivello } from "@/componenti/DistintivoLivello";

interface PropsIntestazione {
  /** Assente finché il percorso non è iniziato. */
  livello?: string;
  percentualeProgresso?: number;
  concettiAcquisiti?: number;
  concettiTotali?: number;
  /** Invia { tipo: "azzera" }. Il chiamante gestisce l'azione. */
  onRicomincia: () => void;
}

export function Intestazione({
  livello,
  percentualeProgresso,
  concettiAcquisiti,
  concettiTotali,
  onRicomincia,
}: PropsIntestazione): ReactElement {
  const percorsoIniziato =
    livello !== undefined && percentualeProgresso !== undefined;

  return (
    /*
     * Il fondo lavanda (bg-fondo) fa emergere la barra bianca arrotondata.
     * Il padding orizzontale laterale permette alle ombre laterali della barra di respiro.
     */
    <header className="bg-fondo px-3 pt-3 pb-4 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-brand bg-paper px-4 py-3 shadow-riposo sm:px-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Il nome leggibile è nel testo seguente; il glifo iniziale è decorativo */}
            <p className="text-base font-semibold tracking-tight text-ink sm:text-lg">
              <span aria-hidden="true" className="text-accent">✦</span>{" "}
              Capitolo Zero
            </p>

            {/*
             * Badge e barra compatta stanno nella prima riga solo da sm in su.
             * Sotto sm i tre elementi insieme superano la larghezza dello
             * schermo e comprimono il nome del prodotto fino a troncarlo:
             * lì livello e progresso scendono nella seconda riga.
             */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {percorsoIniziato && (
                <>
                  <span className="hidden rounded-full bg-surface px-3 py-1 sm:inline-block">
                    <DistintivoLivello
                      livello={livello}
                      concettiAcquisiti={concettiAcquisiti}
                      concettiTotali={concettiTotali}
                    />
                  </span>
                  {/* Senza pillola attorno: la barra compatta ha già il suo
                      fondo pieno e la percentuale scritta sopra. */}
                  <span className="hidden sm:inline-block">
                    <BarraProgresso
                      valore={percentualeProgresso}
                      etichetta="Progresso"
                      compatta
                    />
                  </span>
                </>
              )}

              {/* Sempre visibile: la demo richiede di poter ricominciare in qualsiasi momento */}
              <Button
                variante="fantasma"
                onClick={onRicomincia}
                className="px-3 text-sm sm:px-6"
              >
                Ricomincia
              </Button>
            </div>
          </div>

          {/* Seconda riga, solo su mobile: livello e progresso per esteso */}
          {percorsoIniziato && (
            <div className="mt-3 flex items-center gap-3 sm:hidden">
              <span className="shrink-0 rounded-full bg-surface px-3 py-1">
                <DistintivoLivello
                  livello={livello}
                  concettiAcquisiti={concettiAcquisiti}
                  concettiTotali={concettiTotali}
                />
              </span>
              <div className="min-w-0 flex-1">
                <BarraProgresso
                  valore={percentualeProgresso}
                  etichetta="Progresso"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
