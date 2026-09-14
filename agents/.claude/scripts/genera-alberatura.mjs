/**
 * Genera presentation/guida/alberatura.json — l'indice navigabile del progetto.
 *
 * La lista dei file viene da `git ls-files`: rispetta già .gitignore e su
 * OneDrive è ordini di grandezza più veloce di una scansione ricorsiva.
 *
 * Le descrizioni sono scritte a mano in descrizioni.mjs. Quelle mancanti non
 * vengono inventate: diventano un TODO visibile nella pagina e nel conteggio
 * finale, così un file nuovo o rinominato si nota subito.
 *
 * Uso: npm run alberatura
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FILE, descrizioneDiGruppo, descrizioneCartella } from "./descrizioni.mjs";

const RADICE = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const USCITA = join(RADICE, "presentation", "guida", "alberatura.json");

/** Oltre questa soglia il file viene troncato: nessuno legge 3000 righe in un pannello. */
const MAX_CARATTERI = 30_000;

const ESCLUDI = /\.(woff2|png|jpe?g|ico|gif|pdf|svg)$|package-lock\.json$|^presentation\/vendor\/|^app\/dist\//;

const elenco = execFileSync("git", ["ls-files"], { cwd: RADICE, encoding: "utf8" })
  .split("\n")
  .map((r) => r.trim())
  .filter((r) => r && !ESCLUDI.test(r))
  .sort();

const radice = { nome: "", tipo: "cartella", figli: [] };
let inclusi = 0;
let troncati = 0;
const senzaDescrizione = [];

for (const percorso of elenco) {
  const parti = percorso.split("/");
  let nodo = radice;

  // Crea le cartelle intermedie una sola volta.
  for (let i = 0; i < parti.length - 1; i++) {
    const via = parti.slice(0, i + 1).join("/");
    let figlio = nodo.figli.find((f) => f.tipo === "cartella" && f.nome === parti[i]);
    if (!figlio) {
      const desc = descrizioneCartella(via);
      if (!desc) senzaDescrizione.push(via + "/");
      figlio = { nome: parti[i], tipo: "cartella", via, desc: desc || "", manca: !desc, figli: [] };
      nodo.figli.push(figlio);
    }
    nodo = figlio;
  }

  let contenuto;
  try {
    contenuto = readFileSync(join(RADICE, percorso), "utf8");
  } catch {
    continue; // file non leggibile come testo: lo saltiamo invece di sporcare l'indice
  }

  const peso = statSync(join(RADICE, percorso)).size;
  let tagliato = false;
  if (contenuto.length > MAX_CARATTERI) {
    contenuto = contenuto.slice(0, MAX_CARATTERI);
    tagliato = true;
    troncati++;
  }

  const desc = FILE[percorso] || descrizioneDiGruppo(percorso);
  if (!desc) senzaDescrizione.push(percorso);

  nodo.figli.push({
    nome: parti.at(-1),
    tipo: "file",
    via: percorso,
    desc,
    manca: !desc,
    peso,
    righe: contenuto.split("\n").length,
    tagliato,
    contenuto,
  });
  inclusi++;
}

// Cartelle prima dei file, poi alfabetico: l'occhio cerca la struttura, non i nomi.
function ordina(nodo) {
  nodo.figli.sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo === "cartella" ? -1 : 1;
    return a.nome.localeCompare(b.nome, "it");
  });
  nodo.figli.filter((f) => f.tipo === "cartella").forEach(ordina);
}
ordina(radice);

writeFileSync(
  USCITA,
  JSON.stringify({ generato: new Date().toISOString(), daDescrivere: senzaDescrizione, figli: radice.figli }),
  "utf8",
);

const kb = (statSync(USCITA).size / 1024).toFixed(0);
console.log(`alberatura.json — ${inclusi} file, ${kb} KB${troncati ? `, ${troncati} troncati` : ""}`);

if (senzaDescrizione.length) {
  console.log(`\n⚠ ${senzaDescrizione.length} voci senza descrizione. Aggiungile in .claude/scripts/descrizioni.mjs:`);
  for (const v of senzaDescrizione) console.log(`   ${v}`);
} else {
  console.log("Tutte le voci hanno una descrizione.");
}
