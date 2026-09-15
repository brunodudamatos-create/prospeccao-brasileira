import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#16211C",
        paper: "#F5F6F1",
        paperdim: "#EBEEE5",
        forest: "#1F3B2E",
        forestlight: "#2C5240",
        tangerine: "#FF7A29",
        tangerinedark: "#E8630F",
        teal: "#2B6777",
        line: "#D8DED2",
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
