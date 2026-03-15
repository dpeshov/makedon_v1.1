import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./ui/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "rgb(210 0 0 / <alpha-value>)",
          yellow: "rgb(255 209 0 / <alpha-value>)"
        }
      }
    }
  },
  plugins: []
};

export default config;
