#!/usr/bin/env node
/**
 * Hook Stop — esegue il typecheck a fine turno.
 *
 * Non gira su ogni modifica: con tsc a 2-3 secondi per file rallenterebbe
 * troppo. Gira una volta sola, quando il modello sta per dichiarare finito,
 * che è esattamente il momento in cui un errore di tipo non deve passare.
 *
 * Uscita 2 = il turno non si chiude e il modello riceve gli errori da correggere.
 */
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const input = (() => {
  try {
    return JSON.parse(readFileSync(0, "utf-8"));
  } catch {
    return null;
  }
})();

// Il turno è già stato ripreso una volta da questo hook: non insistere,
// altrimenti un errore che il modello non sa correggere diventa un ciclo.
if (input?.stop_hook_active) process.exit(0);

if (!existsSync("app/node_modules")) process.exit(0);

try {
  execSync("npx tsc -b", { cwd: "app", encoding: "utf-8", stdio: "pipe" });
  process.exit(0);
} catch (errore) {
  const output = `${errore.stdout ?? ""}${errore.stderr ?? ""}`.trim();
  const righe = output.split("\n").filter((r) => /error TS\d+/.test(r));

  if (righe.length === 0) process.exit(0);

  console.error(
    `Il typecheck non passa — ${righe.length} error${righe.length === 1 ? "e" : "i"}:\n\n` +
      righe.slice(0, 15).join("\n") +
      (righe.length > 15 ? `\n... e altri ${righe.length - 15}` : "") +
      `\n\nCorreggili prima di chiudere.`,
  );
  process.exit(2);
}
