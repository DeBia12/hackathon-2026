---
name: brilliant-style
description: Replica lo stile di brilliant.org su una web app - palette, tipografia editoriale, sfondo a griglia diagonale, bottoni spessi, card, movimento a molla e il pattern UX della lezione interattiva. Usala quando costruisci o rivedi interfacce di apprendimento che devono sembrare fatte da Brilliant.
---

# Stile Brilliant — design system operativo

Tutti i valori di questo documento sono **estratti da brilliant.org** (settembre 2026):
token Panda CSS del bundle di produzione, `@font-face` reali, ombre e curve misurate.
Dove un valore è una *ricostruzione* (perché il sito lo genera da JS o da asset chiusi)
è scritto esplicitamente.

## Cosa contiene la skill

| File | Cosa fa |
|---|---|
| `brilliant.css` | Design system pronto all'uso: token, componenti, animazioni. Importalo e hai finito. |
| `theme.css` | Gli stessi token come blocco `@theme` per **Tailwind v4** (quello che usa questo progetto). |
| `template.html` | Pagina completa d'esempio: hero, percorso, card, schermata di lezione, feedback. **Parti da qui.** |
| `references/palette.md` | Le 12 scale di colore complete + tabella dei contrasti misurati. |
| `references/ux-lezione.md` | Il pattern della lezione interattiva, passo per passo. |

### Avvio rapido

```html
<link rel="stylesheet" href="path/to/brilliant-style/brilliant.css">
<body class="br-page">…</body>
```

Con **Tailwind v4** (quello di `app/`): `@import "tailwindcss";` e subito dopo
`@import "../../.claude/skills/brilliant-style/theme.css";` nel CSS di ingresso.
Tutti i token sono prefissati `br-` per non collidere con quelli già in
`app/src/index.css`, e diventano utility: `bg-br-oat-50`, `text-br-gray-950`,
`rounded-br-xl`, `font-br-serif`, `shadow-br-lip`, `ease-br-spring`, `bg-br-griglia`.
I componenti restano in `brilliant.css`: servono a entrambe le strade.

---

## Le tre firme

Sono le cose che rendono una schermata riconoscibile come Brilliant. Se ne implementi
solo tre, queste.

### 1. Il fondo non è bianco: è avena, con una griglia diagonale

`#f5f3f1` (`oat-50`), un beige caldo appena percettibile, attraversato da una **griglia
romboidale a 45 gradi** di linee sottilissime. È l'elemento che dà alla pagina l'aria di
un quaderno a quadretti senza sembrare un quaderno a quadretti.

```css
.br-page {
  background-color: #f5f3f1;
  background-image:
    repeating-linear-gradient( 45deg, #0000000a 0 1px, transparent 1px 64px),
    repeating-linear-gradient(-45deg, #0000000a 0 1px, transparent 1px 64px);
}
```

Il sito usa `repeating-linear-gradient(45deg, …)` con passo di 10px sui pattern piccoli;
il fondo della hero ha il rombo largo. **Non alzare l'opacità sopra `0a`**: appena la
griglia si vede davvero, la pagina diventa rumorosa e il testo perde leggibilità.

### 2. Il bottone ha uno spessore

Non un'ombra: uno **spessore**, ottenuto con un `inset` in basso. Premendolo, il bottone
scende dentro il proprio spessore. È lo stesso gesto fisico dei tasti di una calcolatrice.

```css
.br-btn        { box-shadow: inset 0 -4px #1425634d; }   /* valore letto dal sito */
.br-btn--lg    { box-shadow: inset 0 -6px #1425634d; }
.br-btn:active { transform: translateY(2px); box-shadow: inset 0 -2px #1425634d; }
```

L'ombra è **della famiglia del bottone, non nera**: su blu è `#1425634d` (blue-900 al 30%),
su superfici neutre `#00000026`. Un nero puro sotto un colore saturo lo sporca.

### 3. Il titolo è in grazie, con il concetto in corsivo

L'headline della home è "Your personal tutor for *math and coding*" — serif, e le due
parole che contano sono in **corsivo**. È l'unico posto dove il sito usa il serif: tutto
il resto dell'interfaccia è sans. Il corsivo non decora, **nomina l'argomento**.

```html
<h1 class="br-display">Capire i tuoi soldi, <em>un passo</em> alla volta</h1>
```

---

## Colore

I nomi sono quelli reali del design system di Brilliant. Le scale complete stanno in
`references/palette.md`.

