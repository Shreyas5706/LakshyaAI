/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C5CE7",
        secondary: "#A29BFE",
        navy: "#2F4156",
        teal: "#567C8D",
        beige: "#F5EFEB",
        skyblue: "#C8D9E6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  darkMode: "class", // Add this for dark mode support
  plugins: [],
};
