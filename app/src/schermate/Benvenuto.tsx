import type { ReactElement } from "react";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { Button } from "@/components/ui/Button";

export function Benvenuto(): ReactElement {
  const { stato, invia } = useApprendimento();
  const haRisposteIniziali = stato.risposteIniziali.length > 0;

  return (
    <div className="py-8">
      {/*
       * Una sola voce in font-serif per la firma editoriale.
       * GT Sectra Fine è l'accento, non il corpo del testo.
       */}
      <p className="font-serif text-2xl font-light tracking-tight text-muted">
        Educazione finanziaria di base
      </p>

      <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight tracking-tight text-ink">
        Non ti diciamo dove mettere i tuoi soldi.
      </h1>

      <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">
        Ti aiutiamo a capire cosa vogliono dire davvero i concetti e gli
        strumenti finanziari.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button
          onClick={() =>
            invia({
              tipo: "vai-a",
              schermata: { nome: "valutazione", momento: "iniziale" },
            })
          }
        >
          Inizia
        </Button>

        {/*
         * "Riprendi" appare solo se la valutazione iniziale è già stata fatta.
         * Permette di tornare al punto dove si era senza ricominciare da capo.
         */}
        {haRisposteIniziali && (
          <Button
            variante="secondario"
            onClick={() =>
              invia({ tipo: "vai-a", schermata: { nome: "mappa" } })
            }
          >
            Riprendi
          </Button>
        )}
      </div>

      {/* PRIMA → APPRENDIMENTO → DOPO: il pitch visivo in tre righe */}
      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        <div className="border-l-2 border-accent pl-5">
          <p className="font-semibold text-ink">Prima</p>
          <p className="mt-2 text-muted">
            Cinque domande brevi. Misuriamo cosa già conosci, senza giudicare.
          </p>
        </div>
        <div className="border-l-2 border-accent pl-5">
          <p className="font-semibold text-ink">Apprendi</p>
          <p className="mt-2 text-muted">
            Sei moduli sui concetti chiave. Il percorso si adatta a dove
            incontri difficoltà.
          </p>
        </div>
        <div className="border-l-2 border-accent pl-5">
          <p className="font-semibold text-ink">Dopo</p>
          <p className="mt-2 text-muted">
            Rieseguiamo la valutazione. Vedi tu stesso cosa è cambiato.
          </p>
        </div>
      </div>
    </div>
  );
}
