/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gujarati: {
          saffron: '#FF6F00',
          green: '#2E7D32',
          teal: '#00838F',
          gold: '#FFB300',
          dark: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Gujarati', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

