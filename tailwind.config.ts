import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
        slab: ["'Roboto Slab'", "Georgia", "serif"],
      },
      colors: {
        navy: {
          DEFAULT: "var(--navy, #102a43)",
          dark: "var(--navy-dark, #0a1c2e)",
          light: "var(--navy-light, #1f4a7a)",
        },
        // Kept the "gold" token name so we don't have to refactor every reference;
        // the value is the gutters site's copper accent.
        gold: {
          DEFAULT: "#b87333",
          light: "#cc874a",
        },
        offwhite: "#f7f9fc",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
