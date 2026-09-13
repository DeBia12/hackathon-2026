---
name: accenture-brand
description: Design system Accenture completo - font Graphik e GT Sectra Fine inclusi, palette, animazioni, hero, card, bottoni, logo animato e coppie di colori verificate WCAG. Usala quando crei o modifichi pagine, interfacce, slide o materiali visivi che devono sembrare fatti da Accenture.
---

# Brand Accenture — design system operativo

Tutti i valori di questo documento sono **misurati da accenture.com/it-it** (settembre 2026),
non stimati: token CSS, curve di animazione, dimensioni dei componenti, file dei font.

## Cosa contiene la skill

| File | Cosa fa |
|---|---|
| `accenture.css` | Design system pronto all'uso: token, componenti, animazioni. Importalo e hai finito. |
| `template.html` | Pagina completa d'esempio: hero, griglia di card, sezione editoriale. **Parti da qui.** |
| `tailwind-preset.js` | Gli stessi token come preset Tailwind. |
| `assets/fonts/` | I 4 font reali in woff2 — Graphik 400/500/600, GT Sectra Fine 300. |
| `assets/fonts.css` | Le regole `@font-face`. |
| `assets/logo/` | Logo completo, solo il segno `>`, chevron per le CTA. |
| `assets/reference/` | Screenshot del sito vero, per confronto visivo. |

### Avvio rapido

```html
<link rel="stylesheet" href="path/to/accenture-brand/accenture.css">
```

Con Tailwind: importa il preset in `tailwind.config.ts` **e** `assets/fonts.css` nel CSS di ingresso.
Il preset porta i colori e le curve, non i font.

> I font sono **proprietari** (Commercial Type, Grilli Type). Uso interno Accenture: non
> ridistribuirli e non pubblicarli su un repository aperto. Senza i file, il fallback
> `Arial/Helvetica` regge la composizione ma perde il carattere.

## Le due firme del brand

Sono le cose che rendono una pagina riconoscibile come Accenture. Se ne implementi solo due, queste.

**1. Il `>` dentro la parola.** Non accanto al titolo: *dentro*. Il sito scrive
`REIN>ENTARE` sostituendo la V con il segno. È il gesto più identitario del brand.

```html
<h1 class="acn-hero__headline">
  <span class="acn-sr-only">Insieme per reinventare</span>
  <span aria-hidden="true">Insieme per rein<svg class="acn-hero__mark" viewBox="0 0 32 32">
    <path d="M0 22.6L17.66 16.03L0 9.13V0L30.24 12.18V19.75L0 32V22.6Z"/></svg>entare</span>
</h1>
```

Il testo completo va sempre dato ai lettori di schermo con `.acn-sr-only`, e il pezzo
decorativo nascosto con `aria-hidden`. Altrimenti la parola risulta spezzata.

**2. Una sola curva di movimento.** Tutto il sito si muove con
`cubic-bezier(0.85, 0, 0, 1)` in **550ms**. Parte veloce e frena a lungo. Non mescolare
`ease-in-out` o durate diverse: l'incoerenza del movimento si nota più di un colore sbagliato.

```css
transition: <qualsiasi-proprietà> 550ms cubic-bezier(0.85, 0, 0, 1);
```

## Palette

| Token | HEX | Uso corretto |
|---|---|---|
| `--acn-purple` | `#A100FF` | Riempimenti, il segno `>`, accenti grafici |
| `--acn-purple-2` | `#7500C0` | Hover del primario, **testo viola su fondo chiaro** |
| `--acn-purple-3` | `#460073` | Fondi profondi |
| `--acn-purple-active` | `#57008F` | Stato `:active` dei bottoni |
| `--acn-purple-deep` | `#39005E` | Fondo card viola |
| `--acn-purple-light` | `#BE82FF` | **Viola su fondo scuro** |
| `--acn-purple-focus` | `#DCAFFF` | Anello di focus su fondo scuro |
| `--acn-black` | `#000000` | Sfondo principale del sito |
| `--acn-white` | `#FFFFFF` | Testo su scuro |
| `--acn-surface-light` | `#F1F1EF` | Card e sezioni chiare — grigio **caldo** |
| `--acn-surface-dark` | `#202020` | Card video / scure |
| `--acn-border-light` | `#E3E3DF` | Bordi e divisori |
| `--acn-grey` | `#A2A2A0` | Testo attenuato — **solo su fondo scuro** |
| `--acn-grey-on-light` | `#5F5F5F` | Testo attenuato su fondo chiaro |

Il grigio chiaro del brand è `#F1F1EF`: **caldo**, non neutro. Un `#F5F5F5` qualsiasi
fa sembrare la pagina generica. È il dettaglio che si nota senza saper dire perché.

### Contrasti misurati

Valori reali da `contrast.mjs`, non stimati.

