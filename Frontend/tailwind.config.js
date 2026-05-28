export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // App shell colors
        bg: {
          primary: '#0a0a0a',
          secondary: '#111111',
          card: '#1a1a1a',
        },
        // Auth page specific — Deep Oceanic palette
        ocean: {
          page:   '#0B1528',
          card:   '#13223C',
          border: 'rgba(148,163,184,0.15)',  // slate-800/50 equivalent
        },
        // Primary cyan accent (auth + app-wide CTA)
        cyan: {
          DEFAULT: '#00D2FF',
          hover:   '#00B8E0',
          muted:   'rgba(0,210,255,0.1)',
        },
        // App-wide semantic tokens
        accent: {
          DEFAULT: '#6366f1',
          hover:   '#4f46e5',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger:  '#ef4444',
        text: {
          primary:   '#f5f5f5',
          secondary: '#888888',
        },
        border: {
          DEFAULT: '#2a2a2a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.4)',
        ocean: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(148,163,184,0.08)',
      },
      backgroundImage: {
        'ocean-radial':
          'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,210,255,0.04) 0%, transparent 70%)',
        'ocean-grid':
          'linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'ocean-grid': '40px 40px',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out forwards',
        'spin-slow':  'spin-slow 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}
