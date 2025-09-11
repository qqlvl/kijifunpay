import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7c3aed",
          light: "#a78bfa",
          dark: "#5b21b6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sf)", "sans-serif"],   // основной — SF Pro
        offbit: ["var(--font-offbit)", "sans-serif"], // акцентный — OffBit
      },
    },
  },
  plugins: [],
};
export default config;