| Combinazione | Rapporto | Verdetto |
|---|---|---|
| `#FFFFFF` su `#000000` | 21.0:1 | ✅ AAA |
| `#BE82FF` su `#000000` | 7.83:1 | ✅ AAA |
| `#A2A2A0` su `#000000` | 8.21:1 | ✅ AAA |
| `#DCAFFF` su `#000000` | 11.62:1 | ✅ AAA |
| `#FFFFFF` su `#39005E` | 15.72:1 | ✅ AAA |
| `#FFFFFF` su `#7500C0` | 8.34:1 | ✅ AAA |
| `#FFFFFF` su `#A100FF` | 5.3:1 | ✅ AA |
| `#000000` su `#F1F1EF` | 18.57:1 | ✅ AAA |
| `#7500C0` su `#F1F1EF` | 7.38:1 | ✅ AAA |
| `#5F5F5F` su `#FFFFFF` | 6.39:1 | ✅ AA |
| `#A100FF` su `#FFFFFF` | 5.3:1 | ✅ AA |
| `#A100FF` su `#F1F1EF` | 4.69:1 | ✅ AA (poco margine) |
| `#A100FF` su `#000000` | **3.96:1** | ❌ **solo testo grande** (≥24px, o ≥18.66px bold) |
| `#A2A2A0` su `#F1F1EF` | **2.26:1** | ❌ **mai** |

### Le tre trappole

**1. Viola pieno su nero non basta.** `#A100FF` su nero dà 3.96:1. Il sito stesso non lo usa
mai per il testo: su fondo scuro il viola di testo è **`#BE82FF`** (7.83:1). Il `#A100FF`
su nero resta valido per riempimenti, il segno `>` e i titoli molto grandi.

**2. I due grigi non sono intercambiabili.** `#A2A2A0` è pensato per il **nero** (8.21:1);
su `#F1F1EF` crolla a 2.26:1. Su fondo chiaro il testo attenuato è `#5F5F5F`.

**3. Il viola di testo cambia con lo sfondo.** Su chiaro `#7500C0`, su scuro `#BE82FF`.
Usare `#A100FF` per il testo funziona solo su bianco, e con poco margine.

Verifica qualsiasi coppia: `node .claude/skills/a11y-check/contrast.mjs "#BE82FF" "#000000"`

## Tipografia

Il brand usa **due** famiglie, non una. È l'errore più comune: usare solo il sans.

**Graphik** (sans) — interfaccia, titoli, testo. Pesi 400, 500, 600.
**GT Sectra Fine** (serif, peso 300) — voce editoriale: sottotitoli d'apertura, citazioni,
frasi di manifesto. Mai per il testo di lettura lungo, mai per l'interfaccia.

```css
font-family: "Graphik", Arial, Helvetica, sans-serif;
font-family: "GT Sectra Fine", Palatino, serif;
```

| Classe | Dimensione (a 1440px) | Peso | Interlinea | Spaziatura |
|---|---|---|---|---|
| `.acn-display` | 100px | 600 | 1.1 | −3px, MAIUSCOLO |
| `.acn-h1` | 64px | 500 | 1.15 | −0.03em |
| `.acn-h2` | 48px | 500 | 1.2 | −0.03em |
| `.acn-h3` | 32px | 500 | 1.25 | −0.02em |
| `.acn-editorial` | 32px | 300 | 1.25 | serif |
| `.acn-body` | 16px | 400 | 1.6 | — |
| `.acn-eyebrow` | 14px | 500 | 1.2 | +0.02em, MAIUSCOLO |

Due regole che il sito applica ovunque:
- **I titoli hanno spaziatura negativa.** Da −0.02em in giù man mano che crescono. Un titolo
  a spaziatura normale non sembra Accenture.
- **Il peso massimo è 600.** Niente `700`, niente `bold`. La forza viene dalla dimensione.

Sopra i 1440px il sito scala tutto linearmente fino a 1920px (fattore 1.333).
Le classi in `accenture.css` lo riproducono con `clamp()`.

## Componenti

### Bottoni

Il primario **non cambia colore di sfondo**: un gradiente scorre da destra a sinistra
sotto il testo. È la meccanica esatta del sito.

```css
background-image: linear-gradient(90deg, #7500C0 50%, #A100FF 0);
background-size: 200% 200%;
background-position-x: 100%;        /* a riposo */
/* :hover → background-position-x: 0 */
```

| Classe | Aspetto | Hover |
|---|---|---|
| `.acn-btn--primary` | Fondo viola pieno | Wipe a gradiente verso `#7500C0` |
| `.acn-btn--secondary` | Solo contorno 1px | Il testo sbiadisce verso il grigio |
| `.acn-btn--tertiary` | Testo + quadrato viola col `>` | Il quadrato scivola di 4px a destra |

Altezza minima **48px**, angoli a **0**, larghezza `fit-content`.

```html
<a class="acn-btn acn-btn--tertiary" href="#">
  Scopri di più
  <span class="acn-btn__icon" aria-hidden="true">
    <svg viewBox="0 0 32 32"><path d="M0 22.6L17.66 16.03L0 9.13V0L30.24 12.18V19.75L0 32V22.6Z"/></svg>
  </span>
</a>
```

### Card

Anatomia reale: **testo in alto, immagine sotto**. Non il contrario, e mai testo sopra
l'immagine. 300×424px, nessun raggio, **nessuna ombra**. In hover l'intera card scala del 4%.

