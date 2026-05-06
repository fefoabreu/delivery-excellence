/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ms: {
          blue: '#0078D4',
          'blue-dark': '#005A9E',
          'blue-light': '#C7E0F4',
          green: '#107C10',
          amber: '#D67B00',
          red: '#A4262C',
          purple: '#5C2D91',
        },
        sidebar: '#0F172A',
        'sidebar-hover': '#1E293B',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
