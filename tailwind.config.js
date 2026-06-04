/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          raised: '#1a1d27',
          border: '#2a2d3e',
        },
        entity: {
          error:    '#ef4444',
          stack:    '#f97316',
          file:     '#3b82f6',
          endpoint: '#8b5cf6',
          service:  '#10b981',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
