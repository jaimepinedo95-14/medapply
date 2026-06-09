/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azul: {
          marino: "#1e3a5f",
          claro:  "#2d5a8e",
          hover:  "#162d4a",
        },
        esmeralda: {
          DEFAULT: "#059669",
          claro:   "#10b981",
          hover:   "#047857",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "card":       "0 2px 8px -2px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 28px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
        "modal":      "0 24px 60px -8px rgba(0,0,0,0.35)",
        "nav":        "0 1px 3px rgba(0,0,0,0.07), 0 1px 0 rgba(0,0,0,0.05)",
        "btn":        "0 1px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "scale(0.97) translateY(4px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in":  "fadeIn 0.18s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
