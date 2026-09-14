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
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        {/* Il segno > viola è decorativo: il nome leggibile è nel testo seguente */}
        <p className="text-lg font-semibold tracking-tight text-ink">
          <span aria-hidden="true" className="text-accent">
            &gt;
          </span>{" "}
          Capitolo Zero
        </p>

        <div className="flex items-center gap-4">
          {/*
           * Mostra badge e progresso solo quando il percorso è iniziato.
           * TypeScript restringe i tipi dentro il blocco &&.
           */}
          {livello !== undefined && percentualeProgresso !== undefined && (
            <>
              <DistintivoLivello
                livello={livello}
                concettiAcquisiti={concettiAcquisiti}
                concettiTotali={concettiTotali}
              />
              <BarraProgresso
                valore={percentualeProgresso}
                etichetta="Progresso"
                compatta
              />
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
    </header>
  );
}
