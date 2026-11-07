import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black navy used for dark hero / feature blocks
        ink: {
          DEFAULT: "#0d1320",
          900: "#090d17",
          800: "#0f1726",
          700: "#16213a",
        },
        navy: {
          DEFAULT: "#0e1a30",
          800: "#102444",
          700: "#15335c",
        },
        // Primary brand blue (buttons, links, accents)
        brand: {
          50: "#eef6fc",
          100: "#d7ebf8",
          200: "#b1d7f0",
          300: "#80bce6",
          400: "#4e9dd7",
          500: "#2a83c5",
          600: "#1a6aa6",
          700: "#165786",
          800: "#15486d",
          900: "#153e5c",
        },
        // Bright accent (logo spark / highlights)
        accent: "#2b94db",
        paper: "#f4f6fb",
        line: "#e3e7ef",
        muted: "#5c6675",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "80rem",
      },
      letterSpacing: {
        tightish: "-0.02em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,19,32,0.04), 0 8px 24px -12px rgba(13,19,32,0.12)",
        lift: "0 20px 50px -24px rgba(13,19,32,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease both",
      },
    },
  },
  plugins: [],
} satisfies Config;