```html
<a class="acn-card" href="#">
  <div class="acn-card__body">
    <p class="acn-card__label">Report di ricerca</p>
    <h3 class="acn-card__title">Titolo su due o tre righe</h3>
  </div>
  <div class="acn-card__media"><img src="..." alt=""></div>
</a>
```

Varianti: `.acn-card` (nera), `--light` (`#F1F1EF`, testo nero), `--deep` (`#39005E`),
`--dark` (`#202020`). Griglia a 4 colonne con `.acn-card-grid`.

### Hero

Fondo nero o immagine a tutto campo, griglia a 12 colonne, padding `60px 80px`.
Titolo sulle prime 8 colonne, corpo sulle ultime 4 allineato in basso, preceduto dal
trattino viola `42×5px` (`.acn-deco-line`).

La sequenza d'ingresso: sfondo in dissolvenza (550ms) → titolo che sale (750ms) → corpo
(1500ms) → il `>` che si raddrizza ruotando da 90°.

### Logo

Il logo è **animato**. A riposo si vede solo il `>` a tutta altezza; in hover rimpicciolisce
(`scale: .396`), scivola di `88.5px` a destra sopra la "t", e la parola "accenture" risale
al suo posto. Usa `assets/logo/accenture-logo.svg` con le classi `.acn-logo__mark` e
`.acn-logo__text` sui due path. Per header compatti: `.acn-logo--mark` mostra solo il segno.

## Layout e spazio

- Griglia **4 / 8 / 12** colonne ai breakpoint 600px e 1024px.
- Gutter orizzontale: 16px mobile → 48px tablet → **80px** desktop.
- Scala di spaziatura: **16 / 32 / 48 / 96 / 160px**. Non inventare valori intermedi.
- Sezioni: 96px di padding verticale, 160px a desktop. Il respiro è parte del brand.
- Larghezza massima della pagina: 1920px, centrata.
- Header alto **72px**.

## Accessibilità

Il sito reale rispetta queste regole: mantenerle non è un compromesso sul brand.

- **Salto al contenuto**: `.acn-skip-link` come **primo elemento** del `<body>`, puntato
  all'id del `<main>` o della prima sezione. Compare solo col focus da tastiera.
- **Focus**: `outline: 2px solid` con `outline-offset: 8px`. Il default è `#DCAFFF`
  (la pagina è scura); dentro `.acn-light` passa a `#A100FF`. Mai `outline: none` senza
  sostituto.
- **Movimento ridotto**: `accenture.css` copre `prefers-reduced-motion` azzerando durata
  **e ritardo**, più gli hover di scala. Se aggiungi animazioni tue, coprile anche lì.
- **Rivelazione allo scroll**: `.acn-reveal` + `.is-visible` via IntersectionObserver.
- Target touch minimo 24×24px; i bottoni sono già a 48px.
- Il `>` decorativo dentro le parole va sempre con `aria-hidden` + testo completo in `.acn-sr-only`.

### Tre errori che questo design system rende facili

Sono emersi dall'audit del template. Se generi una pagina nuova, controlla questi tre punti.

**1. Non mettere `class="js"` nel markup di `<html>`.** La regola `.js .acn-reveal` porta
`opacity: 0`: se la classe è già nell'HTML, scatta al parsing del CSS e senza JavaScript il
contenuto resta invisibile **per sempre**. La classe la aggiunge lo script a fine pagina.

**2. Non scrivere `body:not(.acn-light) :focus-visible`.** La classe `.acn-light` sta sulle
*sezioni*, non sul `<body>`: quel selettore è sempre vero e applica l'anello chiaro anche
dentro le sezioni chiare, dove `#DCAFFF` su `#F1F1EF` dà 1.6:1. Regola giusta: default
chiaro, eccezione `.acn-light`.

**3. In `prefers-reduced-motion` azzera anche `animation-delay`.** Con `fill-mode: backwards`
e un ritardo di 1500ms, azzerare solo la durata lascia il contenuto invisibile per un secondo
e mezzo a chi ha chiesto meno animazioni.

### Una scelta consapevole

Le card sono `<a>` che contengono un `<h3>`. Il nome accessibile del link diventa
"Report di ricerca — Titolo", leggermente ridondante ma informativo, e tutta l'area resta
cliccabile. È il compromesso scelto: l'alternativa (`<article>` + link con `aria-labelledby`)
è più pulita per la navigazione per heading ma perde il target esteso. Se ti serve quella,
il pattern è nel referto dell'`a11y-auditor`.

Prima di dichiarare finita una UI, lancia l'agente `a11y-auditor`.

## Da evitare

- Angoli arrotondati, ombre, bordi sfumati — il brand è **piatto e squadrato**.
- `font-weight: 700` o superiore.
- Titoli senza spaziatura negativa.
- Grigio neutro (`#F5F5F5`) al posto del grigio caldo `#F1F1EF`.
- Curve di animazione diverse da quella del brand.
- Viola su viola, o `#A100FF` come colore di testo su fondo scuro.
- Più accenti viola nella stessa schermata: il viola evidenzia **una** cosa.
