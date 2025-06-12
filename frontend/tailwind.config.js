/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      // Add custom utilities if needed
      width: {
        '14': '3.5rem',
        '96': '24rem'
      },
      height: {
        '14': '3.5rem',
        '500': '500px'
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
    boxShadow: {
      'no-bottom': '0 -4px 6px -1px rgba(0, 0, 0, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.2), -4px 0 6px -1px rgba(0, 0, 0, 0.2)',
    }
  },
  variants: {},
  plugins: [],
}