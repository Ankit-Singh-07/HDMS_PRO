/** @type {import('tailwindcss').Config} */
module.exports = {
  // Is content array ko is tarah kar dijiye
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx}", // Agar components bahar hain
    "./pages/**/*.{js,jsx}",      // Agar pages bahar hain
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}