import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Client Supabase verso l'istanza self-hosted locale (Podman).
 * Avviala con `npm run db:up` dalla radice del progetto.
 *
 * Usa SOLO la anon key: rispetta le policy RLS. La service_role key bypassa RLS
 * e non deve mai comparire in codice che finisce nel bundle del browser.
 */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey)
    : null;

/** True se la configurazione Supabase è presente: permette all'app di girare anche senza DB. */
export const supabaseAttivo = supabase !== null;

if (!supabaseAttivo && import.meta.env.DEV) {
  console.warn(
    "Supabase non configurato: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY mancanti in .env.\n" +
      "L'app funziona comunque, ma senza persistenza.",
  );
}
