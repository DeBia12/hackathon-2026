---
name: accenture-brand
description: Tema Accenture per la presentazione finale in Reveal.js - sfondo nero animato col video della hero di accenture.com, keyframe e curve copiati dal sito, font Graphik e GT Sectra Fine, coppie di colori verificate WCAG. Usala solo quando lavori sul deck in presentation/, non per la web app.
---

# Brand Accenture — il tema della presentazione

Questa skill copre **una cosa sola: il deck finale** in `presentation/`.
Non è il design system della web app. L'app ha i suoi token in `app/src/index.css` e la
guida in `presentation/guida/` ha la sua copia: nessuno dei due dipende da qui.

Ogni valore è **letto da accenture.com/it-it** col browser (settembre 2026) — keyframe,
durate, ritardi, curve, colori. Dove il deck devia dal sito, la deviazione è dichiarata.

## Cosa contiene

| File | Cosa fa |
|---|---|
| `reveal-accenture.css` | Il tema completo: token, sfondo animato, keyframe del sito, componenti delle slide. |
| `sfondo.js` | Intensità del video slide per slide, e fermo immagine con `prefers-reduced-motion`. |
| `template.html` | Scheletro di deck pronto. **Parti da qui.** |
| `assets/video/` | Il video di sfondo della hero (12s, 1 MB) e il suo poster. |
| `assets/fonts/` + `fonts.css` | Graphik 400/500/600 e GT Sectra Fine 300, i file reali. |
| `assets/logo/` | Logo completo, il solo segno `>`, chevron per le CTA. |
| `assets/reference/` | Screenshot del sito vero, per confronto visivo. |

### Dov'è già installato

`presentation/` lo usa già: `theme/accenture.css` è `reveal-accenture.css` con l'`@import`
dei font riscritto su `theme/fonts.css`, `theme/sfondo.js` è una copia, gli asset video
stanno in `presentation/assets/video/`. **Se modifichi il tema, tocca tutti e due i file**:
sono copie, non un symlink.

```bash
npm run present    # http://localhost:8000
```

> Font e video sono **asset proprietari** (Commercial Type, Grilli Type, Accenture).
> Uso interno: non pubblicarli su un repository aperto.

## Lo sfondo nero animato

Sull'home il fondo della hero è un `<video>` in loop di 12 secondi: una nuvola di
particelle scure che si muove lentamente su nero. È `custom-rad-hero-bg-video.mp4`,
16:9, con un poster PNG per il primo fotogramma.

> **Attenzione a non prendere il file sbagliato.** Nella stessa hero c'è anche
> `Accenture-Reinvented-1920x600.mp4`: quella è la **sigla del logo** (REINVENTED → il
> segno `>` → il lockup "reinvented with accenture"), non uno sfondo. Dietro a una slide
> scriverebbe il wordmark Accenture sotto il titolo del progetto.

Qui il video sta **fisso dietro tutte le slide** e cambia intensità:

| Dove | Opacità | Perché |
|---|---|---|
| Slide normali | `0.28` | Texture, non soggetto. Il testo deve vincere. |
| `.slide-manifesto` | `0.85` | È l'uso che ne fa il sito: titolo, demo, chiusura. |

Il markup sta **fuori da `.reveal`**, come primo figlio del `<body>`, così resta fermo
mentre le slide scorrono:

```html
<div class="acn-sfondo" aria-hidden="true">
  <video class="acn-sfondo__video"
         src="assets/video/accenture-hero-sfondo.mp4"
         poster="assets/video/accenture-hero-poster.png"
         autoplay muted loop playsinline preload="auto"></video>
  <div class="acn-sfondo__velo"></div>
</div>
```

`.acn-sfondo__velo` è l'unica aggiunta rispetto al sito: una vignettatura che tiene il
testo leggibile sopra le particelle. Sul sito non serve perché lì il testo sta a sinistra
e il video a destra; su una slide il testo ci passa sopra.

`sfondo.js` va caricato **dopo** `Reveal.initialize()`: si aggancia a `ready` e
`slidechanged` per alzare e abbassare l'intensità.

## Le animazioni, copiate dal sito

Valori letti dal DOM di accenture.com, non ricostruiti a orecchio. I nomi dei keyframe
sono quelli originali, così chi confronta col sito li ritrova.

