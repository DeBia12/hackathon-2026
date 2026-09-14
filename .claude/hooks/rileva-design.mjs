#!/usr/bin/env node
/**
 * Hook PostToolUse — passa la modifica al detector di impeccable (61 regole
 * deterministiche sugli anti-pattern di design generato da AI).
 *
 * Perché un wrapper e non il comando shell del manifest di impeccable: quello
 * usa la sintassi `[ ! -f ... ] || ...` di sh, che su Windows non gira. Qui
 * scegliamo il launcher giusto per la piattaforma (.cmd su win32, sh altrove).
 *
 * Fallisce sempre aperto: un detector non disponibile non deve bloccare il lavoro.
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const stdin = (() => {
  try {
    return readFileSync(0);
  } catch {
    return Buffer.alloc(0);
  }
})();

const base = ".claude/skills/impeccable/scripts";
const windows = process.platform === "win32";
const launcher = windows ? `${base}/impeccable.cmd` : `${base}/impeccable`;

if (!existsSync(launcher)) process.exit(0);

const esito = windows
  ? spawnSync("cmd.exe", ["/c", launcher.replaceAll("/", "\\"), "hook"], { input: stdin, stdio: ["pipe", "inherit", "inherit"] })
  : spawnSync("sh", [launcher, "hook"], { input: stdin, stdio: ["pipe", "inherit", "inherit"] });

process.exit(esito.status === 2 ? 2 : 0);
