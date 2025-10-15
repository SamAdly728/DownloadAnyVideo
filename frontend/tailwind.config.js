/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        turquoise: '#40E0D0',
        pink: '#FF69B4',
        'light-green': '#90EE90',
        'light-blue': '#ADD8E6',
        'dark-blue': '#001F54',
      }
    },
  },
  plugins: [],
}
