# backend/

Livello dati del prototipo.

- `supabase/` — istanza Supabase self-hosted su Podman (database, auth, API REST)

Non c'è un server applicativo separato: il frontend parla direttamente con PostgREST
attraverso `supabase-js`, e le policy RLS fanno da livello di autorizzazione.
Se durante l'hackathon serve logica che non può stare nel client (per esempio chiamate
a Claude con la chiave API), va aggiunta qui come servizio a sé.
