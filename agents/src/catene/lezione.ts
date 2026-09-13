import { chiedi } from "../client.ts";
import { semplifica } from "../agenti/semplificatore.ts";

export interface Lezione {
  titolo: string;
  concetto: string;
  esempio: string;
  domanda: string;
  risposta: string;
}

/**
 * Prompt chaining in tre passaggi: ogni passaggio riceve l'output del precedente
 * e ha un compito solo. Una singola chiamata che fa tutto produce risultati più
 * generici e più difficili da correggere quando sbagliano.
 *
 *   1. struttura  → cosa insegnare e in che ordine
 *   2. contenuto  → il testo vero e proprio
 *   3. semplifica → riscrittura in linguaggio accessibile
 */
export async function generaLezione(argomento: string): Promise<Lezione> {
  // 1. Struttura
  const struttura = await chiedi({
    sistema:
      "Progetti micro-lezioni per adulti che partono da zero. " +
      "Restituisci 4 righe, una per campo, nell'ordine: TITOLO, CONCETTO, ESEMPIO, DOMANDA. " +
      "Ogni riga inizia con l'etichetta seguita da due punti. Niente altro.",
    messaggio: `Progetta una micro-lezione su: ${argomento}`,
    temperatura: 0.7,
  });

  // 2. Contenuto disteso
  const contenuto = await chiedi({
    sistema:
      "Sviluppi micro-lezioni a partire da una struttura. " +
      "Mantieni le stesse 4 etichette (TITOLO, CONCETTO, ESEMPIO, DOMANDA) e aggiungi RISPOSTA. " +
      "CONCETTO: massimo 3 frasi. ESEMPIO: con cifre concrete in euro. " +
      "DOMANDA: verifica la comprensione. Niente altro oltre alle 5 righe.",
    messaggio: struttura,
    temperatura: 0.5,
  });

  // 3. Semplificazione linguistica
  const semplificato = await semplifica(contenuto);

  return estrai(semplificato);
}

/** Estrae i campi etichettati dalla risposta del modello. */
function estrai(testo: string): Lezione {
  const campo = (etichetta: string): string => {
    const trovato = testo
      .split("\n")
      .find((riga) => riga.trim().toUpperCase().startsWith(etichetta));
    return trovato?.slice(trovato.indexOf(":") + 1).trim() ?? "";
  };

  return {
    titolo: campo("TITOLO"),
    concetto: campo("CONCETTO"),
    esempio: campo("ESEMPIO"),
    domanda: campo("DOMANDA"),
    risposta: campo("RISPOSTA"),
  };
}
