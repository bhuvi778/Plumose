/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        concrete: '#f2f2f2',
        ink: '#0a0a0a',
        accent: '#dc2626',
      },
      fontFamily: {
        display: ['"Anton"', 'Impact', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', '"Courier New"', 'monospace'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sharp: '4px 4px 0px #000000',
        'sharp-sm': '2px 2px 0px #000000',
        'sharp-lg': '8px 8px 0px #000000',
        cart: '0 8px 24px rgba(0,0,0,0.10)',
        'cart-hover': '0 12px 32px rgba(0,0,0,0.15)',
      },
      animation: {
        grain: 'grain 8s steps(10) infinite',
      },
      keyframes: {
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-10%)' },
          '20%': { transform: 'translate(-15%,5%)' },
          '30%': { transform: 'translate(7%,-25%)' },
          '40%': { transform: 'translate(-5%,25%)' },
          '50%': { transform: 'translate(-15%,10%)' },
          '60%': { transform: 'translate(15%,0%)' },
          '70%': { transform: 'translate(0%,15%)' },
          '80%': { transform: 'translate(3%,35%)' },
          '90%': { transform: 'translate(-10%,10%)' },
        },
      },
    },
  },
  plugins: [],
};
