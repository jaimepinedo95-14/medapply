/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales de MedApply
        azul: {
          marino: "#1e3a5f",
          claro: "#2d5a8e",
          hover: "#162d4a",
        },
        esmeralda: {
          DEFAULT: "#059669",
          claro: "#10b981",
          hover: "#047857",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
