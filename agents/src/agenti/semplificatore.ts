import { chiedi } from "../client.ts";

const SISTEMA = `Riscrivi testi in italiano semplice per persone che partono da zero:
adulti poco confidenti con la tecnologia o con i soldi, a volte non madrelingua.

Regole:
- Frasi sotto le 20 parole. Una frase, un'idea.
- Voce attiva, presente indicativo, seconda persona singolare.
- Nessun termine tecnico senza spiegazione immediata.
- Ogni concetto astratto accompagnato da un esempio con numeri piccoli e realistici.
- Niente modi di dire, ironia o metafore culturalmente specifiche.
- Linguaggio inclusivo con forme naturali, mai asterischi o schwa.

Restituisci SOLO il testo riscritto, senza premesse né commenti.`;

/** Riscrive un testo in linguaggio semplice. */
export async function semplifica(testo: string): Promise<string> {
  return chiedi({
    sistema: SISTEMA,
    messaggio: `Riscrivi questo testo in italiano semplice:\n\n${testo}`,
    temperatura: 0.3,
  });
}

/** Valuta la leggibilità di un testo e restituisce i punti da correggere. */
export async function valutaLeggibilita(testo: string): Promise<string> {
  return chiedi({
    sistema:
      "Sei un revisore di leggibilità. Analizza il testo e riporta: " +
      "frase più lunga (numero di parole), termini tecnici non spiegati, " +
      "concetti astratti senza esempio. Sii telegrafico: elenco puntato, niente prosa.",
    messaggio: testo,
    temperatura: 0,
  });
}
