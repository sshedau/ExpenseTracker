/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // ← must cover all your component files
  ],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
}