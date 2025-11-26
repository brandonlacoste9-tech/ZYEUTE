/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#F9DB6D',
          500: '#F5C842',
          600: '#D4AF37',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F9DB6D 0%, #F5C842 50%, #D4AF37 100%)',
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(245, 200, 66, 0.4)',
        'gold-lg': '0 10px 40px 0 rgba(245, 200, 66, 0.6)',
      },
      dropShadow: {
        'gold': '0 0 8px rgba(245, 200, 66, 0.8)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
