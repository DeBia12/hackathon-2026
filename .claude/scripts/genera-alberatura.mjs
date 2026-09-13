/**
 * Genera presentazione/guida/alberatura.json — l'indice navigabile del progetto.
 *
 * La lista dei file viene da `git ls-files`: rispetta già .gitignore e su
 * OneDrive è ordini di grandezza più veloce di una scansione ricorsiva.
 *
 * Uso: npm run alberatura
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RADICE = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const USCITA = join(RADICE, "presentazione", "guida", "alberatura.json");

/** Oltre questa soglia il file viene troncato: nessuno legge 3000 righe in un pannello. */
const MAX_CARATTERI = 30_000;

const ESCLUDI = /\.(woff2|png|jpe?g|ico|gif|pdf|svg)$|package-lock\.json$|^presentazione\/vendor\/|^app\/dist\//;

/** Cartelle: una riga che spiega perché esistono. */
const CARTELLE = {
  ".claude": "Tutto ciò che configura Claude Code: agenti, skill, comandi, hook. È la parte condivisa col team.",
  ".claude/agents": "Gli otto agenti specializzati. Un file = un mestiere, con i suoi strumenti e le sue istruzioni.",
  ".claude/commands": "I comandi slash. Mettono in fila più passaggi in un'unica invocazione.",
  ".claude/hooks": "Script che scattano da soli su eventi precisi. Non dipendono da una decisione del modello.",
  ".claude/skills": "Conoscenza richiamabile. Quattro skill sono nostre, diciassette vengono da mattpocock/skills.",
  ".claude/skills/accenture-brand": "Il design system Accenture estratto dal sito vero: font, colori, animazioni, componenti.",
  ".claude/skills/accessibilita": "Criteri WCAG 2.2 AA e lo script che misura i contrasti invece di stimarli.",
  ".claude/scripts": "Utilità di manutenzione del repository.",
  app: "La web app: Vite + React 19 + TypeScript + Tailwind v4.",
  "app/public": "File serviti così come sono. Qui stanno i font del brand.",
  "app/src": "Il codice sorgente. L'alias @/ punta a questa cartella.",
  "app/src/components": "I componenti React.",
  "app/src/components/ui": "I mattoni riutilizzabili, tutti accessibili per costruzione.",
  "app/src/lib": "Utilità e client esterni.",
  agents: "Agenti programmatici con l'Agent SDK TypeScript, eseguibili fuori da Claude Code.",
  backend: "Supabase self-hosted su Podman.",
  "backend/supabase": "Configurazione dell'istanza locale.",
  "backend/supabase/scripts": "Gli script dietro ai comandi npm run db:*.",
  docs: "Decisioni architetturali e note. La memoria del progetto.",
  presentazione: "Il deck Reveal.js e questa guida.",
  "presentazione/guida": "La guida che stai leggendo.",
  "presentazione/theme": "Il tema Accenture per le slide.",
};

