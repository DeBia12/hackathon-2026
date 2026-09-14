# Linguaggio visivo — fintech didattico morbido

> **Questo documento sostituisce `accenture-brand` per la web app.** Decisione
> esplicita dell utente: «Non voglio lo stile Accenture nel sito». Non invocare la
> skill `accenture-brand` e non applicare raggio 0, nero puro o viola `#A100FF`.
> La skill resta valida solo per il deck in `presentation/`.

## L intenzione

Il pubblico è 18-30 anni con zero conoscenze finanziarie e una certa soggezione
verso l argomento. Forme arrotondate, ombre leggere, molto bianco e colori chiari
abbassano la barriera d ingresso più di quanto farebbe un estetica istituzionale.

Il riferimento è una dashboard fintech didattica: card generose su fondo appena
lavanda, tessere-icona colorate per categoria, bottoni a pillola verdi, titoli
grandi e amichevoli, grafici morbidi.

**Professionale, non infantile.** Niente emoji, niente illustrazioni cartoon,
niente esclamazioni.

## I token — usa questi, non valori grezzi

Sono già definiti in `app/src/index.css`. **Non aggiungerne di nuovi** e non
scrivere colori esadecimali nei componenti.

| Classe Tailwind | Quando |
|---|---|
| `bg-fondo` | fondo pagina, lavanda tenue `#F7F7FB` |
| `bg-paper` | card e superfici bianche |
| `bg-surface` | tessere e superfici appena sollevate |
| `text-ink` | titoli — `#0F172A` |
| `text-muted` | corpo e testo secondario — `#475569`, 7.58:1 su bianco |
| `bg-accent-text` `text-accent-text` | **verde d azione** `#047857` — bianco sopra 5.48:1 |
| `bg-accent` `text-accent` | verde vivo `#059669` — solo riempimenti e grafica, 3.77:1 |
| `bg-accent-tenue` | fondo delle tessere-icona verdi |
| `text-blu` `bg-blu-tenue` | categoria blu `#2563EB` (5.17:1) |
| `text-viola` `bg-viola-tenue` | categoria viola `#7C3AED` (5.7:1) |
| `text-ambra` `bg-ambra-tenue` | categoria ambra `#B45309` (5.02:1) |
| `border-line` | divisori **decorativi** — 1.48:1, mai su elementi interattivi |
| `border-bordo-ui` | bordi di elementi con cui si interagisce — 4.76:1 |
| `rounded-tessera` (12px) · `rounded-brand` (16px) · `rounded-grande` (24px) · `rounded-full` | angoli |
| `shadow-riposo` · `shadow-sollevata` | ombre |

## Le regole di forma

- **Card**: `bg-paper rounded-brand shadow-riposo p-6`, nessun bordo. In hover
  `shadow-sollevata`, dentro `motion-safe:`.
- **Bottoni**: `rounded-full`. Primario `bg-accent-text text-paper`, con la freccia
  `→` a destra dell etichetta (decorativa, `aria-hidden`). Secondario
  `bg-paper text-accent-text border-2 border-accent-text`.
- **Tessere-icona**: quadrato `h-11 w-11 rounded-tessera` con fondo `-tenue` e
  glifo del colore pieno corrispondente. Usa un carattere o una forma SVG semplice,
  **niente librerie di icone**: ogni dipendenza costa build.
- **Barre e grafici**: `rounded-full`, spessore generoso, verde pieno su traccia
  `bg-surface`.
- **Titoli**: grandi, peso 600-700, `tracking-tight`. Qui **non** c è il limite di
  peso 600 del vecchio brand: 700 va bene.
- Molto spazio bianco. Densità bassa. Larghezza di lettura `max-w-prose` sui testi.

## Cosa resta esattamente com era

L accessibilità non è in discussione e non si tocca per ragioni estetiche.
Nel dubbio, il contrasto vince sulla referenza.

- HTML semantico: `<button>`, `<fieldset>`, `<legend>`, `<table>` con `scope`.
- Contrasto **4.5:1** per il testo, **3:1** per bordi e componenti UI. Verifica con
  `node .claude/skills/accessibilita/contrast.mjs "#xxxxxx" "#yyyyyy"`, non a occhio.
- Nessuno stato veicolato dal **solo colore**: sempre anche una parola o un simbolo
  con equivalente testuale. Vale per esiti, moduli bloccati, padronanza, variazioni.
- Focus visibile ovunque; la gestione del focus già presente nei componenti
  **non va rimossa** (è stata aggiunta per correggere tre bloccanti di un audit).
- `aria-live` e `role="status"` esistenti restano, con `aria-atomic="true"`.
- Target minimo 24×24 px; i bottoni restano `min-h-11`.
- Ogni animazione dentro `motion-safe:`.
- Zoom al 200% senza perdita di contenuto.

## Vincoli tecnici

- Solo utility Tailwind. Nessun CSS inline salvo le larghezze percentuali dinamiche
  delle barre, che già esistono e restano.
- **Nessuna nuova dipendenza npm.** Niente librerie di icone o di grafici.
- TypeScript strict, nessun `any`, named export, un componente per file.
- Non modificare la logica, le firme dei componenti o i testi: è un intervento di
  **sola presentazione**. Se un testo ti sembra sbagliato, segnalalo, non cambiarlo.
