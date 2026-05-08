import type { Config } from 'tailwindcss';

export const buniPreset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'avs-primary':   '#C0573E',
        'avs-secondary': '#F5EBE0',
        'avs-accent':    '#1D1D1B',
        'avs-kente':     '#D4A017',
        'avs-ndop':      '#4A6741',
        'avs-indigo':    '#2A4A6B',
        'avs-earth':     '#8B4513',
        'avs-raffia':    '#C8A96E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        'avs':    '0.375rem',
        'avs-lg': '1.5rem',
        'avs-xl': '2rem',
      },
      boxShadow: {
        'avs':    '3px 3px 0px 0px #1D1D1B',
        'avs-md': '5px 5px 0px 0px #C0573E',
        'avs-lg': '8px 8px 0px 0px #1D1D1B',
      },
      animation: {
        'avs-spin':  'spin 1s linear infinite',
        'avs-pulse': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'avs-fade':  'fadeIn .3s ease-in-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
};
