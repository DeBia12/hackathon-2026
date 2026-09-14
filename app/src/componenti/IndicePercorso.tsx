import type { ReactElement } from "react";
import type { ModuloId } from "@/dominio/tipi";
import type { StatoModulo } from "@/dominio/percorso";
import { MODULI } from "@/dominio/moduli";
import { statoModuli } from "@/dominio/percorso";
import { useApprendimento } from "@/stato/ApprendimentoContext";
import { cn } from "@/lib/cn";

interface PropsIndicePercorso {
  /** Il modulo aperto: riceve aria-current e non è cliccabile. */
  moduloCorrente: ModuloId;
  onApri: (modulo: ModuloId) => void;
}

/** Testo di stato, letto anche dagli screen reader: il colore non basta. */
const ETICHETTA_STATO: Record<StatoModulo, string> = {
  bloccato: "Bloccato",
  disponibile: "Da iniziare",
  "in-corso": "In corso",
  completato: "Completato",
};

/**
 * Indice dei sei moduli, con stato di sblocco e avanzamento di ciascuno.
 * Sta accanto al modulo aperto: serve a non perdere di vista dove si è
 * dentro al percorso, e a rientrare in un modulo già visitato.
 */
export function IndicePercorso({
  moduloCorrente,
  onApri,
}: PropsIndicePercorso): ReactElement {
  const { stato } = useApprendimento();
  const stati = statoModuli(MODULI, stato);

  return (
    <nav aria-label="Indice dei moduli">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
        Il percorso
      </h2>

      <ol className="space-y-1">
        {MODULI.map((m) => {
          const statoM = stati[m.id];
          const bloccato = statoM === "bloccato";
          const corrente = m.id === moduloCorrente;

          const lezioniViste = m.lezioni.filter((l) =>
            stato.lezioniViste.includes(l),
          ).length;
          const percentuale =
            statoM === "completato"
              ? 100
              : Math.round((lezioniViste / m.lezioni.length) * 100);

          const descrizione = `${ETICHETTA_STATO[statoM]}, ${percentuale}% completato`;

          return (
            <li key={m.id}>
              {/*
                * aria-disabled invece di disabled: un pulsante disabilitato esce
                * dall'ordine di tabulazione, e con lui sparirebbero sia i moduli
                * bloccati sia quello aperto — cioè proprio l'informazione che
                * l'indice esiste per dare. Restano raggiungibili e annunciati;
                * il clic è fermato dalla guardia nell'onClick.
                */}
              <button
                type="button"
                onClick={() => {
                  if (bloccato || corrente) return;
                  onApri(m.id);
                }}
                aria-disabled={bloccato || corrente}
                aria-current={corrente ? "step" : undefined}
                className={cn(
                  "w-full rounded-brand border-2 px-3 py-2 text-left min-h-11",
                  "motion-safe:transition-colors motion-safe:duration-300",
                  corrente
                    ? "cursor-default border-accent-text bg-accent-tenue"
                    : bloccato
                    // border-bordo-ui (#666666) su bg-surface = 5.13:1: ora che
                    // il pulsante è focalizzabile il suo bordo deve reggere 3:1.
                    ? "cursor-not-allowed border-bordo-ui bg-surface"
                    : "border-line bg-paper hover:border-accent-text hover:bg-accent-tenue",
                )}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      bloccato ? "text-muted" : "text-ink",
                    )}
                  >
                    {m.numero}. {m.titolo}
                  </span>
                  {/* Il lucchetto è decorativo: lo stato è scritto sotto in parole */}
                  {bloccato && (
                    <span aria-hidden="true" className="text-sm text-muted">
                      🔒
                    </span>
                  )}
                </span>

                <span className="mt-1 block text-xs text-muted">
                  {descrizione}
                </span>

                {/*
                 * Barra sottile di avanzamento del singolo modulo. È decorativa:
                 * la stessa informazione è già nel testo qui sopra, quindi non
                 * serve un secondo role="progressbar" da annunciare.
                 */}
                <span
                  aria-hidden="true"
                  className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface"
                >
                  <span
                    className="block h-full rounded-full bg-accent-text motion-safe:transition-[width] motion-safe:duration-[550ms]"
                    style={{ width: `${percentuale}%` }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
