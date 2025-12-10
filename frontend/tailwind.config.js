/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#0F172A",
        background: "#F1F5F9",
        accent: "#C5A059",
      },
      fontFamily: {
        serif: ['"Marcellus SC"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
