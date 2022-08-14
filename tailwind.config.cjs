/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-semi-75': 'rgba(0, 0, 0, 0.75)'
      }
    }
  },
  plugins: [],
}
