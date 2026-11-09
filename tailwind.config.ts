import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // §3.4 — square everything except circular avatars / pause-play buttons.
    borderRadius: {
      none: "0",
      sm: "0",
      DEFAULT: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "9999px",
    },
    extend: {
      colors: {
        // Warm charcoal neutrals (§3.1). `ink` is the dark-section background.
        ink: {
          DEFAULT: "#262524",
          900: "#262524",
          800: "#31302E",
          700: "#4A4B4D",
          500: "#626366",
          300: "#C9CACC",
          200: "#E1E2E3",
          100: "#F2F3F3",
        },
        // Kept as an alias to charcoal so any legacy `navy` class stays on-palette.
        navy: { DEFAULT: "#262524", 800: "#31302E", 700: "#4A4B4D" },
        // Brand blue (§3.1). 600 is PRIMARY.
        brand: {
          50: "#F3F7FA",
          100: "#E6EFF4",
          200: "#C7DCE6",
          300: "#99C0D1",
          400: "#00618D",
          500: "#00618D",
          600: "#00618D",
          700: "#004869",
          800: "#003A55",
          900: "#003A55",
        },
        accent: "#99C0D1", // blue-300, accent on dark
        paper: "#F2F3F3", // ink-100 grey section bg
        line: "#E1E2E3", // ink-200 hairlines
        muted: "#626366", // ink-500 muted text
      },
      borderColor: {
        DEFAULT: "#C9CACC", // --border (ink-300); keeps unstyled borders on-palette
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      fontSize: {
        display: ["clamp(48px, 6vw, 86px)", { lineHeight: "1.0", letterSpacing: "-0.035em" }],
        h1: ["clamp(36px, 3.6vw, 50px)", { lineHeight: "1.0", letterSpacing: "-0.035em" }],
        h2: ["clamp(30px, 2.6vw, 36px)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        stat: ["clamp(48px, 5vw, 72px)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        h3: ["22px", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        lead: ["22px", { lineHeight: "1.45" }],
        body: ["18px", { lineHeight: "1.55" }],
        small: ["16px", { lineHeight: "1.45" }],
        caption: ["15px", { lineHeight: "1.4" }],
        micro: ["13px", { lineHeight: "1.35", letterSpacing: "0.01em" }],
      },
      maxWidth: {
        container: "1312px",
        reading: "680px",
        prose: "620px",
      },
      letterSpacing: {
        tightish: "-0.025em",
      },
      boxShadow: {
        // Menus & popovers only (§3.4).
        pop: "0 12px 32px rgba(38,37,36,.16)",
        card: "none",
        lift: "0 12px 32px rgba(38,37,36,.16)",
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
        "fade-up": "fade-up 0.64s cubic-bezier(.16,1,.3,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
