/** @type {import('tailwindcss').Config} */

// ── Signal & Ink · Editorial Intelligence ─────────────────────────────────
// Old-world advisory gravitas × new-world agentic AI.
//   canvas  = warm ivory dossier            ink      = graphite command rail
//   flux    = ultramarine brand signal       cyan    = live agentic highlight
// The legacy `ms.*` keys are remapped (not removed) so all 25 pages inherit
// the new palette without edits. RAG hues are refined to read as semantics,
// kept distinct from the ultramarine brand so health ≠ brand.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — flux (ultramarine) + cyan (agentic signal)
        flux: {
          DEFAULT: '#2540D9',
          dark: '#1A2EA8',
          light: '#DCE1FA',
          ink: '#101A4D',
        },
        cyan: {
          signal: '#10B7C4',
          deep: '#0B7E88',
          glow: '#5FE3EC',
        },
        ink: {
          DEFAULT: '#16171C',
          soft: '#3C3F49',
          faint: '#6C6E78',
        },
        canvas: '#F4F1EA',
        paper: '#FBFAF6',
        line: 'rgba(20,22,28,0.10)',

        // Legacy Microsoft tokens — remapped to the new system
        ms: {
          blue: '#2540D9',
          'blue-dark': '#1A2EA8',
          'blue-light': '#DCE1FA',
          green: '#1C7C54',
          amber: '#BE7415',
          red: '#B23A3A',
          purple: '#5B45C9',
        },
        sidebar: '#0E1016',
        'sidebar-hover': '#1A1E27',

        // Warm neutral scale — overrides Tailwind's cool gray so every
        // bg-gray-50 / text-gray-900 across the app warms to the ivory canvas.
        gray: {
          50: '#F7F5F0',
          100: '#EFEDE6',
          200: '#E1DED5',
          300: '#CEC9BD',
          400: '#A7A294',
          500: '#827C70',
          600: '#615C53',
          700: '#48443D',
          800: '#2D2A25',
          900: '#1A1814',
          950: '#100E0B',
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.24em',
      },
      boxShadow: {
        paper: '0 1px 2px rgba(20,22,28,0.04), 0 8px 24px -12px rgba(20,22,28,0.12)',
        lift: '0 2px 4px rgba(20,22,28,0.05), 0 18px 40px -20px rgba(20,22,28,0.22)',
        glow: '0 0 0 1px rgba(37,64,217,0.25), 0 8px 28px -10px rgba(37,64,217,0.35)',
      },
      backgroundImage: {
        'flux-sheen': 'linear-gradient(135deg, #2540D9 0%, #3A57E8 55%, #10B7C4 130%)',
        'ink-rail': 'linear-gradient(180deg, #14161D 0%, #0C0E13 100%)',
      },
      keyframes: {
        'signal-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.78)' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        'signal-pulse': 'signal-pulse 1.8s ease-in-out infinite',
        'rise-in': 'rise-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        sweep: 'sweep 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
