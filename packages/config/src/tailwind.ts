import type { Config } from 'tailwindcss';

export const buniPreset: Partial<Config> = {
  // ── Mode sombre : basé sur la classe .dark ──
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        'avs-primary': 'rgb(var(--color-avs-primary) / <alpha-value>)',
        'avs-secondary': 'rgb(var(--color-avs-secondary) / <alpha-value>)',
        'avs-accent': 'rgb(var(--color-avs-accent) / <alpha-value>)',
        'avs-kente': 'rgb(var(--color-avs-kente) / <alpha-value>)',
        'avs-ndop': 'rgb(var(--color-avs-ndop) / <alpha-value>)',
        'avs-indigo': 'rgb(var(--color-avs-indigo) / <alpha-value>)',
        'avs-earth': 'rgb(var(--color-avs-earth) / <alpha-value>)',
        'avs-raffia': 'rgb(var(--color-avs-raffia) / <alpha-value>)',

        'light-bg': 'rgb(var(--color-light-bg) / <alpha-value>)',
        'light-surface': 'rgb(var(--color-light-surface) / <alpha-value>)',
        'light-text': 'rgb(var(--color-light-text) / <alpha-value>)',
        'light-border': 'rgb(var(--color-light-border) / <alpha-value>)',

        'dark-bg': 'rgb(var(--color-dark-bg) / <alpha-value>)',
        'dark-surface': 'rgb(var(--color-dark-surface) / <alpha-value>)',
        'dark-text': 'rgb(var(--color-dark-text) / <alpha-value>)',
        'dark-border': 'rgb(var(--color-dark-border) / <alpha-value>)',
      },

      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },

      borderRadius: {
        'avs': 'var(--radius-avs)',
        'avs-lg': 'var(--radius-avs-lg)',
        'avs-xl': 'var(--radius-avs-xl)',
      },

      boxShadow: {
        'avs': 'var(--shadow-avs)',
        'avs-md': 'var(--shadow-avs-md)',
        'avs-lg': 'var(--shadow-avs-lg)',
      },

      animation: {
        'avs-spin': 'spin 1s linear infinite',
        'avs-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'avs-fade': 'fadeIn 0.3s ease-in-out',
      },

      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'base': 'var(--transition-base)',
        'slow': 'var(--transition-slow)',
      },
    },
  },

  plugins: [],
};