#!/usr/bin/env node
/**
 * CLI degli agenti.
 *
 *   npm run semplifica -- "testo da semplificare"
 *   npm run lezione    -- "interesse composto"
 *
 * Richiede ANTHROPIC_API_KEY. Per caricarla dal .env della radice:
 *   node --env-file=../.env --experimental-strip-types src/cli.ts lezione "budget"
 */
import { semplifica, valutaLeggibilita } from "./agenti/semplificatore.ts";
import { generaLezione } from "./catene/lezione.ts";

const [comando, ...resto] = process.argv.slice(2);
const argomento = resto.join(" ").trim();

const uso = `
Uso: node --env-file=../.env --experimental-strip-types src/cli.ts <comando> <testo>

Comandi:
  semplifica <testo>     Riscrive il testo in italiano semplice
  leggibilita <testo>    Analizza la leggibilità del testo
  lezione <argomento>    Genera una micro-lezione (catena di 3 passaggi)
`;

if (!comando) {
  console.log(uso);
  process.exit(0);
}

if (!argomento) {
  console.error(`Manca il testo per il comando "${comando}".\n${uso}`);
  process.exit(2);
}

try {
  switch (comando) {
    case "semplifica":
      console.log(await semplifica(argomento));
      break;

    case "leggibilita":
      console.log(await valutaLeggibilita(argomento));
      break;

    case "lezione": {
      const lezione = await generaLezione(argomento);
      console.log(`\n  ${lezione.titolo}\n`);
      console.log(`  ${lezione.concetto}\n`);
      console.log(`  Esempio: ${lezione.esempio}\n`);
      console.log(`  Domanda: ${lezione.domanda}`);
      console.log(`  Risposta: ${lezione.risposta}\n`);
      break;
    }

    default:
      console.error(`Comando sconosciuto: "${comando}".\n${uso}`);
      process.exit(2);
  }
} catch (errore) {
  console.error(`Errore: ${errore instanceof Error ? errore.message : errore}`);
  process.exit(1);
}
