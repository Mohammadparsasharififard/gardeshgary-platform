/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode (we toggle `.dark` on <html> via useTheme)
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ─── NEW DESIGN SYSTEM: "Midnight Desert" ───
        // Warm, earthy, sophisticated — a complete departure from the old
        // navy/emerald/amber palette. Inspired by Persian desert landscapes
        // at dusk: terracotta sand, deep night, jade oases.
        sand: {
          50: '#faf6f0',
          100: '#f5ebe0',
          200: '#e9d5c4',
          300: '#d9b79c',
          400: '#c89372',
          500: '#b67456',
          600: '#9c5a3e',
          700: '#7d4630',
          800: '#5f3624',
          900: '#3f2418',
          950: '#1f120c',
        },
        night: {
          50: '#f0f0f5',
          100: '#e0e0eb',
          200: '#c4c4d4',
          300: '#a3a3bd',
          400: '#7e7ea0',
          500: '#5f5f85',
          600: '#4a4a6e',
          700: '#3a3a58',
          800: '#2a2a45',
          900: '#1a1a30',
          950: '#0a0a18',
        },
        jade: {
          50: '#effdf4',
          100: '#d9f9e4',
          200: '#b4f0cd',
          300: '#7fe3ac',
          400: '#43cf85',
          500: '#1db567',
          600: '#0f9152',
          700: '#0c7344',
          800: '#0c5b39',
          900: '#0a4a31',
          950: '#042819',
        },
        // Backward-compat: alias the old `navy/emerald/amber` names to the new
        // palette so existing components keep working without mass renames.
        navy: {
          50: '#f0f0f5', 100: '#e0e0eb', 200: '#c4c4d4', 300: '#a3a3bd',
          400: '#7e7ea0', 500: '#5f5f85', 600: '#4a4a6e', 700: '#3a3a58',
          800: '#2a2a45', 900: '#1a1a30', 950: '#0a0a18',
        },
        emerald: {
          50: '#effdf4', 100: '#d9f9e4', 200: '#b4f0cd', 300: '#7fe3ac',
          400: '#43cf85', 500: '#1db567', 600: '#0f9152', 700: '#0c7344',
          800: '#0c5b39', 900: '#0a4a31', 950: '#042819',
        },
        amber: {
          50: '#faf6f0', 100: '#f5ebe0', 200: '#e9d5c4', 300: '#d9b79c',
          400: '#c89372', 500: '#b67456', 600: '#9c5a3e', 700: '#7d4630',
          800: '#5f3624', 900: '#3f2418', 950: '#1f120c',
        },
      },
      fontFamily: {
        // Primary: Estedad (modern Persian, geometric, sophisticated)
        // Fallback: Vazirmatn then system
        sans: ['Estedad', 'Vazirmatn', 'IRANSans', 'system-ui', 'sans-serif'],
        // Display: same family but we use it for headings via CSS
        display: ['Estedad', 'Vazirmatn', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(15, 10, 24, 0.08), 0 10px 20px -2px rgba(15, 10, 24, 0.04)',
        'card': '0 4px 25px -2px rgba(26, 26, 48, 0.10)',
        'glow': '0 0 30px -5px rgba(29, 181, 103, 0.45)',
        'glow-lg': '0 0 60px -10px rgba(29, 181, 103, 0.55)',
        'glow-amber': '0 0 50px -10px rgba(182, 116, 86, 0.45)',
        'glow-sand': '0 0 45px -8px rgba(198, 147, 114, 0.50)',
        'inner-glow': 'inset 0 0 30px rgba(29, 181, 103, 0.07)',
        'premium': '0 8px 40px -8px rgba(26, 26, 48, 0.14), 0 2px 10px -2px rgba(26, 26, 48, 0.07)',
        'float': '0 20px 50px -10px rgba(26, 26, 48, 0.18)',
        // New: warm terracotta glow
        'glow-warm': '0 0 40px -8px rgba(182, 116, 86, 0.55)',
      },
      backgroundImage: {
        // New: warm mesh gradient used in hero & sections
        'mesh-desert': "radial-gradient(at 20% 30%, rgba(182, 116, 86, 0.15) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(29, 181, 103, 0.12) 0px, transparent 50%)",
        'mesh-night': "radial-gradient(at 20% 30%, rgba(74, 74, 110, 0.25) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(29, 181, 103, 0.18) 0px, transparent 50%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
        'aurora': 'aurora 12s ease infinite',
        'ping-slow': 'pingSlow 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bob': 'bob 3.5s ease-in-out infinite',
        'text-shimmer': 'textShimmer 4s linear infinite',
        'skeleton': 'skeleton 1.6s ease-in-out infinite',
        'drift': 'drift 18s ease-in-out infinite',
        'ink-wash': 'inkWash 2s ease-out forwards',
        // Advanced: professional polish
        'stagger-up': 'staggerUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'aurora-flow': 'auroraFlow 20s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'gentle-float': 'gentleFloat 3s ease-in-out infinite',
        'count-slide': 'countSlide 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'gradient-cycle': 'gradientCycle 8s ease infinite',
        'glow-rotate': 'glowRotate 4s linear infinite',
        'conic-spin': 'conicSpin 0.8s linear infinite',
        'ripple-expand': 'rippleExpand 0.6s ease-out',
        'section-enter': 'sectionEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'focus-pulse': 'focusPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        pulseRing: { '0%': { transform: 'scale(0.8)', opacity: '0.8' }, '100%': { transform: 'scale(2)', opacity: '0' } },
        gradientShift: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.5' },
          '33%': { transform: 'translate(30px, -20px) rotate(120deg)', opacity: '0.7' },
          '66%': { transform: 'translate(-20px, 30px) rotate(240deg)', opacity: '0.4' },
        },
        pingSlow: { '0%': { transform: 'scale(1)', opacity: '0.7' }, '75%, 100%': { transform: 'scale(1.8)', opacity: '0' } },
        bob: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        textShimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        skeleton: { '0%, 100%': { opacity: '0.55' }, '50%': { opacity: '0.9' } },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -25px) scale(1.1)' },
          '66%': { transform: 'translate(-30px, 20px) scale(0.95)' },
        },
        inkWash: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        // Advanced
        staggerUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)', filter: 'blur(0)' },
        },
        auroraFlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.5' },
          '25%': { transform: 'translate(30px, -20px) scale(1.1)', opacity: '0.7' },
          '50%': { transform: 'translate(-20px, 30px) scale(0.9)', opacity: '0.4' },
          '75%': { transform: 'translate(20px, 20px) scale(1.05)', opacity: '0.6' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        countSlide: {
          '0%': { opacity: '0', transform: 'translate3d(20px, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        gradientCycle: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glowRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        conicSpin: {
          'to': { transform: 'rotate(360deg)' },
        },
        rippleExpand: {
          'from': { transform: 'scale(0)', opacity: '0.6' },
          'to': { transform: 'scale(4)', opacity: '0' },
        },
        sectionEnter: {
          'from': { opacity: '0', transform: 'translate3d(0, 40px, 0) scale(0.98)', filter: 'blur(8px)' },
          'to': { opacity: '1', transform: 'translate3d(0, 0, 0) scale(1)', filter: 'blur(0)' },
        },
        focusPulse: {
          '0%, 100%': { boxShadow: '0 0 0 2px rgba(250, 246, 240, 1), 0 0 0 4px rgba(29, 181, 103, 0.6)' },
          '50%': { boxShadow: '0 0 0 2px rgba(250, 246, 240, 1), 0 0 0 5px rgba(29, 181, 103, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
