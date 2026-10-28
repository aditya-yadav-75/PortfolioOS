/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#08090B',
          secondary: '#101216',
          tertiary: '#161920',
        },
        surface: {
          glass: 'rgba(255, 255, 255, 0.045)',
          'glass-hover': 'rgba(255, 255, 255, 0.075)',
          'glass-elevated': 'rgba(255, 255, 255, 0.09)',
          'glass-active': 'rgba(255, 255, 255, 0.12)',
        },
        border: {
          glass: 'rgba(255, 255, 255, 0.11)',
          'glass-subtle': 'rgba(255, 255, 255, 0.06)',
          'glass-highlight': 'rgba(255, 255, 255, 0.22)',
        },
        content: {
          primary: '#F3F4F6',
          secondary: '#A0A5B0',
          muted: '#737987',
        },
        ice: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          glow: 'rgba(56, 189, 248, 0.18)',
        },
      },
      boxShadow: {
        'glass-sm': '0 2px 8px -1px rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(255, 255, 255, 0.05) inset',
        'glass-md': '0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(255, 255, 255, 0.08) inset',
        'glass-lg': '0 16px 40px -8px rgba(0, 0, 0, 0.65), 0 1px 3px 0 rgba(255, 255, 255, 0.12) inset',
        'glass-panel': '0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 1px 2px 0 rgba(255, 255, 255, 0.14) inset',
        'ice-glow': '0 0 25px -4px rgba(56, 189, 248, 0.35)',
        'paper': '0 20px 45px -10px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        serif: ['Charter', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      backdropBlur: {
        glass: '20px',
        'glass-deep': '28px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
