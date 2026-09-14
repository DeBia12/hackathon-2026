import { useState } from "react";
import type { TipoStrumento } from "@/dominio/tipi";
import { cn } from "@/lib/cn";

interface Props {
  strumento?: TipoStrumento;
}

interface ParteStrumento {
  id: string;
  nome: string;
  valore: string;
  spiegazione: string;
  /**
   * true quando la parte è concettualmente assente per questo strumento.
   * L'assenza stessa è l'informazione didattica (es. l'azione non ha cedola).
   */
  assente?: true;
}

interface DatiStrumento {
  nome: string;
  emittente: string;
  ruolo: string;
  parti: ParteStrumento[];
}

/**
 * Dati statici incorporati: non importa strumenti.ts (non ancora esistente).
 * Dati didattici, non quotazioni: il nome di esempio è illustrativo.
 */
const DATI_STRUMENTI: Record<TipoStrumento, DatiStrumento> = {
  "titolo-stato": {
    nome: "Titolo di Stato — esempio: BTP",
    emittente: "Stato italiano (Ministero dell'Economia)",
    ruolo:
      "Comprando un BTP presti denaro allo Stato: sei un creditore, non un proprietario.",
    parti: [
      {
        id: "emittente",
        nome: "Emittente",
        valore: "Stato italiano",
        spiegazione:
          "Chi emette il titolo e si impegna a rimborsarti. " +
          "Nel caso del BTP (Buono del Tesoro Poliennale), è il Ministero dell'Economia " +
          "che raccoglie denaro dai sottoscrittori per finanziare la spesa pubblica.",
      },
      {
        id: "capitale",
        nome: "Capitale (valore nominale)",
        valore: "Es. 1.000 €",
        spiegazione:
          "La somma che hai prestato. Alla scadenza ti viene restituita integralmente — " +
          "a patto che lo Stato non sia insolvente. Questo valore è fisso e noto dall'inizio.",
      },
      {
        id: "cedola",
        nome: "Cedola (interessi periodici)",
        valore: "Es. 3,85% annuo, pagata ogni 6 mesi",
        spiegazione:
          "L'interesse che lo Stato ti paga per l'uso del tuo denaro. " +
          "La cedola è definita al momento dell'emissione e non cambia. " +
          "Non dipende da come va l'economia: è un impegno contrattuale.",
      },
      {
        id: "scadenza",
        nome: "Scadenza",
        valore: "Es. 01/07/2034",
        spiegazione:
          "La data entro cui lo Stato restituisce il capitale. " +
          "Alla scadenza il rapporto termina. Prima della scadenza il BTP può " +
          "essere venduto sul mercato, ma il prezzo di mercato varia.",
      },
    ],
  },

  "obbligazione-societaria": {
    nome: "Obbligazione societaria — Corporate Bond",
    emittente: "Azienda privata",
    ruolo:
      "Comprando un'obbligazione societaria presti denaro all'azienda: sei un creditore, non un socio.",
    parti: [
      {
        id: "emittente",
        nome: "Emittente",
        valore: "Azienda privata (es. grande impresa industriale o finanziaria)",
        spiegazione:
          "L'azienda che emette l'obbligazione per raccogliere denaro in prestito. " +
          "A differenza dello Stato, un'azienda può fallire: la solidità dell'emittente " +
          "è una variabile importante da capire.",
      },
      {
        id: "capitale",
        nome: "Capitale (valore nominale)",
        valore: "Es. 1.000 €",
        spiegazione:
          "La somma che hai prestato all'azienda. " +
          "Ti viene restituita alla scadenza, se l'azienda è in grado di farlo. " +
          "In caso di insolvenza, i creditori hanno priorità rispetto ai soci.",
      },
      {
        id: "cedola",
        nome: "Cedola (interessi periodici)",
        valore: "Es. 4,5% annuo",
        spiegazione:
          "L'interesse pagato periodicamente. Tende a essere più alto rispetto " +
          "ai titoli di Stato perché il rischio dell'emittente è diverso. " +
          "È un impegno contrattuale, non un dividendo: non dipende dai profitti.",
      },
      {
        id: "scadenza",
        nome: "Scadenza",
        valore: "Es. 15/03/2030",
        spiegazione:
          "La data entro cui l'azienda restituisce il capitale. " +
          "Alla scadenza il rapporto termina. Come per i titoli di Stato, " +
          "prima della scadenza l'obbligazione può essere venduta sul mercato.",
      },
    ],
  },

  "azione": {
    nome: "Azione — Stock",
    emittente: "Azienda quotata in borsa",
    ruolo:
      "Comprando un'azione diventi proprietario di una piccola parte dell'azienda, non un creditore.",
    parti: [
      {
        id: "emittente",
        nome: "Emittente",
        valore: "Azienda quotata in borsa (es. grande gruppo industriale)",
        spiegazione:
          "L'azienda ha suddiviso la propria proprietà in milioni di quote chiamate azioni. " +
          "Comprando un'azione diventi socio: partecipi alla proprietà, non a un prestito.",
      },
      {
        id: "quota",
        nome: "Quota di proprietà",
        valore: "Una frazione dell'azienda",
        spiegazione:
          "A differenza delle obbligazioni, non stai prestando denaro: stai comprando " +
          "una quota di proprietà. Il valore di quella quota dipende da come il mercato " +
          "valuta l'azienda — e può salire o scendere.",
      },
      {
        id: "cedola",
        nome: "Cedola fissa",
        valore: "— Non presente —",
        spiegazione:
          "L'azione NON ha una cedola fissa. L'azienda può scegliere di distribuire " +
          "parte dei profitti come dividendo, ma non è garantito né obbligatorio. " +
          "Questa è una differenza fondamentale rispetto all'obbligazione.",
        assente: true,
      },
      {
        id: "scadenza",
        nome: "Scadenza",
        valore: "— Non presente —",
        spiegazione:
          "L'azione NON ha una scadenza. La tieni finché vuoi, o finché l'azienda esiste. " +
          "Per recuperare il denaro investito, devi venderla — e il prezzo di mercato " +
          "in quel momento può essere diverso da quello che hai pagato.",
        assente: true,
      },
    ],
  },

  "etf": {
    nome: "ETF — Exchange Traded Fund",
    emittente: "Società di gestione del fondo",
    ruolo:
      "Comprando una quota di ETF diventi comproprietario di un paniere di strumenti finanziari.",
    parti: [
      {
        id: "emittente",
        nome: "Gestore del fondo",
        valore: "Società di gestione specializzata",
        spiegazione:
          "La società che costruisce e mantiene il paniere di strumenti che l'ETF contiene. " +
          "Il gestore segue un indice o una strategia definita — non prende decisioni " +
          "discrezionali su cosa comprare o vendere.",
      },
      {
        id: "paniere",
        nome: "Contenuto (paniere)",
        valore: "Molti strumenti insieme — anche centinaia",
        spiegazione:
          "Un ETF contiene al suo interno molti strumenti (azioni, obbligazioni o altro). " +
          "Comprando una quota dell'ETF, possiedi indirettamente una piccola parte di tutti " +
          "quei strumenti. Il collegamento con il concetto di distribuzione è diretto.",
      },
      {
        id: "cedola",
        nome: "Distribuzione dei proventi",
        valore: "Dipende dal tipo di ETF",
        spiegazione:
          "Alcuni ETF distribuiscono periodicamente i proventi (dividendi, cedole) degli " +
          "strumenti che contengono. Altri reinvestono automaticamente quei proventi " +
          "nel fondo stesso (ETF ad accumulazione). Il tipo è indicato nel nome del fondo.",
      },
      {
        id: "scadenza",
        nome: "Scadenza",
        valore: "— Non presente —",
        spiegazione:
          "L'ETF non ha scadenza, come le azioni. Si compra e si vende sul mercato " +
          "durante l'orario di borsa, a un prezzo che cambia in tempo reale.",
        assente: true,
      },
    ],
  },
};

