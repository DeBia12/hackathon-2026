#!/usr/bin/env node
/**
 * Genera i segreti dell'istanza Supabase locale.
 *
 *   node backend/supabase/scripts/genera-chiavi.mjs [--forza]
 *
 * Scrive due file, entrambi esclusi da git:
 *   backend/supabase/.env  → segreti dei container (incl. service_role)
 *   .env                   → variabili per app e agenti (solo anon key)
 *
 * Le chiavi Supabase sono normali JWT HS256 firmati con JWT_SECRET:
 * le generiamo qui, senza tool esterni. Non vengono mai stampate a schermo.
 */
import { createHmac, randomBytes } from "node:crypto";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const qui = dirname(fileURLToPath(import.meta.url));
const cartellaSupabase = join(qui, "..");
const radice = join(cartellaSupabase, "..", "..");

const envSupabase = join(cartellaSupabase, ".env");
const envRadice = join(radice, ".env");

const forza = process.argv.includes("--forza");

if (existsSync(envSupabase) && !forza) {
  console.error(
    "backend/supabase/.env esiste già.\n" +
      "Rigenerare le chiavi invalida i dati esistenti e richiede 'npm run db:reset'.\n" +
      "Se è quello che vuoi: node backend/supabase/scripts/genera-chiavi.mjs --forza",
  );
  process.exit(1);
}

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function firmaJwt(payload, segreto) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const corpo = b64url(JSON.stringify(payload));
  const firma = b64url(createHmac("sha256", segreto).update(`${header}.${corpo}`).digest());
  return `${header}.${corpo}.${firma}`;
}

const jwtSecret = randomBytes(32).toString("hex");
const postgresPassword = randomBytes(18).toString("base64url");

const emesso = Math.floor(Date.now() / 1000);
const scadenza = emesso + 60 * 60 * 24 * 365 * 5; // ambiente locale: 5 anni

const anonKey = firmaJwt({ role: "anon", iss: "supabase", iat: emesso, exp: scadenza }, jwtSecret);
const serviceKey = firmaJwt({ role: "service_role", iss: "supabase", iat: emesso, exp: scadenza }, jwtSecret);

// --- 1. segreti dei container ---
writeFileSync(
  envSupabase,
  `# Generato da scripts/genera-chiavi.mjs — NON committare.
# Ambiente locale di sviluppo: questi segreti non valgono altrove.

POSTGRES_PASSWORD=${postgresPassword}
POSTGRES_DB=postgres
POSTGRES_PORT=5432

JWT_SECRET=${jwtSecret}
JWT_EXPIRY=3600

ANON_KEY=${anonKey}
SERVICE_ROLE_KEY=${serviceKey}

API_EXTERNAL_URL=http://localhost:8000
SITE_URL=http://localhost:5173
ADDITIONAL_REDIRECT_URLS=http://localhost:5173
API_GW_PORT=8000
STUDIO_PORT=3000
`,
  "utf-8",
);

// --- 2. variabili per app e agenti ---
// Conserva ANTHROPIC_API_KEY se il .env della radice esiste già.
let chiaveAnthropic = "sk-ant-...";
if (existsSync(envRadice)) {
  const precedente = readFileSync(envRadice, "utf-8");
  const trovata = precedente.match(/^ANTHROPIC_API_KEY=(.*)$/m);
  if (trovata?.[1]) chiaveAnthropic = trovata[1];
}

writeFileSync(
  envRadice,
  `# Generato da backend/supabase/scripts/genera-chiavi.mjs — NON committare.

# --- Anthropic ---
ANTHROPIC_API_KEY=${chiaveAnthropic}
ANTHROPIC_MODEL=claude-sonnet-5

# --- Supabase locale ---
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}

# --- Frontend (solo VITE_* arriva al browser) ---
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=${anonKey}
`,
  "utf-8",
);

console.log(`
✓ backend/supabase/.env   segreti dei container
✓ .env                    variabili per app e agenti

Entrambi sono in .gitignore. Le chiavi non sono state stampate: le trovi nei file.

${chiaveAnthropic === "sk-ant-..." ? "Ricordati di inserire ANTHROPIC_API_KEY in .env\n" : ""}Prossimo passo: npm run db:up
`);
