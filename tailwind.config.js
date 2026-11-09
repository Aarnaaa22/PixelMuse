/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#040405',
          DEFAULT: '#08080A',
          surface: '#0E0E12',
          subtle: '#14141A',
          border: '#1F1F28',
          'border-hover': '#2E2E3C',
          muted: '#636375',
          text: '#9898A6',
          heading: '#EDEDF2',
        },
        electric: {
          violet: '#9D4EDD',
          'violet-light': '#B367FF',
          'violet-glow': '#7B2CBF',
        },
        acid: {
          lime: '#CCFF00',
          'lime-dim': '#A3CC00',
          'lime-glow': 'rgba(204, 255, 0, 0.15)',
        },
        signal: {
          coral: '#FF473A',
          'coral-hover': '#FF6154',
          'coral-glow': 'rgba(255, 71, 58, 0.15)',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      letterSpacing: {
        ultra: '0.2em',
        widest: '0.15em',
      },
      borderRadius: {
        xs: '2px',
        sm: '3px',
        DEFAULT: '4px',
        md: '6px',
      },
      boxShadow: {
        'crisp-border': '0 0 0 1px #1F1F28',
        'active-violet': '0 0 0 1px #9D4EDD, 0 0 16px -2px rgba(157, 78, 221, 0.35)',
        'active-lime': '0 0 0 1px #CCFF00, 0 0 16px -2px rgba(204, 255, 0, 0.35)',
        'active-coral': '0 0 0 1px #FF473A, 0 0 16px -2px rgba(255, 71, 58, 0.35)',
      },
    },
  },
  plugins: [],
}

