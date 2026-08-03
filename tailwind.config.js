/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030d1f',
          900: '#0a1428',
          800: '#0d1e3d',
          700: '#112655',
          600: '#163070',
        },
        accent: {
          green:  '#22c55e',
          yellow: '#f59e0b',
          red:    '#ef4444',
          blue:   '#3b82f6',
          purple: '#a855f7',
          cyan:   '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
