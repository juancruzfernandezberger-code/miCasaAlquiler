/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#C5A059', // Un color elegante para un sitio estético
        'brand-dark': '#1A1A1A',
      },
    },
  },
  plugins: [],
}