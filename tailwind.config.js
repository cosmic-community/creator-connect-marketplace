/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#64748b',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#0f172a',
        border: '#e2e8f0',
        card: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}