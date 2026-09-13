import Anthropic from "@anthropic-ai/sdk";

export const MODELLO = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";

let client: Anthropic | null = null;

/**
 * Crea il client alla prima chiamata, non all'import: così i comandi che non
 * parlano con l'API (help, validazioni) funzionano anche senza chiave configurata.
 */
function ottieniClient(): Anthropic {
  if (client) return client;

  const chiave = process.env.ANTHROPIC_API_KEY;
  if (!chiave) {
    throw new Error(
      "ANTHROPIC_API_KEY non impostata.\n" +
        "  1. copia .env.example in .env e inserisci la chiave\n" +
        "  2. rilancia con: node --env-file=../.env --experimental-strip-types src/cli.ts <comando>",
    );
  }

  client = new Anthropic({ apiKey: chiave });
  return client;
}

/**
 * Chiamata singola a Claude che restituisce testo.
 * Gli agenti del progetto passano tutti da qui: un solo punto per log e retry.
 */
export async function chiedi(opzioni: {
  sistema: string;
  messaggio: string;
  maxToken?: number;
  temperatura?: number;
}): Promise<string> {
  const risposta = await ottieniClient().messages.create({
    model: MODELLO,
    max_tokens: opzioni.maxToken ?? 2048,
    temperature: opzioni.temperatura ?? 1,
    system: opzioni.sistema,
    messages: [{ role: "user", content: opzioni.messaggio }],
  });

  // La risposta può contenere blocchi non testuali: teniamo solo il testo.
  return risposta.content
    .filter((blocco): blocco is Anthropic.TextBlock => blocco.type === "text")
    .map((blocco) => blocco.text)
    .join("\n")
    .trim();
}
