#!/usr/bin/env node
/**
 * Hook PreToolUse — impedisce che un commit porti con sé credenziali.
 *
 * Si attiva solo sui comandi git commit. Ispeziona ciò che sta per essere
 * committato, non l'intero albero: un falso positivo su un file non in stage
 * bloccherebbe il lavoro senza motivo.
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const input = (() => {
  try {
    return JSON.parse(readFileSync(0, "utf-8"));
  } catch {
    return null;
  }
})();

const comando = input?.tool_input?.command ?? "";
if (!/\bgit\s+commit\b/.test(comando)) process.exit(0);

let staged;
try {
  staged = execSync("git diff --cached -U0", { encoding: "utf-8", maxBuffer: 20 * 1024 * 1024 });
} catch {
  process.exit(0);
}

const schemi = [
  { nome: "chiave API Anthropic", regex: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { nome: "JWT service_role Supabase", regex: /"role"\s*:\s*"service_role"/ },
  { nome: "token GitHub", regex: /\bgh[pousr]_[A-Za-z0-9]{30,}/ },
  { nome: "chiave privata", regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { nome: "chiave AWS", regex: /\bAKIA[0-9A-Z]{16}\b/ },
];

// Le righe aggiunte sono le uniche che contano: quelle rimosse non entrano nel commit.
const aggiunte = staged
  .split("\n")
  .filter((r) => r.startsWith("+") && !r.startsWith("+++"))
  .join("\n");

const trovati = schemi.filter((s) => s.regex.test(aggiunte));

if (trovati.length === 0) process.exit(0);

console.error(
  `COMMIT BLOCCATO — nelle modifiche in stage c'è: ${trovati.map((t) => t.nome).join(", ")}.\n\n` +
    `Rimuovi il segreto dal codice, spostalo in un file .env (già in .gitignore),\n` +
    `poi rifai 'git add' e riprova. Se è un falso positivo, dillo all'utente\n` +
    `invece di aggirare il controllo.`,
);
process.exit(2);
