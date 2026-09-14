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
  return (
    /*
     * Il fondo lavanda (bg-fondo) fa emergere la barra bianca arrotondata.
     * Il padding orizzontale laterale permette alle ombre laterali della barra di respiro.
     */
    <header className="bg-fondo px-4 pt-3 pb-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 rounded-brand bg-paper px-6 py-3 shadow-riposo">
          {/* Il nome leggibile è nel testo seguente; il glifo iniziale è decorativo */}
          <p className="text-lg font-semibold tracking-tight text-ink">
            <span aria-hidden="true" className="text-accent">✦</span>{" "}
            Capitolo Zero
          </p>

          <div className="flex items-center gap-3">
            {/*
             * Mostra badge e progresso solo quando il percorso è iniziato.
             * TypeScript restringe i tipi dentro il blocco &&.
             */}
            {livello !== undefined && percentualeProgresso !== undefined && (
              <>
                <span className="rounded-full bg-surface px-3 py-1">
                  <DistintivoLivello
                    livello={livello}
                    concettiAcquisiti={concettiAcquisiti}
                    concettiTotali={concettiTotali}
                  />
                </span>
                <span className="rounded-full bg-surface px-3 py-1">
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
              className="text-sm"
            >
              Ricomincia
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