/** File chiave: cosa fanno, in una riga. */
const FILE = {
  "CLAUDE.md": "Le istruzioni che Claude legge a ogni sessione: vincoli, convenzioni, brand, regole di accessibilità.",
  "README.md": "Il punto di ingresso del progetto.",
  "package.json": "Gli script npm. Il pannello dei comandi del progetto.",
  ".claude/settings.json": "Permessi, variabili d'ambiente e registrazione dei tre hook.",
  ".claude/hooks/blocca-segreti.mjs": "Prima di ogni git commit ispeziona ciò che è in stage e blocca le credenziali.",
  ".claude/hooks/verifica-accessibilita.mjs": "Dopo ogni modifica a un .tsx cerca violazioni di accessibilità certe.",
  ".claude/hooks/verifica-tipi.mjs": "A fine turno lancia il typecheck: se fallisce, il turno non si chiude.",
  ".claude/skills/accenture-brand/SKILL.md": "La guida operativa al brand: palette, tipografia, componenti, trappole di contrasto.",
  ".claude/skills/accenture-brand/accenture.css": "Il design system pronto all'uso: token, componenti, animazioni.",
  ".claude/skills/accenture-brand/template.html": "Pagina d'esempio completa. Il punto di partenza per una pagina nuova.",
  ".claude/skills/accessibilita/contrast.mjs": "Calcola il rapporto di contrasto fra due colori secondo WCAG.",
  "app/src/index.css": "I token del brand in un blocco @theme di Tailwind v4, più i quattro @font-face.",
  "app/src/App.tsx": "La pagina principale della web app.",
  "app/src/components/ui/Button.tsx": "Bottone accessibile nelle tre varianti del brand.",
  "app/src/components/ui/Card.tsx": "Card con heading di livello configurabile: la gerarchia si sceglie, non si eredita dall'aspetto.",
  "app/src/components/ui/Field.tsx": "Campo di form con label collegata ed errori annunciati.",
  "app/src/components/SkipLink.tsx": "Il salto al contenuto: primo elemento della pagina, visibile solo da tastiera.",
  "app/src/lib/cn.ts": "Unisce classi Tailwind risolvendo i conflitti.",
  "app/src/lib/supabase.ts": "Client Supabase configurato dalle variabili d'ambiente.",
  "docs/decisioni.md": "Ogni decisione non ovvia: cosa, perché, alternativa scartata. In questo hackathon è il processo.",
  "docs/accessibilita.md": "Registro degli audit e tabella dei contrasti misurati.",
  "presentazione/guida/index.html": "Questa guida.",
  "presentazione/theme/accenture.css": "Il tema Accenture per Reveal.js.",
  ".gitattributes": "Normalizza i fine riga a LF: con CRLF gli script falliscono dentro WSL.",
  ".gitignore": "Cosa resta fuori dal repository.",
  ".env.example": "Le variabili d'ambiente da copiare in .env. Il .env vero non è tracciato.",
};

/** Fallback per estensione, quando il file non è nella mappa. */
function descriviPerTipo(percorso) {
  if (percorso.endsWith("SKILL.md")) {
    const nome = percorso.split("/").at(-2);
    return `Skill \`${nome}\`: le istruzioni che Claude legge quando la invoca.`;
  }
  if (percorso.startsWith(".claude/agents/")) {
    return "Definizione di un agente: mestiere, strumenti concessi, istruzioni operative.";
  }
  if (percorso.startsWith(".claude/commands/")) {
    return "Comando slash: una sequenza di passaggi in un'unica invocazione.";
  }
  if (percorso.startsWith("backend/supabase/scripts/")) return "Script di gestione dell'istanza Supabase locale.";
  if (percorso.endsWith(".tsx")) return "Componente React.";
  if (percorso.endsWith(".ts")) return "Modulo TypeScript.";
  if (percorso.endsWith(".css")) return "Foglio di stile.";
  if (percorso.endsWith(".sql")) return "Migrazione o seed SQL.";
  if (percorso.endsWith(".sh")) return "Script di shell.";
  if (percorso.endsWith(".json")) return "File di configurazione.";
  if (percorso.endsWith(".md")) return "Documentazione.";
  return "";
}

const elenco = execFileSync("git", ["ls-files"], { cwd: RADICE, encoding: "utf8" })
  .split("\n")
  .map((r) => r.trim())
  .filter((r) => r && !ESCLUDI.test(r))
  .sort();

const radice = { nome: "", tipo: "cartella", figli: [] };
let inclusi = 0;
let troncati = 0;

for (const percorso of elenco) {
  const parti = percorso.split("/");
  let nodo = radice;

  // Crea le cartelle intermedie una sola volta.
  for (let i = 0; i < parti.length - 1; i++) {
    const via = parti.slice(0, i + 1).join("/");
    let figlio = nodo.figli.find((f) => f.tipo === "cartella" && f.nome === parti[i]);
    if (!figlio) {
      figlio = { nome: parti[i], tipo: "cartella", via, desc: CARTELLE[via] || "", figli: [] };
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

  nodo.figli.push({
    nome: parti.at(-1),
    tipo: "file",
    via: percorso,
    desc: FILE[percorso] || descriviPerTipo(percorso),
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

writeFileSync(USCITA, JSON.stringify({ generato: new Date().toISOString(), figli: radice.figli }), "utf8");

const kb = (statSync(USCITA).size / 1024).toFixed(0);
console.log(`alberatura.json — ${inclusi} file, ${kb} KB${troncati ? `, ${troncati} troncati` : ""}`);
