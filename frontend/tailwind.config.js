/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        surface: "#272727",
        primary: "#f1f1f1",
        secondary: "#aaaaaa",
        accent: "#ff0000",
      },
    },
  },
  plugins: [],
}
