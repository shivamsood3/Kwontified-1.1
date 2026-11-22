import type { Config } from "tailwindcss";

// v1.2 — deep navy (#102A4C), cool blue-grey bands, gold, warm cream.
// `brand`/`ink`/`paper`/`line`/`muted` aliases stay mapped so existing utility
// classes keep working while pages migrate to the explicit navy/sky/gold tokens.
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
      sm: "2px",
      DEFAULT: "2px", // v1.2 images/inputs are near-square
      md: "4px",
      lg: "6px",
      xl: "8px",
      "2xl": "4px",
      "3xl": "8px",
      full: "9999px", // pill buttons
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        navy: {
          DEFAULT: "#102A4C",
          950: "#0A1C36",
          900: "#102A4C",
          800: "#1B3A63",
          700: "#2D4E7D",
        },
        sky: {
          50: "#E9EEF4",
          100: "#E1E9F1",
          200: "#C9D4DF",
        },
        gold: {
          DEFAULT: "#DCBF85",
          300: "#E7D2A3",
          500: "#DCBF85",
          600: "#C9A55E",
          700: "#775812",
        },
        cream: {
          DEFAULT: "#F8F6F1",
          50: "#FDFCFA",
          100: "#F8F6F1",
          200: "#EFEAE2",
        },
        sand: {
          DEFAULT: "#DDD3C2",
          200: "#EFEAE2",
          300: "#DDD3C2",
        },
        ink: {
          DEFAULT: "#262524",
          900: "#262524",
          800: "#3A3733",
          700: "#4A4641",
          500: "#626366",
          muted: "#626366",
          faint: "#9A958B",
          300: "#C9D4DF",
          200: "#E1E9F1",
          100: "#F8F6F1",
        },
        // Legacy aliases → v1.2 palette.
        brand: {
          50: "#E9EEF4",
          100: "#E1E9F1",
          200: "#C9D4DF",
          300: "#E7D2A3",
          400: "#102A4C",
          500: "#102A4C",
          600: "#102A4C",
          700: "#775812",
          800: "#0A1C36",
          900: "#0A1C36",
        },
        accent: "#DCBF85",
        paper: "#F8F6F1",
        line: "#DDD3C2",
        muted: "#626366",
        slash: "#00618D",
      },
      borderColor: {
        DEFAULT: "#DDD3C2",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-sans)"],
      },
      fontSize: {
        display: ["clamp(52px, 6vw, 92px)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        h1: ["clamp(38px, 4.4vw, 66px)", { lineHeight: "1.04", letterSpacing: "-0.02em" }],
        h2: ["clamp(30px, 3vw, 40px)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        stat: ["clamp(56px, 6vw, 92px)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        h3: ["22px", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        lead: ["clamp(20px, 2vw, 24px)", { lineHeight: "1.45" }],
        body: ["17px", { lineHeight: "1.6" }],
        small: ["15px", { lineHeight: "1.5" }],
        caption: ["14px", { lineHeight: "1.4" }],
        micro: ["13px", { lineHeight: "1.35", letterSpacing: "0.01em" }],
      },
      maxWidth: {
        container: "1312px",
        reading: "720px",
        prose: "640px",
      },
      letterSpacing: {
        tightish: "-0.015em",
        eyebrow: "0.1em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,42,76,.04), 0 10px 30px rgba(16,42,76,.06)",
        pop: "0 14px 40px rgba(16,42,76,.14)",
        lift: "0 16px 40px rgba(16,42,76,.12)",
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
