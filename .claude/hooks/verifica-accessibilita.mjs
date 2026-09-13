#!/usr/bin/env node
/**
 * Hook PostToolUse — controllo statico di accessibilità sui file .tsx modificati.
 *
 * Cerca solo violazioni certe e verificabili con una regex: niente euristiche
 * che generano falsi positivi, perché un hook che grida al lupo viene ignorato.
 * Uscita 2 = il modello riceve l'elenco e corregge prima di proseguire.
 */
import { readFileSync } from "node:fs";

const leggiInput = () => {
  try {
    return JSON.parse(readFileSync(0, "utf-8"));
  } catch {
    return null;
  }
};

const input = leggiInput();
const percorso = input?.tool_input?.file_path ?? "";

if (!percorso.endsWith(".tsx")) process.exit(0);

let codice;
try {
  codice = readFileSync(percorso, "utf-8");
} catch {
  process.exit(0);
}

const righe = codice.split("\n");
const problemi = [];

const segnala = (indice, regola, correzione) => {
  problemi.push(`  riga ${indice + 1}: ${regola}\n    → ${correzione}`);
};

righe.forEach((riga, i) => {
  // <div onClick> e simili: invisibili a tastiera e screen reader
  if (/<(div|span|p|li)\b[^>]*\sonClick=/.test(riga)) {
    segnala(i, "elemento non interattivo con onClick", "usa <button type=\"button\"> o <a href>");
  }

  // focus soppresso senza sostituto
  if (/outline:\s*["']?none|outline-none/.test(riga) && !/focus-visible/.test(riga)) {
    segnala(i, "focus visivo rimosso", "aggiungi focus-visible:outline-2 focus-visible:outline-offset-2");
  }

  // immagini senza alt
  if (/<img\b(?![^>]*\balt=)/.test(riga)) {
    segnala(i, "<img> senza attributo alt", "aggiungi alt=\"descrizione\" oppure alt=\"\" se decorativa");
  }

  // tabindex positivo: stravolge l'ordine di tabulazione
  if (/tabIndex=\{?["']?[1-9]/.test(riga)) {
    segnala(i, "tabindex positivo", "usa solo tabIndex={0} o tabIndex={-1}");
  }

  // testo grigio su superficie chiara: 4.09:1, sotto la soglia AA
  if (/text-muted\b/.test(riga) && /bg-surface\b/.test(riga)) {
    segnala(i, "text-muted su bg-surface = 4.09:1 (serve 4.5:1)", "usa text-muted-surface (5.75:1)");
  }
});

if (problemi.length === 0) process.exit(0);

console.error(
  `Accessibilità — ${problemi.length} problem${problemi.length === 1 ? "a" : "i"} in ${percorso}:\n` +
    problemi.join("\n") +
    `\n\nCorreggili prima di proseguire. Per un'analisi completa usa l'agente revisore-accessibilita.`,
);
process.exit(2);
