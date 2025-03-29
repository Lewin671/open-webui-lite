/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#111111',
        sidebar: '#111111',
        main: '#1e1e1e',
        card: '#2a2a2a',
        input: '#2a2a2a',
        'text-light': '#e0e0e0',
        'text-medium': '#a0a0a0',
        'text-dark': '#111111',
        border: '#333333',
        'accent-green': '#28a745',
        'accent-orange': '#fdac3a',
        hover: '#383838',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'],
      },
    },
  },
  plugins: [],
}