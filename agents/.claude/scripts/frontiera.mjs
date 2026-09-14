#!/usr/bin/env node
/**
 * Calcola la frontiera dei ticket: quelli i cui bloccanti sono tutti completati
 * e che quindi possono partire subito.
 *
 *   node .claude/scripts/frontiera.mjs                  tutti i lavori in .scratch/
 *   node .claude/scripts/frontiera.mjs <cartella>       una cartella di ticket
 *   node .claude/scripts/frontiera.mjs --json           output per un altro programma
 *
 * Serve a /buildmatt: dedurre le dipendenze leggendo i ticket a occhio funziona
 * finché i ticket sono tre. Questo le calcola.
 *
 * Formato atteso (template di to-tickets):
 *   # 03: Titolo del ticket
 *   **Blocked by:** 01, 02        oppure   None (can start immediately)
 *   **Status:** ready-for-agent   oppure   done
 *   - [ ] criterio di accettazione
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const argomenti = process.argv.slice(2);
const json = argomenti.includes("--json");
const percorsoIndicato = argomenti.find((a) => !a.startsWith("--"));

/** Trova le cartelle che contengono ticket. */
function trovaCartelle() {
  if (percorsoIndicato) return [percorsoIndicato];

  const radice = ".scratch";
  if (!existsSync(radice)) return [];

  return readdirSync(radice)
    .map((nome) => join(radice, nome, "issues"))
    .filter((p) => existsSync(p) && statSync(p).isDirectory());
}

function leggiTicket(cartella) {
  return readdirSync(cartella)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const testo = readFileSync(join(cartella, file), "utf-8");

      const intestazione = testo.match(/^#\s*(\d+)\s*:\s*(.+)$/m);
      const numero = intestazione ? intestazione[1].padStart(2, "0") : file.slice(0, 2);
      const titolo = intestazione ? intestazione[2].trim() : file;

      const rigaBloccanti = testo.match(/\*\*Blocked by:\*\*\s*(.+)/i);
      const grezzo = rigaBloccanti ? rigaBloccanti[1].trim() : "";
      // "None (can start immediately)", "nessuno", "-" valgono tutti come nessun blocco
      const bloccanti = /^(none|nessuno|-|n\/a)\b/i.test(grezzo)
        ? []
        : (grezzo.match(/\d+/g) || []).map((n) => n.padStart(2, "0"));

      const rigaStato = testo.match(/\*\*Status:\*\*\s*(.+)/i);
      const stato = rigaStato ? rigaStato[1].trim().toLowerCase() : "";

      const criteri = testo.match(/^- \[( |x)\]/gim) || [];
      const spuntati = criteri.filter((c) => /x/i.test(c)).length;

      // Completato se lo stato lo dice, o se tutti i criteri sono spuntati
      const completato =
        /\b(done|completato|closed|chiuso|merged)\b/.test(stato) ||
        (criteri.length > 0 && spuntati === criteri.length);

      return { numero, titolo, bloccanti, stato, completato, criteri: criteri.length, spuntati, file };
    });
}

const cartelle = trovaCartelle();

if (cartelle.length === 0) {
  const messaggio = percorsoIndicato
    ? `Nessun ticket in ${percorsoIndicato}`
    : "Nessun ticket trovato in .scratch/*/issues/. Genera i ticket con /to-tickets.";
  if (json) console.log(JSON.stringify({ errore: messaggio, frontiera: [] }, null, 2));
  else console.error(messaggio);
  process.exit(1);
}

const risultati = [];

for (const cartella of cartelle) {
  const ticket = leggiTicket(cartella);
  const fatti = new Set(ticket.filter((t) => t.completato).map((t) => t.numero));

  const frontiera = ticket.filter((t) => !t.completato && t.bloccanti.every((b) => fatti.has(b)));
  const attesa = ticket.filter((t) => !t.completato && !t.bloccanti.every((b) => fatti.has(b)));

  // Un bloccante citato che non corrisponde a nessun ticket è un errore nel piano:
  // bloccherebbe per sempre un ticket che nessuno sbloccherà mai.
  const numeri = new Set(ticket.map((t) => t.numero));
  const fantasma = ticket.flatMap((t) =>
    t.bloccanti.filter((b) => !numeri.has(b)).map((b) => ({ ticket: t.numero, bloccante: b })),
  );

  risultati.push({ cartella, totale: ticket.length, completati: ticket.length - frontiera.length - attesa.length, frontiera, attesa, fantasma });
}

if (json) {
  console.log(JSON.stringify(risultati, null, 2));
  process.exit(0);
}

for (const r of risultati) {
  console.log(`\n${r.cartella}  —  ${r.completati}/${r.totale} completati\n`);

  if (r.fantasma.length) {
    console.log("  ATTENZIONE — bloccanti che non esistono:");
    r.fantasma.forEach((f) => console.log(`    ticket ${f.ticket} attende ${f.bloccante}, che non c'è`));
    console.log("");
  }

  if (r.frontiera.length === 0 && r.attesa.length === 0) {
    console.log("  Tutti i ticket sono completati.\n");
    continue;
  }

  console.log(`  PRONTI ORA (${r.frontiera.length}) — un subagent ciascuno:`);
  r.frontiera.forEach((t) =>
    console.log(`    ${t.numero}  ${t.titolo}${t.criteri ? `  [${t.spuntati}/${t.criteri}]` : ""}`),
  );

  if (r.attesa.length) {
    console.log(`\n  IN ATTESA (${r.attesa.length}):`);
    r.attesa.forEach((t) => console.log(`    ${t.numero}  ${t.titolo}  ← attende ${t.bloccanti.join(", ")}`));
  }
  console.log("");
}
