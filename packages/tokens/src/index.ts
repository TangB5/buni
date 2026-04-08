export const AVS_COLORS = {
  primary:   '#C0573E',
  secondary: '#F5EBE0',
  accent:    '#1D1D1B',
  kente:     '#D4A017',
  ndop:      '#4A6741',
  indigo:    '#2A4A6B',
  earth:     '#8B4513',
  raffia:    '#C8A96E',
} as const;

export type AvsColor = keyof typeof AVS_COLORS;

export const AVS_RADIUS = { sm: '0.375rem', lg: '1.5rem', xl: '2rem', full: '9999px' } as const;
export const AVS_SHADOW = {
  sm: '2px 2px 0px 0px #1D1D1B',
  md: '3px 3px 0px 0px #1D1D1B',
  lg: '5px 5px 0px 0px #C0573E',
  xl: '8px 8px 0px 0px #1D1D1B',
} as const;
