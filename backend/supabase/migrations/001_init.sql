-- 001_init.sql — schema di partenza
--
-- Neutro rispetto alle tre tematiche: percorsi didattici con lezioni e
-- avanzamento per utente. Adattalo o sostituiscilo quando l'idea è definita.
-- Idempotente: si può rilanciare senza errori.

-- ============================================================
--  profili — dati pubblici dell'utente, collegati a auth.users
-- ============================================================
create table if not exists profili (
  id                uuid primary key references auth.users(id) on delete cascade,
  nome              text not null default '',
  -- Preferenze di accessibilità: l'app le legge all'avvio
  testo_grande      boolean not null default false,
  contrasto_elevato boolean not null default false,
  animazioni_ridotte boolean not null default false,
  creato_il         timestamptz not null default now()
);

comment on table profili is 'Profilo utente e preferenze di accessibilità.';

alter table profili enable row level security;

drop policy if exists "ognuno legge il proprio profilo" on profili;
create policy "ognuno legge il proprio profilo"
  on profili for select using (auth.uid() = id);

drop policy if exists "ognuno crea il proprio profilo" on profili;
create policy "ognuno crea il proprio profilo"
  on profili for insert with check (auth.uid() = id);

drop policy if exists "ognuno aggiorna il proprio profilo" on profili;
create policy "ognuno aggiorna il proprio profilo"
  on profili for update using (auth.uid() = id);

-- ============================================================
--  percorsi e lezioni — contenuti, leggibili da tutti
-- ============================================================
create table if not exists percorsi (
  id          uuid primary key default gen_random_uuid(),
  titolo      text not null,
  descrizione text not null default '',
  tematica    text not null check (tematica in (
                'accessibilita', 'finanza', 'digitale')),
  ordine      int not null default 0,
  creato_il   timestamptz not null default now()
);

comment on table percorsi is 'Percorsi didattici, raggruppati per tematica.';

create table if not exists lezioni (
  id          uuid primary key default gen_random_uuid(),
  percorso_id uuid not null references percorsi(id) on delete cascade,
  titolo      text not null,
  concetto    text not null,
  esempio     text not null default '',
  domanda     text not null default '',
  risposta    text not null default '',
  ordine      int not null default 0,
  creato_il   timestamptz not null default now()
);

comment on table lezioni is 'Micro-lezioni: un concetto, un esempio, una verifica.';

create index if not exists lezioni_percorso_idx on lezioni (percorso_id, ordine);

-- I contenuti sono pubblici: leggibili anche senza login
alter table percorsi enable row level security;
alter table lezioni  enable row level security;

drop policy if exists "percorsi leggibili da tutti" on percorsi;
create policy "percorsi leggibili da tutti" on percorsi for select using (true);

drop policy if exists "lezioni leggibili da tutti" on lezioni;
create policy "lezioni leggibili da tutti" on lezioni for select using (true);

-- ============================================================
--  progressi — avanzamento per utente
-- ============================================================
create table if not exists progressi (
  id          uuid primary key default gen_random_uuid(),
  utente_id   uuid not null references auth.users(id) on delete cascade,
  lezione_id  uuid not null references lezioni(id) on delete cascade,
  completata  boolean not null default false,
  punteggio   int check (punteggio between 0 and 100),
  aggiornato_il timestamptz not null default now(),
  unique (utente_id, lezione_id)
);

comment on table progressi is 'Avanzamento di ogni utente per lezione.';

create index if not exists progressi_utente_idx on progressi (utente_id);

alter table progressi enable row level security;

drop policy if exists "ognuno legge i propri progressi" on progressi;
create policy "ognuno legge i propri progressi"
  on progressi for select using (auth.uid() = utente_id);

drop policy if exists "ognuno scrive i propri progressi" on progressi;
create policy "ognuno scrive i propri progressi"
  on progressi for insert with check (auth.uid() = utente_id);

drop policy if exists "ognuno aggiorna i propri progressi" on progressi;
create policy "ognuno aggiorna i propri progressi"
  on progressi for update using (auth.uid() = utente_id);

-- ============================================================
--  crea il profilo automaticamente alla registrazione
-- ============================================================
create or replace function crea_profilo_alla_registrazione()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profili (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_nuovo_utente on auth.users;
create trigger al_nuovo_utente
  after insert on auth.users
  for each row execute function crea_profilo_alla_registrazione();