| Elemento | Keyframe | Durata | Ritardo | Curva |
|---|---|---|---|---|
| Sfondo | `hero-custom-background` | 1550ms | 550ms | `cubic-bezier(.22,0,.63,1)` |
| Titolo | `hero-custom-headline` | 750ms | 550ms | `cubic-bezier(.38,0,0,1)` |
| Parti del titolo | `hero-custom-headline-left` / `-right` | 750ms | 1500ms | `cubic-bezier(.38,0,0,1)` |
| Corpo | `hero-custom-body` | 1250ms | 1500ms | `cubic-bezier(.38,0,0,1)` |
| Il segno `>` | `hero-custom-headline-V` | 750ms | 3000ms | `cubic-bezier(.38,0,0,1)`, `forwards` |
| Trattino viola | `deco-line-in` | 750ms | — | `cubic-bezier(.38,0,0,1)` |
| Frase editoriale | `editorialAnimation` | 750ms | — | `cubic-bezier(.38,0,0,1)` |

Tutti con `animation-fill-mode: backwards` tranne il `>`, che è `forwards` perché il suo
stato finale — `rotate(0) scale(.95) translateX(.025em)` — va mantenuto.

**La deviazione dichiarata.** I ritardi pieni restano solo su `.slide-manifesto`. Il sito
ha una hero sola; un deck ne ha dodici, e tre secondi di attesa per slide non sono
presentabili. Sulle altre slide valgono `0 / 250 / 350 / 500ms`, tramite le variabili
`--acn-ritardo-titolo`, `--acn-ritardo-parti`, `--acn-ritardo-corpo`, `--acn-ritardo-segno`.

**La transizione fra slide è `fade`, non `slide`.** Con uno sfondo fisso dietro, far
scorrere le slide orizzontalmente crea due movimenti in contrasto.

### La curva della firma

Tutto il resto del sito si muove con `cubic-bezier(0.85, 0, 0, 1)` a **550ms** — 53
transizioni su 53, contate. Parte veloce, frena a lungo. Per hover e cambi di stato usa
quella, in `--acn-curva`.

## Il `>` dentro la parola

Non accanto al titolo: **dentro**. Il sito scrive `REIN>ENTARE` sostituendo la V.
È il gesto più identitario del brand, e nel deck arriva ruotando da 90°.

```html
<h1 class="acn-display">
  <span class="acn-sr-only">Nome del progetto</span>
  <span aria-hidden="true">
    <span class="acn-titolo--sinistra">Nome del</span>
    <span class="acn-titolo--destra">pro<svg class="acn-segno" viewBox="0 0 32 32"
      aria-hidden="true"><path d="M0 22.6L17.66 16.03L0 9.13V0L30.24 12.18V19.75L0 32V22.6Z"/></svg>etto</span>
  </span>
</h1>
```

Il testo completo va **sempre** in `.acn-sr-only`, e il pezzo decorativo in `aria-hidden`.
Altrimenti chi usa un lettore di schermo sente la parola spezzata.

Usalo per **una parola sola** in tutto il deck, dove il suono regge la sostituzione.
Se nessuna parola funziona, non forzarlo: un titolo pulito è meglio di un gioco storto.

## Classi delle slide

| Classe | Cosa fa |
|---|---|
| `.slide-manifesto` | Sfondo a piena intensità, sequenza hero completa. Titolo, demo, chiusura. **Max 3 nel deck.** |
| `.slide-chiara` | Fondo `#F1F1EF`, testo nero. La via di fuga per le slide dense. |
| *(nessuna)* | Slide normale: nero, sfondo attenuato, ritardi corti. |

## Componenti

| Classe | Cosa |
|---|---|
| `.acn-display` | Titolo enorme maiuscolo, −0.045em. Solo sulle manifesto. |
| `.acn-eyebrow` | Occhiello maiuscolo sopra il titolo. |
| `.acn-editoriale` | Serif GT Sectra 300. La voce di manifesto, mai per il testo lungo. |
| `.acn-editoriale--entra` | La stessa, che sale ruotando di 6°. |
| `.acn-riga` | Il trattino viola 42×5px che precede il corpo. |
| `.numero-grande` | Il dato che regge una slide da solo. |
| `.didascalia` | Fonte, nota, attribuzione. |
| `.due-colonne` · `.riquadro` · `.passo` | Layout e blocchi di contenuto. |
| `.acn-cta` | Bottone terziario: testo + quadrato viola col `>` che scivola di 4px. |

## Palette

