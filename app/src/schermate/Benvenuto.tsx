import type { ReactElement } from "react";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { Button } from "@/components/ui/Button";

export function Benvenuto(): ReactElement {
  const { stato, invia } = useApprendimento();
  const haRisposteIniziali = stato.risposteIniziali.length > 0;

  return (
    <div className="py-8 md:py-16">

      {/* ── Hero a due colonne ─────────────────────────────────────── */}
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">

        {/* Colonna sinistra — promessa e azione */}
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            Educazione finanziaria di base
          </p>

          <h1 className="mt-4 font-serif font-semibold text-display text-ink">
            Capire i tuoi soldi, <em>un passo alla volta</em>
          </h1>

          <p className="mt-6 max-w-sm text-lg leading-relaxed text-muted">
            Ti aiutiamo a capire cosa vogliono dire davvero i concetti e gli
            strumenti finanziari.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="rounded-full px-8"
              onClick={() =>
                invia({
                  tipo: "vai-a",
                  schermata: { nome: "valutazione", momento: "iniziale" },
                })
              }
            >
              Inizia{" "}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Button>

            {/*
             * "Riprendi" appare solo se la valutazione iniziale è già stata fatta.
             * Permette di tornare al punto dove si era senza ricominciare da capo.
             */}
            {haRisposteIniziali && (
              <Button
                variante="secondario"
                className="rounded-full px-8"
                onClick={() =>
                  invia({ tipo: "vai-a", schermata: { nome: "mappa" } })
                }
              >
                Riprendi
              </Button>
            )}
          </div>

          <p className="mt-5 text-sm text-muted">
            Gratuito · Nessuna registrazione · Nessun giudizio
          </p>
        </div>

        {/* Colonna destra — figura illustrativa */}
        <div className="relative">
          {/*
           * Figura puramente decorativa: aria-hidden="true" toglie l'intera
           * zona dall'albero accessibile. Il testo equivalente segue fuori.
           */}
          <div
            aria-hidden="true"
            className="relative overflow-visible rounded-grande border border-line bg-paper p-6 shadow-sollevata"
          >
            <p className="mb-4 text-sm font-medium text-muted">
              Esempio di progressione
            </p>

            {/* Istogramma — barre crescenti a pillola */}
            <div className="flex h-52 items-end gap-3">
              <div
                className="flex-1 rounded-t-xl bg-accent"
                style={{ height: "28%" }}
              />
              <div
                className="flex-1 rounded-t-xl bg-accent"
                style={{ height: "42%" }}
              />
              <div
                className="flex-1 rounded-t-xl bg-accent"
                style={{ height: "54%" }}
              />
              <div
                className="flex-1 rounded-t-xl bg-accent"
                style={{ height: "68%" }}
              />
              <div
                className="flex-1 rounded-t-xl bg-accent"
                style={{ height: "82%" }}
              />
              <div
                className="flex-1 rounded-t-xl bg-accent"
                style={{ height: "100%" }}
              />
            </div>

            {/* Card flottante — valore esemplificativo */}
            <div className="absolute -right-4 -top-6 rounded-brand border border-line bg-paper p-4 shadow-sollevata">
              <p className="text-3xl font-bold text-accent-text">+80%</p>
              <p className="mt-1 text-xs leading-snug text-muted">
                miglioramento medio
                <br />
                (dato di esempio)
              </p>
            </div>
          </div>

          {/*
           * Equivalente testuale per chi non vede la figura.
           * La classe sr-only la toglie dallo schermo senza rimuoverla
           * dall'albero accessibile.
           */}
          <p className="sr-only">
            Figura illustrativa: un istogramma a barre crescenti mostra un
            esempio di progressione nel percorso. Il valore "+80% miglioramento
            medio" è un dato di esempio e non rappresenta una misura
            sull&apos;utente.
          </p>
        </div>
      </div>

      {/* ── Come funziona ─────────────────────────────────────────── */}
      <section aria-labelledby="come-funziona-titolo" className="mt-20">
        <h2
          id="come-funziona-titolo"
          className="text-2xl font-semibold tracking-tight text-ink"
        >
          Come funziona
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">

          {/* PRIMA — tessera verde */}
          <div className="rounded-brand border border-line bg-paper p-6 shadow-riposo motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-sollevata">
            <div className="flex h-11 w-11 items-center justify-center rounded-tessera bg-accent-tenue">
              {/* Glifo decorativo: aria-hidden perché il titolo h3 porta il significato */}
              <span aria-hidden="true" className="text-lg font-bold text-accent-text">
                ◎
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-ink">Prima</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Cinque domande brevi. Misuriamo cosa già conosci, senza giudicare.
            </p>
          </div>

          {/* APPRENDI — tessera blu */}
          <div className="rounded-brand border border-line bg-paper p-6 shadow-riposo motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-sollevata">
            <div className="flex h-11 w-11 items-center justify-center rounded-tessera bg-blu-tenue">
              <span aria-hidden="true" className="text-lg font-bold text-blu">
                ◈
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-ink">Apprendi</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Sei moduli sui concetti chiave. Il percorso si adatta a dove
              incontri difficoltà.
            </p>
          </div>

          {/* DOPO — tessera viola */}
          <div className="rounded-brand border border-line bg-paper p-6 shadow-riposo motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-sollevata">
            <div className="flex h-11 w-11 items-center justify-center rounded-tessera bg-viola-tenue">
              <span aria-hidden="true" className="text-lg font-bold text-viola">
                ◇
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-ink">Dopo</h3>
            <p className="mt-2 leading-relaxed text-muted">
              Rieseguiamo la valutazione. Vedi tu stesso cosa è cambiato.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
