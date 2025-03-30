/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
          'primary-light': '#ffffff', // 亮色模式下的主色
          'primary-dark': '#171717',
          'tip': '#9b9b9b'
      },
      fontFamily: {
        sans: ['Archivo', 'sans-serif']
      }
    }
  },
  plugins: [
  ]
}
