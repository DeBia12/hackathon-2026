# Palette Brilliant — scale complete

Estratte dai token Panda CSS del bundle di produzione di brilliant.org (settembre 2026).
I nomi sono quelli reali del loro design system.

## Neutri

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `oat-50` | `#f5f3f1` | | `gray-500` | `#999999` |
| `oat-200` | `#e4e4e4` | | `gray-700` | `#666666` |
| `gray-50` | `#f8f8f8` | | `gray-800` | `#4c4c4c` |
| `gray-100` | `#f2f2f2` | | `gray-900` | `#383838` |
| `gray-200` | `#e5e5e5` | | `gray-950` | `#141414` |
| `gray-300` | `#cccccc` | | `dark-gray` | `#1e1e1e` |
| `gray-400` | `#b3b3b3` | | `black` / `white` | `#000000` / `#ffffff` |

Nota: nella scala grigia manca il `600`. È così anche nel loro CSS, non è un'omissione.

## Blue — l'azione

`50 #f6f8ff` · `100 #ecf0ff` · `200 #dae2ff` · `300 #abbdff` · `400 #7491ff` ·
**`500 #456dff`** · `600 #375ce3` · `700 #294bc6` · `800 #213c9e` · `900 #142563` · `950 #080f28`

## Green — corretto

`50 #f4fcf7` · `100 #eafaee` · `200 #d4f5dd` · `300 #9fe8b3` · `400 #5ed981` ·
**`500 #29cc57`** · `600 #15b441` · `700 #009b2b` · `800 #007c23` · `900 #004e16` · `950 #001f09`

## Red — sbagliato

`50 #fff7f7` · `100 #ffefef` · `200 #ffdfdf` · `300 #ffb6b6` · `400 #ff8585` ·
**`500 #ff5d5d`** · `600 #e14b4b` · `700 #c43939` · `800 #9c2e2e` · `900 #621c1c` · `950 #270b0b`

## Yellow — attenzione

`50 #fffcf4` · `100 #fef9e9` · `200 #fdf3d3` · `300 #fce49d` · `400 #f9d25c` ·
**`500 #f7c325`** · `600 #d7a613` · `700 #b78900` · `800 #926d00` · `900 #5c4400` · `950 #251b00`

## Gli accenti giocosi

Sono i colori delle tile, delle illustrazioni e delle celebrazioni. Reggono tutti il testo
`#141414` con margine larghissimo; nessuno regge il testo bianco.

| Famiglia | 100 | 300 | **500** | 700 | 900 |
|---|---|---|---|---|---|
| `mint` | `#e7fdf4` | `#aaf7d9` | **`#5cf0b6`** | `#48bb8e` | `#205440` |
| `pear` | `#fbfdea` | `#edf5a1` | **`#d8e82e`** | `#9ead00` | `#5b6300` |
| `papaya` | `#fff0ed` | `#ffc3b8` | **`#ff775c`** | `#cc563d` | `#662a1f` |
| `purple` | `#f5efff` | `#d3b8ff` | **`#9d62ff`** | `#7139cc` | `#381d66` |
| `pink` | `#fff0fb` | `#ffbdec` | **`#ff6bd5`** | `#bf51a0` | `#662b55` |
| `teal` | `#eaf7f6` | `#a0dcd5` | **`#2cb0a1`** | `#218478` | `#124740` |
| `cyan` | `#ebfcfb` | `#c1f6f2` | **`#82ede6`** | `#5ba6a1` | `#274745` |
| `orange` | `#fff4e9` | `#ffcc9c` | **`#ff8d23`** | `#ce6809` | `#673404` |

## Il gradiente della hero

Tre tappe, usato dietro a un velo bianco o nero all'80%:

```css
background-image:
  linear-gradient(0deg, #ffffff00 0%, #ffffff 62.11%),
  linear-gradient(0deg, #ffffffcc 0%, #ffffffcc 100%),
  linear-gradient(66deg, #7491ff 14.55%, #ff90e0 42.56%, #f7c325 73.53%);
```

Sul tema scuro i due veli bianchi diventano `#141414`. L'angolo `66deg` e le tre
posizioni percentuali sono valori letti dal CSS, non stimati.

## Contrasti misurati

Con `node .claude/skills/accessibilita/contrast.mjs "<fg>" "<bg>"`.

### Coppie sicure

| Testo | Fondo | Rapporto | |
|---|---|---|---|
| `#141414` | `#f5f3f1` oat | **16.64:1** | AAA |
| `#ffffff` | `#141414` scuro | **18.42:1** | AAA |
| `#4c4c4c` gray-800 | `#f5f3f1` | **7.76:1** | AAA |
| `#666666` gray-700 | `#f5f3f1` | **5.19:1** | AA |
| `#294bc6` blue-700 | `#ffffff` | **7.20:1** | AAA |
| `#294bc6` blue-700 | `#f5f3f1` | **6.51:1** | AA |
| `#ffffff` | `#375ce3` blue-600 | **5.52:1** | AA |
| `#7491ff` blue-400 | `#141414` | **6.35:1** | AA |
| `#abbdff` blue-300 | `#141414` | **10.05:1** | AAA |
| `#141414` | `#29cc57` green-500 | **8.66:1** | AAA |
| `#007c23` green-800 | `#ffffff` | **5.37:1** | AA |
| `#ffffff` | `#9c2e2e` red-800 | **7.38:1** | AAA |
| `#c43939` red-700 | `#ffffff` | **5.26:1** | AA |
| `#141414` | `#f7c325` yellow | **11.22:1** | AAA |
| `#141414` | `#d8e82e` pear | **13.60:1** | AAA |
| `#141414` | `#5cf0b6` mint | **12.80:1** | AAA |
| `#141414` | `#ff775c` papaya | **7.06:1** | AAA |
| `#7139cc` purple-700 | `#ffffff` | **6.65:1** | AA |

### Coppie da evitare — tutte presenti sul sito vero

| Testo | Fondo | Rapporto | Sostituto |
|---|---|---|---|
| `#ffffff` | `#456dff` blue-500 | **4.30:1** ❌ | fondo `#375ce3` → 5.52:1 |
| `#456dff` | `#ffffff` | **4.30:1** ❌ | testo `#294bc6` → 7.20:1 |
| `#456dff` | `#f5f3f1` | **3.88:1** ❌ | testo `#294bc6` → 6.51:1 |
| `#ffffff` | `#29cc57` green-500 | **2.13:1** ❌ | testo `#141414` → 8.66:1 |
| `#009b2b` green-700 | `#ffffff` | **3.67:1** ❌ | testo `#007c23` → 5.37:1 |
| `#ffffff` | `#ff5d5d` red-500 | **3.01:1** ❌ | fondo `#9c2e2e` → 7.38:1 |
| `#999999` gray-500 | `#f5f3f1` | **2.57:1** ❌ | testo `#666666` → 5.19:1 |
| `#ffffff` | `#9d62ff` purple-500 | **3.73:1** ❌ | testo `#141414`, o fondo `#7139cc` |

I valori sotto 4.5:1 ma sopra 3:1 restano validi per **testo grande** (24px, o 18.66px in
grassetto) e per **componenti UI** — bordi, icone, riempimenti senza testo sopra.
Il `blue-500` come colore di riempimento va benissimo: è il testo bianco sopra che no.