| Ruolo | Token | Valore |
|---|---|---|
| Fondo pagina | `oat-50` | `#f5f3f1` |
| Superficie sollevata (card) | `white` | `#ffffff` |
| Testo primario | `gray-950` | `#141414` |
| Testo secondario | `gray-800` | `#4c4c4c` |
| Bordo | `oat-200` | `#e4e4e4` |
| Azione primaria | `blue-500` | `#456dff` |
| Corretto | `green-500` | `#29cc57` |
| Sbagliato | `red-500` | `#ff5d5d` |
| Attenzione | `yellow-500` | `#f7c325` |
| Accenti giocosi | `mint` `pear` `papaya` `purple` `pink` | `#5cf0b6` `#d8e82e` `#ff775c` `#9d62ff` `#ff6bd5` |

**Il fondo scuro** è `gray-950` `#141414`, mai nero puro. Lì il blu di testo diventa
`blue-400` `#7491ff`.

### Le tre trappole di contrasto

Misurate con `node .claude/skills/accessibilita/contrast.mjs`. Brilliant le attraversa
allegramente; noi no, WCAG 2.2 AA non è negoziabile in questo progetto.

| Combinazione del sito | Misura | Cosa usare invece |
|---|---|---|
| bianco su `blue-500` `#456dff` | **4.3:1** ❌ | bianco su `blue-600` `#375ce3` = **5.52:1** ✅ |
| bianco su `green-500` `#29cc57` | **2.13:1** ❌ | `gray-950` su `green-500` = **8.66:1** ✅ |
| bianco su `red-500` `#ff5d5d` | **3.01:1** ❌ | bianco su `red-800` `#9c2e2e` = **7.38:1** ✅ |

La regola che ne esce, e che vale per tutti i colori vivaci della palette:
**sui riempimenti chiari e saturi il testo va nero, non bianco.** Verde, lime, menta,
giallo e papaya reggono `#141414` con margine larghissimo (da 7:1 a 13,6:1). Il blu è
l'unico che chiede il testo bianco, e allora va scurito a `blue-600`.

Coppie sicure, già verificate:

```
#141414 su #f5f3f1 = 16.64:1   testo su fondo pagina
#4c4c4c su #f5f3f1 =  7.76:1   testo secondario
#294bc6 su #ffffff =  7.20:1   link e testo blu su card
#141414 su #29cc57 =  8.66:1   feedback "corretto"
#141414 su #d8e82e = 13.60:1   pastiglia della serie
#7491ff su #141414 =  6.35:1   blu su fondo scuro
```

E il grigio da non usare mai su chiaro: `gray-500` `#999999` su `#f5f3f1` = **2.57:1**.
È un grigio da fondo scuro. Su chiaro il minimo è `gray-700` `#666666` (5.19:1).

---

## Tipografia

Il sito usa due famiglie proprietarie di Contrast Foundry:

| Famiglia | Dove | Pesi reali |
|---|---|---|
| **CoFo Brilliant** | tutta l'interfaccia | 400, 500, 700 + corsivi |
| **CoFo Robert** | headline editoriali | 500 + corsivo |

Non sono ridistribuibili. Le sostituzioni migliori, entrambe su Google Fonts e già
impostate in `brilliant.css`:

- al posto di **CoFo Robert** → **Fraunces** (`opsz` alto, peso 500-600, corsivo vivo)
- al posto di **CoFo Brilliant** → **Figtree** (grotesque geometrico morbido), oppure
  **Inter** se preferisci la scelta più sicura

Scala tipografica, con la regola che conta: **il display è grande davvero**, il corpo
resta 16-18px, e in mezzo non c'è niente se non i titoli di sezione.

```
display   clamp(2.5rem, 6vw, 4.5rem)   Fraunces 600, line-height .95, ls -.02em
h2        clamp(1.75rem, 3vw, 2.5rem)  sans 700, line-height 1.1
h3        1.25rem                      sans 700
corpo     1.0625rem (17px)             sans 400, line-height 1.6
etichetta .8125rem                     sans 500, ls .08em, maiuscolo
```

Il valore `letter-spacing: .08em` sulle etichette maiuscole è letto dal CSS del sito,
non stimato.

---

## Forma, spazio, elevazione

- **Raggi**: `xs .375rem` · `md .5rem` · `lg .75rem` · `xl 1rem` · `2xl 1.25rem` ·
  `3xl 2rem` · `full 9999px`. Le card stanno su `xl`/`2xl`, i bottoni su `full` o `xl`,
  le foto su `lg`.
- **Spaziatura**: scala da 4px, identica a Tailwind. Le sezioni respirano: `96px` fra una
  sezione e l'altra, `24px` dentro una card.
- **Ombre**: quasi assenti. Solo tre, dal sito: `0 1px 3px #0000000a` (sottile),
  `0 0 15px` (base), `0 0 25px` (media). Sono diffuse e **senza offset verticale**: il
  sollevamento lo fa il colore della superficie (bianco su avena), non l'ombra.
