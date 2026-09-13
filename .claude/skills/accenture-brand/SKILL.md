---
name: accenture-brand
description: Design system e identità visiva Accenture - palette, tipografia, componenti, coppie di colori conformi WCAG. Usala quando crei o modifichi interfacce, slide o materiali visivi che devono rispettare il brand Accenture.
---

# Brand Accenture — guida operativa

## Palette

| Nome | HEX | Uso corretto |
|---|---|---|
| Viola Accenture | `#A100FF` | Riempimenti, bordi, elementi grafici, testo **grande** su bianco, testo su nero |
| Viola testo | `#7500C0` | Testo viola di dimensione normale su sfondo chiaro |
| Viola scuro | `#460073` | Sfondi profondi, gradienti |
| Nero | `#000000` | Testo principale, sfondi slide |
| Bianco | `#FFFFFF` | Sfondo principale, testo su scuro |
| Grigio superficie | `#F3F3F3` | Card, sezioni alternate |
| Grigio testo | `#767676` | Testo secondario (minimo conforme su bianco) |

### Contrasti verificati

Valori misurati con `contrast.mjs` (non stimati):

| Combinazione | Rapporto | Verdetto |
|---|---|---|
| `#000000` su `#FFFFFF` | 21.0:1 | ✅ AAA |
| `#460073` su `#FFFFFF` | 13.93:1 | ✅ AAA |
| `#7500C0` su `#FFFFFF` | 8.34:1 | ✅ AAA |
| `#A100FF` su `#FFFFFF` | 5.3:1 | ✅ AA (non AAA) |
| `#A100FF` su `#F3F3F3` | 4.78:1 | ✅ AA |
| `#767676` su `#FFFFFF` | 4.54:1 | ✅ AA (appena sopra il limite) |
| `#FFFFFF` su `#460073` | 13.93:1 | ✅ AAA |
| `#A100FF` su `#000000` | **3.96:1** | ❌ **solo testo grande** (≥24px o ≥18.66px bold) |
| `#767676` su `#F3F3F3` | **4.09:1** | ❌ **non conforme** |

### Le due trappole del brand

**1. Viola su nero non basta.** `#A100FF` su fondo nero dà 3.96:1, sotto la soglia AA
per il testo normale. Sulle slide a fondo scuro il viola va bene per titoli grandi e
elementi grafici, ma il testo di lettura deve essere bianco.

**2. Grigio su grigio non basta.** `#767676` su `#F3F3F3` dà 4.09:1. Il testo secondario
dentro una card `surface` deve scendere a `#5F5F5F` o più scuro. Su bianco `#767676`
passa (4.54:1), ma è al limite: un tono più chiaro e fallisce.

Il viola pieno `#A100FF` su bianco invece **è** conforme AA (5.3:1) anche per il testo
normale. `#7500C0` resta preferibile quando vuoi margine (8.34:1) o conformità AAA.

Verifica qualsiasi coppia: `node .claude/skills/a11y-check/contrast.mjs "#A100FF" "#000000"`

## Tipografia

Il font ufficiale è **Graphik**, proprietario. Fallback consigliato:

```css
font-family: "Graphik", "Inter", -apple-system, "Segoe UI", system-ui, sans-serif;
```

| Elemento | Dimensione | Peso | Interlinea |
|---|---|---|---|
| Titolo hero | 48–64px | 600 | 1.1 |
| H1 | 40px | 600 | 1.2 |
| H2 | 32px | 600 | 1.25 |
| H3 | 24px | 600 | 1.3 |
| Corpo | 16–18px | 400 | 1.6 |
| Didascalia | 14px | 400 | 1.5 |

Mai sotto 16px per il testo di lettura. Mai `font-weight` inferiore a 400.

## Elementi visivi caratteristici

- **Il "greater than"** `>` è il segno grafico distintivo del brand: usalo come accento
  davanti a titoli o come separatore, in viola.
- **Forme squadrate**: raggio d'angolo 0 o massimo 4px. Niente elementi molto arrotondati.
- **Spazio bianco abbondante**: padding generosi, sezioni ben separate.
- **Accento parsimonioso**: il viola evidenzia *una* cosa per schermata. Se tutto è viola,
  niente è in evidenza.

## Tailwind — token già configurati

```ts
// app/tailwind.config.ts
colors: {
  accent:       "#A100FF",
  "accent-text":"#7500C0",
  "accent-deep":"#460073",
  ink:          "#000000",
  paper:        "#FFFFFF",
  surface:      "#F3F3F3",
  muted:        "#767676",
}
```

Uso tipico:
```tsx
<button className="bg-accent-text text-paper hover:bg-accent-deep min-h-11 px-6">
  Inizia il percorso
</button>

<h2 className="text-3xl font-semibold text-ink">
  <span aria-hidden="true" className="text-accent">&gt;</span> Come funziona
</h2>
```

## Da evitare

- Gradienti arcobaleno o palette fuori brand
- Viola su viola senza contrasto sufficiente
- Ombre pesanti (il brand è piatto e pulito)
- Più di due pesi tipografici nella stessa schermata
