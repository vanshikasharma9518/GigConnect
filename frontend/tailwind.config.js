/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        'primary-dark': '#1D4ED8',
        secondary: '#F59E0B',
        'secondary-dark': '#D97706',
        accent: '#10B981',
        dark: '#111827',
        light: '#F3F4F6',
      },
    },
  },
  plugins: [],
} 