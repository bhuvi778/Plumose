/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8ec',
          100: '#ffedc9',
          200: '#ffd98e',
          300: '#ffbd53',
          400: '#ffa329',
          500: '#ff8a10',
          600: '#e96b06',
          700: '#c14e08',
          800: '#9a3d0e',
          900: '#7c330f',
        },
        maroon: {
          50: '#fdf3f3',
          100: '#fbe5e5',
          200: '#f9cfcf',
          300: '#f3adad',
          400: '#ea7e7e',
          500: '#dd5252',
          600: '#c63838',
          700: '#a52b2b',
          800: '#882626',
          900: '#4a0f0f',
        },
        gold: {
          400: '#e8c26a',
          500: '#d4a94a',
          600: '#b88c30',
        },
        cream: '#fffaf1',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Tiro Devanagari Hindi"', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(146, 64, 14, 0.15)',
        glow: '0 0 40px rgba(255, 163, 41, 0.35)',
      },
      backgroundImage: {
        'radial-saffron': 'radial-gradient(circle at top, #fff1d6 0%, #fffaf1 60%)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e96b06' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'flame-flicker': 'flicker 2s infinite alternate',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        flicker: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.75 } },
      },
    },
  },
  plugins: [],
};
