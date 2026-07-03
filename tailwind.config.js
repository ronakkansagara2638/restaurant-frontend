/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0F2018",
          900: "#15291F",
          800: "#1B3A2F",
          700: "#234A3B",
          600: "#2E5C49",
        },
        brass: {
          400: "#D9B23C",
          500: "#C9A227",
          600: "#A8841C",
        },
        paper: {
          DEFAULT: "#F1F4EF",
          dim: "#E7EBE2",
        },
        ink: "#16241D",
        rust: "#C2562C",
        teal: "#2E7D6B",
        danger: "#9C2B2B",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
