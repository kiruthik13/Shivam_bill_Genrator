/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: '#E85D04',
        orange2: '#FF8C42',
        dark: '#1A1A2E',
        mid: '#4A4A6A',
        grey: '#8890A0',
        border: '#E8ECF2',
        bg: '#F2F4F8',
        card: '#FFFFFF',
        accent: '#FFF4EE',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}
