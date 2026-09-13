/**
 * Preset Tailwind con i token Accenture misurati da accenture.com.
 *
 * ATTENZIONE — questo preset è per Tailwind v3:
 *   import accenture from "../.claude/skills/accenture-brand/tailwind-preset.js";
 *   export default { presets: [accenture], content: [...] };
 *
 * Su Tailwind v4 i preset non si usano: i token si dichiarano in un blocco `@theme`
 * dentro il CSS di ingresso. Questo progetto è su v4 — l'implementazione viva è in
 * `app/src/index.css`, che è anche l'esempio migliore da copiare.
 *
 * I font vanno caricati a parte: importa assets/fonts.css nel CSS di ingresso.
 */
export default {
  theme: {
    extend: {
      colors: {
        // Viola del brand
        accent: "#A100FF",          // riempimenti, il segno ">", accenti
        "accent-2": "#7500C0",      // hover + testo viola su fondo CHIARO
        "accent-3": "#460073",      // fondi profondi
        "accent-active": "#57008F", // stato :active
        "accent-deep": "#39005E",   // fondo card scura viola
        "accent-light": "#BE82FF",  // viola su fondo SCURO — 7.83:1 su nero
        "accent-focus": "#DCAFFF",  // anello di focus su fondo scuro

        // Neutri
        ink: "#000000",
        paper: "#FFFFFF",
        surface: "#F1F1EF",         // grigio CALDO, non neutro
        "surface-dark": "#202020",
        "surface-dark-2": "#2B2B2B",
        border: "#E3E3DF",
        muted: "#A2A2A0",           // solo su fondo SCURO (8.21:1 su nero)
        "muted-on-light": "#5F5F5F", // su fondo chiaro (6.39:1 su bianco)
      },

      fontFamily: {
        sans: ['"Graphik"', "Arial", "Helvetica", "sans-serif"],
        serif: ['"GT Sectra Fine"', "Palatino", '"Times New Roman"', "serif"],
      },

      fontSize: {
        // [dimensione, { interlinea, spaziatura }]
        eyebrow: ["14px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "500" }],
        body: ["16px", { lineHeight: "1.6" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        h3: ["32px", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        h2: ["48px", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
        h1: ["64px", { lineHeight: "1.15", letterSpacing: "-0.03em" }],
        display: ["100px", { lineHeight: "1.1", letterSpacing: "-3px" }],
      },

      spacing: {
        // Scala reale del sito
        sm: "16px",
        md: "32px",
        lg: "48px",
        xl: "96px",
        xxl: "160px",
        gutter: "80px",
      },

      borderRadius: {
        // Il brand è squadrato: nessun raggio.
        DEFAULT: "0",
        none: "0",
      },

      transitionTimingFunction: {
        // La curva del brand: parte veloce, frena a lungo.
        acn: "cubic-bezier(0.85, 0, 0, 1)",
        "acn-in": "cubic-bezier(0.22, 0, 0.63, 1)",
        "acn-out": "cubic-bezier(0.38, 0, 0, 1)",
      },

      transitionDuration: {
        acn: "550ms",
        "acn-lg": "750ms",
      },

      maxWidth: {
        page: "1920px",
      },

      keyframes: {
        "acn-rise": {
          from: { opacity: "0", transform: "translateY(20%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "acn-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "acn-mark-turn": {
          from: { transform: "rotate(90deg)" },
          to: { transform: "rotate(0) scale(0.95) translateX(0.025em)" },
        },
        "acn-editorial-in": {
          from: { transform: "translateY(120%) rotate(6deg)" },
          to: { transform: "translateY(0) rotate(0)" },
        },
      },

      animation: {
        "acn-rise": "acn-rise 750ms cubic-bezier(0.38,0,0,1) backwards",
        "acn-fade": "acn-fade-in 550ms cubic-bezier(0.85,0,0,1) backwards",
        "acn-editorial": "acn-editorial-in 750ms cubic-bezier(0.85,0,0,1) backwards",
      },
    },
  },
};
