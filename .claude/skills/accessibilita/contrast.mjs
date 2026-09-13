#!/usr/bin/env node
/**
 * Calcola il rapporto di contrasto WCAG 2.2 fra due colori.
 * Uso:  node contrast.mjs "#A100FF" "#FFFFFF"
 */

function parseHex(input) {
  const h = input.trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Colore non valido: "${input}" (atteso #RRGGBB o #RGB)`);
  }
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

/** Luminanza relativa secondo WCAG 2.x */
function luminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function ratio(a, b) {
  const [l1, l2] = [luminance(parseHex(a)), luminance(parseHex(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const [, , fg, bg] = process.argv;

if (!fg || !bg) {
  console.error('Uso: node contrast.mjs "#A100FF" "#FFFFFF"');
  process.exit(2);
}

try {
  const r = ratio(fg, bg);
  const val = Math.round(r * 100) / 100;
  const esito = (soglia) => (r >= soglia ? "PASS" : "FAIL");

  console.log(`\n  ${fg}  su  ${bg}  =  ${val}:1\n`);
  console.log(`  AA   testo normale (4.5:1)   ${esito(4.5)}`);
  console.log(`  AA   testo grande   (3.0:1)   ${esito(3)}`);
  console.log(`  AA   componenti UI  (3.0:1)   ${esito(3)}`);
  console.log(`  AAA  testo normale (7.0:1)   ${esito(7)}`);
  console.log(`  AAA  testo grande   (4.5:1)   ${esito(4.5)}\n`);

  if (r < 4.5) {
    console.log("  Nota: testo grande = almeno 24px, oppure 18.66px in grassetto.\n");
  }
  process.exit(r >= 4.5 ? 0 : 1);
} catch (err) {
  console.error(`Errore: ${err.message}`);
  process.exit(2);
}
