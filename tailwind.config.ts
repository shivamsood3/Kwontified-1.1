import type { Config } from "tailwindcss";

// Round 3 (§2) — warm navy, gold and cream. Old blue is retired; the `brand`
// and `ink` keys are remapped onto the new palette so existing utility classes
// stay on-palette while pages migrate to the explicit navy/gold/cream tokens.
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: "0",
      sm: "6px",
      DEFAULT: "8px", // buttons, inputs
      md: "10px",
      lg: "12px",
      xl: "16px",
      "2xl": "16px", // images, cards, banners
      "3xl": "24px",
      full: "9999px",
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        navy: {
          DEFAULT: "#172442",
          950: "#0E1A30",
          900: "#172442",
          800: "#22335A",
          700: "#34466F",
        },
        gold: {
          DEFAULT: "#DBBF84",
          300: "#E7D2A3",
          500: "#DBBF84",
          600: "#C9A55E",
          700: "#7A5C24",
        },
        cream: {
          DEFAULT: "#FAF8F3",
          50: "#FAF8F3",
          100: "#F4EDE0",
        },
        sand: {
          DEFAULT: "#E9DFCB",
          200: "#E9DFCB",
          300: "#D8C8A8",
        },
        // Text / neutrals. `ink` is text (near-black warm), not a dark section bg.
        ink: {
          DEFAULT: "#1C1B19",
          900: "#1C1B19",
          800: "#3A3733",
          700: "#4A4641",
          500: "#5F5A50",
          muted: "#5F5A50",
          faint: "#9A958B",
          300: "#D8C8A8",
          200: "#E9DFCB",
          100: "#F4EDE0",
        },
        // Legacy aliases → new palette (keep migrating classes on-palette).
        brand: {
          50: "#F4EDE0", // cream-100
          100: "#F4EDE0",
          200: "#E9DFCB",
          300: "#E7D2A3", // gold-300
          400: "#172442",
          500: "#172442",
          600: "#172442", // navy-900 (links/accents on light)
          700: "#7A5C24", // gold-700 (hover/accent text)
          800: "#0E1A30",
          900: "#0E1A30",
        },
        accent: "#DBBF84", // gold-500
        paper: "#FAF8F3", // cream-50 default page bg
        line: "#D8C8A8", // sand-300 hairlines
        muted: "#5F5A50", // ink-muted text
      },
      borderColor: {
        DEFAULT: "#D8C8A8", // sand-300
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-sans)"], // Manrope throughout
      },
      fontSize: {
        display: ["clamp(44px, 5.6vw, 80px)", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
        h1: ["clamp(34px, 3.4vw, 50px)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h2: ["clamp(28px, 2.6vw, 38px)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        stat: ["clamp(48px, 5vw, 72px)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        h3: ["21px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        lead: ["21px", { lineHeight: "1.5" }],
        body: ["18px", { lineHeight: "1.6" }],
        small: ["16px", { lineHeight: "1.5" }],
        caption: ["14px", { lineHeight: "1.4" }],
        micro: ["12px", { lineHeight: "1.35", letterSpacing: "0.02em" }],
      },
      maxWidth: {
        container: "1312px",
        reading: "720px",
        prose: "620px",
      },
      letterSpacing: {
        tightish: "-0.02em",
        eyebrow: "0.14em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,27,25,.04), 0 8px 24px rgba(28,27,25,.06)",
        pop: "0 12px 32px rgba(28,27,25,.16)",
        lift: "0 12px 32px rgba(28,27,25,.14)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.22,1,.36,1)",
        expo: "cubic-bezier(.16,1,.3,1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(.16,1,.3,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