- **Bordo**: `1px solid #e4e4e4`. Ogni card ne ha uno. È quello che tiene insieme la
  composizione quando l'ombra non c'è.

---

## Movimento

Il sito dichiara una molla e la usa ovunque:

```css
--br-spring: cubic-bezier(.2, 1.1, .36, 1);   /* supera e rientra */
--br-spring-time: .833s;                      /* valore letto dal sito */
--br-ease-out: cubic-bezier(.16, 1, .3, 1);   /* uscite lunghe */
--br-fast: .15s;  --br-base: .2s;  --br-slow: .5s;
```

Tre regole di comportamento, dedotte dai keyframe reali del bundle (`shakeX`,
`xpCounterPulse`, `slideFromBottom`, `fillProgress`, `endstateStreakDayBounce`):

1. **Ogni risposta produce movimento.** Corretto: la card fa `pop` (scala 1 → 1.04 → 1).
   Sbagliato: `shakeX`, tre oscillazioni da 6px in 400ms. Mai un cambio di colore muto.
2. **Il feedback entra dal basso**, con `slideFromBottom` e la molla. Non compare: arriva.
3. **I numeri contano, non saltano.** Punti e serie si incrementano con `xpCounterPulse`,
   una pulsazione di scala sincronizzata all'aggiornamento del valore.

E la regola di accessibilità che il sito **non** rispetta abbastanza e noi sì:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

Lo shake in particolare va **sostituito**, non solo accorciato: chi ha disattivato le
animazioni deve comunque capire di aver sbagliato, e lo capisce dall'icona e dal testo.

---

## I componenti

Sono tutti in `brilliant.css`, namespace `br-`. Quelli che portano lo stile:

| Classe | Cosa fa |
|---|---|
| `.br-page` | Fondo avena + griglia diagonale |
| `.br-display` | Headline serif, con `<em>` in corsivo |
| `.br-btn` `--primary` `--ghost` `--lg` | Bottone con spessore e pressione |
| `.br-card` | Superficie bianca, bordo, raggio `xl`, hover che solleva |
| `.br-tile` | Card colorata con icona: il mattone delle griglie di argomenti |
| `.br-choice` | Opzione di risposta, con stati `is-selected` `is-correct` `is-wrong` |
| `.br-feedback` `--correct` `--wrong` | Pannello che sale dal basso dopo la risposta |
| `.br-progress` | Barra a segmenti della lezione |
| `.br-chip` | Pastiglia (serie, livello, categoria) |
| `.br-path` `.br-path__node` | Il percorso a nodi: fatto / corrente / bloccato |
| `.br-stat` | Numero grande + etichetta, per la prova sociale |

---

## Il pattern della lezione

È la parte di Brilliant che vale più di tutto il resto messo insieme, ed è **UX, non CSS**.
Sta per esteso in `references/ux-lezione.md`. In una riga ciascuno:

1. **Una domanda per schermata.** Niente scroll, niente form multipli.
2. **Si manipola, non si legge.** L'oggetto della lezione è interattivo: si trascina, si
   tocca, si sceglie. Il testo spiega *dopo* che hai provato.
3. **Il feedback è immediato e spiega.** Non "Sbagliato": *perché* è sbagliato, in due righe.
4. **L'errore non costa niente.** Si riprova sulla stessa schermata, senza perdere stato.
5. **Il progresso è sempre visibile**, in alto, a segmenti, e si riempie a ogni passo.
6. **La chiusura celebra un numero**: quanti passi, quale serie, quanto tempo.

---

## Cosa NON copiare

- **Il bianco su verde e su blu chiaro.** Vedi la tabella dei contrasti: sono i due punti
  in cui il sito sta sotto AA. Rifarli è un errore che si vede in audit.
- **Il grigio `#999` sui fondi chiari.** È il grigio dei temi scuri.
- **La gamification competitiva** (leghe, classifiche). In un'app di educazione finanziaria
  mette fretta a chi deve capire con calma, ed è il contrario dell'obiettivo. Tieni
  progresso e serie, lascia perdere il confronto con gli altri.
- **Le illustrazioni 3D generate.** Sono un asset di prodotto, non uno stile replicabile in
  cinque ore. Usa forme geometriche piene nei colori della palette: rendono la stessa aria
  con un `<svg>` da dieci righe.

---

## Convivenza con `accenture-brand`

Sono due sistemi diversi e **non vanno mescolati sulla stessa superficie**: Accenture è
squadrato (raggio 0), nero e viola, con una sola curva a 550ms; Brilliant è morbido
(raggio 16px), avena e blu, con una molla che supera e rientra.

In questo repository la divisione è già netta: `accenture-brand` vale sul deck in
`presentation/`, questa skill vale sulla web app in `app/`. Se una schermata deve
sembrare di Accenture, non usare questa skill: usa quella.
