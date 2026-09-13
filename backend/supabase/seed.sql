-- seed.sql — dati demo credibili per la presentazione.
--   npm run db:psql -- -f /seed.sql
--
-- Contenuti veri e in italiano: durante la demo i dati finti si notano.
-- Rilanciabile: svuota e ricarica i contenuti, non tocca gli utenti.

begin;

delete from lezioni;
delete from percorsi;

-- ============================================================
--  Educazione finanziaria
-- ============================================================
with p as (
  insert into percorsi (titolo, descrizione, tematica, ordine)
  values (
    'I soldi, spiegati semplice',
    'Come funzionano risparmio, interessi e spese. Senza parole difficili.',
    'finanza', 1
  )
  returning id
)
insert into lezioni (percorso_id, titolo, concetto, esempio, domanda, risposta, ordine)
select p.id, v.titolo, v.concetto, v.esempio, v.domanda, v.risposta, v.ordine
from p, (values
  (
    'Cosa vuol dire risparmiare',
    'Risparmiare vuol dire mettere da parte una piccola somma ogni mese. Non serve essere ricchi. Serve farlo con regolarità.',
    'Metti da parte 20 euro al mese. Dopo un anno hai 240 euro.',
    'Se metti da parte 15 euro al mese, quanto hai dopo un anno?',
    '180 euro. Sono 15 euro per 12 mesi.',
    1
  ),
  (
    'Come funzionano gli interessi',
    'Se lasci i soldi in banca, la banca ti dà un piccolo guadagno ogni anno. Questo guadagno si chiama interesse.',
    'Lasci 100 euro in banca per un anno con il 3 per cento. Dopo un anno hai 103 euro.',
    'Hai 200 euro con il 3 per cento. Quanto hai dopo un anno?',
    '206 euro. Il guadagno è 6 euro.',
    2
  ),
  (
    'Perché il debito costa',
    'Quando prendi soldi in prestito, devi restituire più di quanto hai ricevuto. La differenza è il costo del prestito.',
    'Prendi in prestito 500 euro. Ne restituisci 550. Il prestito ti è costato 50 euro.',
    'Restituisci 660 euro su un prestito di 600. Quanto ti è costato?',
    '60 euro.',
    3
  )
) as v(titolo, concetto, esempio, domanda, risposta, ordine);

-- ============================================================
--  Educazione digitale inclusiva
-- ============================================================
with p as (
  insert into percorsi (titolo, descrizione, tematica, ordine)
  values (
    'Primi passi online',
    'Usare lo smartphone e i servizi digitali senza paura di sbagliare.',
    'digitale', 2
  )
  returning id
)
insert into lezioni (percorso_id, titolo, concetto, esempio, domanda, risposta, ordine)
select p.id, v.titolo, v.concetto, v.esempio, v.domanda, v.risposta, v.ordine
from p, (values
  (
    'Cos è una password sicura',
    'Una password sicura è lunga e difficile da indovinare. Non usare il tuo nome o la tua data di nascita.',
    'La password "mario1970" è debole. La password "TreGattiBlu!" è molto più sicura.',
    'Quale è più sicura: "casa123" o "SetteMeleVerdi?"',
    '"SetteMeleVerdi?" perché è lunga e non contiene dati personali.',
    1
  ),
  (
    'Riconoscere un messaggio falso',
    'Alcuni messaggi sembrano veri ma servono a rubarti i soldi. Chiedono sempre di fare qualcosa in fretta.',
    'Ricevi un SMS: "Il tuo conto è bloccato, clicca subito". La tua banca non scrive mai così.',
    'Un messaggio ti chiede la password per email. Cosa fai?',
    'Non rispondi. Nessun servizio serio chiede la password per email.',
    2
  )
) as v(titolo, concetto, esempio, domanda, risposta, ordine);

-- ============================================================
--  Accessibilità digitale
-- ============================================================
with p as (
  insert into percorsi (titolo, descrizione, tematica, ordine)
  values (
    'Il web per tutti',
    'Perché un sito accessibile è un sito migliore per chiunque.',
    'accessibilita', 3
  )
  returning id
)
insert into lezioni (percorso_id, titolo, concetto, esempio, domanda, risposta, ordine)
select p.id, v.titolo, v.concetto, v.esempio, v.domanda, v.risposta, v.ordine
from p, (values
  (
    'Perché il contrasto conta',
    'Se il testo ha un colore troppo simile allo sfondo, molte persone non riescono a leggerlo. Con poca luce, succede a chiunque.',
    'Testo grigio chiaro su bianco è difficile da leggere. Testo nero su bianco si legge sempre.',
    'Chi ha difficoltà con il testo a basso contrasto?',
    'Chi ha problemi di vista, ma anche chi legge al sole o su uno schermo vecchio.',
    1
  ),
  (
    'Navigare senza mouse',
    'Alcune persone usano solo la tastiera. Ogni pulsante deve essere raggiungibile con il tasto Tab.',
    'Premi Tab su un sito: dovresti vedere un bordo che si sposta di pulsante in pulsante.',
    'Cosa succede se un sito nasconde il bordo del focus?',
    'Chi usa la tastiera non sa più dove si trova e non riesce a navigare.',
    2
  )
) as v(titolo, concetto, esempio, domanda, risposta, ordine);

commit;

select
  p.tematica,
  p.titolo as percorso,
  count(l.id) as lezioni
from percorsi p
left join lezioni l on l.percorso_id = p.id
group by p.tematica, p.titolo, p.ordine
order by p.ordine;
