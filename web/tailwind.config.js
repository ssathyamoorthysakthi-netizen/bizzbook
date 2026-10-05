/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff6ed', 100: '#ffead4', 200: '#fed1aa', 300: '#fdb174',
          400: '#fb843d', 500: '#f96318', 600: '#ea4c0c', 700: '#c23609',
          800: '#9a2b0f', 900: '#7c2510', 950: '#430f05'
        },
        ink: {
          50:  '#f6f7f9', 100: '#eceef2', 200: '#d5dae3', 300: '#b0b9c9',
          400: '#8593aa', 500: '#65748f', 600: '#505d76', 700: '#424c5f',
          800: '#39404f', 900: '#181c26', 950: '#0b0e15'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.18)',
        lift: '0 2px 4px rgba(16,24,40,.05), 0 18px 40px -16px rgba(16,24,40,.28)',
        glow: '0 10px 40px -12px rgba(249,99,24,.45)'
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } }
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
