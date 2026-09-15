/**
 * v2.0 — 2026-09-15
 * Mudança estrutural: paleta trocada por completo pelas cores reais da
 * marca Brasileira (extraídas do logo — verde, laranja e amarelo), no
 * lugar da paleta "editorial" genérica anterior.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#241C10",
        paper: "#FFF8EC",
        paperdim: "#FBEFD8",
        forest: "#2F8F49",
        forestlight: "#3FA85C",
        tangerine: "#F5A300",
        tangerinedark: "#D68F00",
        teal: "#3D7A8C",
        yellow: "#F2C94C",
        line: "#E9D9B8",
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        body: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
export default config;