/**
 * Mostra le parti di uno strumento finanziario con il pattern disclosure.
 * Ogni parte è un pulsante che rivela la spiegazione — aria-expanded + aria-controls.
 * Non importa strumenti.ts: i dati sono embedded e statici.
 */
export function AnatomiaStrumento({ strumento = "titolo-stato" }: Props) {
  const [parteAperta, setParteAperta] = useState<string | null>(null);
  const dati = DATI_STRUMENTI[strumento];

  function toggleParte(id: string) {
    setParteAperta((corrente) => (corrente === id ? null : id));
  }

  return (
    <article className="bg-surface p-6 md:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-ink">
        {dati.nome}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted">
        Emittente: <strong className="font-semibold text-ink">{dati.emittente}</strong>
      </p>
      <p className="mt-1 border-l-4 border-accent pl-4 text-base leading-relaxed text-ink">
        {dati.ruolo}
      </p>

      <p className="mt-6 text-sm font-semibold text-muted">
        Seleziona una parte per leggerne la spiegazione:
      </p>

      {/* Lista disclosure — ogni item è un pulsante + pannello */}
      <ul className="mt-3 space-y-2" aria-label={`Parti di ${dati.nome}`}>
        {dati.parti.map((parte) => {
          const pannelloId = `pannello-${strumento}-${parte.id}`;
          const aperta = parteAperta === parte.id;

          return (
            <li key={parte.id} className="border-2 border-line bg-paper">
              {/* Trigger disclosure */}
              <button
                type="button"
                aria-expanded={aperta}
                aria-controls={pannelloId}
                onClick={() => toggleParte(parte.id)}
                className={cn(
                  "flex w-full min-h-11 items-center justify-between gap-4 px-4 py-3 text-left",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
                  aperta && "border-b-2 border-line",
                )}
              >
                <span className="flex flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                  <span
                    className={cn(
                      "text-base font-semibold",
                      parte.assente ? "text-muted line-through" : "text-ink",
                    )}
                  >
                    {parte.nome}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      parte.assente ? "text-muted italic" : "text-muted",
                    )}
                  >
                    {parte.valore}
                  </span>
                </span>

                {/* Icona +/× — ruota su open, aria-hidden perché decorativa */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex-shrink-0 text-xl font-semibold text-accent-text",
                    "motion-safe:transition-transform motion-safe:duration-[550ms]",
                    "motion-safe:[transition-timing-function:cubic-bezier(0.85,0,0,1)]",
                    aperta && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>

              {/* Pannello di spiegazione — hidden gestito via attributo HTML */}
              <div
                id={pannelloId}
                hidden={!aperta}
                className="px-4 py-4"
              >
                <p
                  className={cn(
                    "text-base leading-relaxed",
                    parte.assente ? "font-semibold text-ink" : "text-ink",
                  )}
                >
                  {parte.spiegazione}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