| Token | HEX | Uso |
|---|---|---|
| `--acn-viola` | `#A100FF` | Riempimenti, il segno `>`, bordi, grafica |
| `--acn-viola-chiaro` | `#BE82FF` | **Testo** viola su fondo scuro |
| `--acn-viola-testo` | `#7500C0` | **Testo** viola su fondo chiaro |
| `--acn-viola-profondo` | `#39005E` | Fondo dei riquadri |
| `--acn-viola-focus` | `#DCAFFF` | Anello di focus su scuro |
| `--acn-nero` / `--acn-bianco` | `#000000` / `#FFFFFF` | Fondo e testo |
| `--acn-superficie` | `#F1F1EF` | Slide chiara — grigio **caldo** |
| `--acn-grigio` | `#A2A2A0` | Testo attenuato — **solo su scuro** |
| `--acn-grigio-chiaro` | `#5F5F5F` | Testo attenuato — **solo su chiaro** |

### Contrasti misurati

Il deck è nero, quindi conta la prima colonna.

| Su nero | | Su chiaro `#F1F1EF` | |
|---|---|---|---|
| `#FFFFFF` | 21.0:1 ✅ AAA | `#000000` | 18.57:1 ✅ AAA |
| `#BE82FF` | 7.83:1 ✅ AAA | `#7500C0` | 7.38:1 ✅ AAA |
| `#A2A2A0` | 8.21:1 ✅ AAA | `#5F5F5F` | 5.65:1 ✅ AA |
| `#DCAFFF` | 11.62:1 ✅ AAA | `#A100FF` | 4.69:1 ✅ AA (poco margine) |
| `#A100FF` | **3.96:1** ❌ solo testo ≥24px | `#A2A2A0` | **2.26:1** ❌ mai |

Le due trappole, entrambe già evitate dal tema:
- **`#A100FF` non è un colore di testo su nero.** Resta per riempimenti e per il `>`.
  Su fondo scuro il viola di testo è `#BE82FF`.
- **I due grigi non sono intercambiabili.** `#A2A2A0` è del nero, `#5F5F5F` del chiaro.

Verifica qualsiasi coppia:
`node .claude/skills/accessibilita/contrast.mjs "#BE82FF" "#000000"`

## Tipografia

Due famiglie, non una. **Graphik** per tutto, **GT Sectra Fine 300** per la voce editoriale.

| Classe | Peso | Spaziatura |
|---|---|---|
| `.acn-display` | 600 | −0.045em, MAIUSCOLO |
| `h1` / `h2` | 600 | −0.03em |
| `h3` | 600 | −0.02em |
| `.acn-editoriale` | 300 serif | 0 |
| `.acn-eyebrow` | 500 | +0.02em, MAIUSCOLO |

Due regole che il sito applica ovunque: **spaziatura negativa** sui titoli (un titolo a
spaziatura normale non sembra Accenture) e **peso massimo 600**, mai `700`. La forza viene
dalla dimensione.

## Accessibilità

Il deck si proietta, ma va anche navigato e letto. Quello che il tema garantisce già:

- **Movimento ridotto**: durate *e ritardi* azzerati, video fermo su un fotogramma della
  nuvola già formata, transizione fra slide a `none`. Azzerare solo la durata è il bug
  classico: con `fill: backwards` e 1500ms di ritardo il contenuto resterebbe invisibile
  un secondo e mezzo proprio a chi ha chiesto meno animazioni.
- **Focus**: `2px` con `outline-offset: 8px`, `#DCAFFF` sul nero e `#A100FF` sulla slide
  chiara. La regola è scritta come *default scuro + eccezione `.slide-chiara`*, non come
  `body:not(.slide-chiara)`: quella classe sta sulle **sezioni**, quindi il selettore
  negato sarebbe sempre vero.
- **Il `>` decorativo** sempre con `aria-hidden` e testo completo in `.acn-sr-only`.
- **Lo sfondo** è `aria-hidden` e `pointer-events: none`.
- **Export PDF**: `@media print` nasconde sfondo, controlli e barra di avanzamento.

Prima di dichiarare finito il deck, lancia l'agente `revisore-accessibilita`.

## Da evitare

- Angoli arrotondati, ombre, bordi sfumati — il brand è **piatto e squadrato**.
- `font-weight: 700` o superiore.
- Titoli senza spaziatura negativa.
- Grigio neutro (`#F5F5F5`) al posto del grigio caldo `#F1F1EF`.
- Curve o durate diverse da quelle della tabella.
- `#A100FF` come colore di testo su fondo scuro.
- Più di un accento viola nella stessa slide: il viola evidenzia **una** cosa.
- Più di tre `.slide-manifesto`: se tutto è manifesto, niente lo è.
