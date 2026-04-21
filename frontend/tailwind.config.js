/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Semantic tokens driven by CSS variables on [data-vertical] ──
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          light: 'rgb(var(--brand-light) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          soft: 'rgb(var(--surface-soft) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          mute: 'rgb(var(--ink-mute) / <alpha-value>)',
        },
        // Legacy alias used by admin pages
        concrete: 'rgb(var(--surface-soft) / <alpha-value>)',

        // ── Explicit vertical palettes (used on parent hub / cross-vertical UI) ──
        devapi: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#7f1d1d',
          maroon: '#6d1f1f',
          cream: '#fffaf0',
        },
        herbal: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#1a2e05',
          moss: '#4a5d23',
          sand: '#f5f0e1',
        },
        courier: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          navy: '#0a2540',
          navyLight: '#1e3a5f',
          yellow: '#ffcb05',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 18px -4px rgba(0,0,0,0.08)',
        glow: '0 8px 28px -6px rgba(var(--brand) / 0.35)',
        card: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px -10px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, rgb(var(--brand)), rgb(var(--brand-dark)))',
      },
      animation: {
        'fade-in': 'fadeIn 400ms ease-out',
        'slide-up': 'slideUp 500ms cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
