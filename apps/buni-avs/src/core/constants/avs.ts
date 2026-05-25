import { PATTERN_TYPES } from "../../features/patterns/constants/pattern.constants";

export const AVS_COLORS = {
  primary:   '#C0573E',
  secondary: '#F5EBE0',
  accent:    '#1D1D1B',
  kente:     '#D4A017',
  ndop:      '#4A6741',
  raffia:    '#C8A96E',
  earth:     '#8B4513',
} as const;

export const AVS_REGIONS = ['west-africa','east-africa','central-africa','north-africa','south-africa','diaspora'] as const;
export type  AvsRegion = typeof AVS_REGIONS[number];

export type  AvsPatternType = typeof PATTERN_TYPES[number];

export const CAMEROON_PATTERNS = ['ndop','bamileke','beti','fulani','bassa','ewondo'] as const;
export type  CameroonPattern = typeof CAMEROON_PATTERNS[number];

export const PAGINATION = { DEFAULT_PAGE: 1, DEFAULT_PER_PAGE: 20, MAX_PER_PAGE: 100 } as const;
export const API_ROUTES = {
  patterns:  '/patterns',
  auth:      { login: '/auth/login', logout: '/auth/logout', me: '/auth/me' },
  users:     '/users',
} as const;
