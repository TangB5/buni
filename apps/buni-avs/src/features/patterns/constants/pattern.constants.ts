// ONLY UI / FORM CONFIG (no domain duplication)

import { REGIONS, PATTERN_TYPES, PatternOrigin, PatternSymbolism, PatternColor, PatternSymbol } from '@buni/patterns';

// ─────────────────────────────────────────────────────────────
// REGIONS & TYPES (re-exported from @buni/patterns)
// ─────────────────────────────────────────────────────────────

export { REGIONS, PATTERN_TYPES };

// ─────────────────────────────────────────────────────────────
// LICENSES (backend source of truth)
// ─────────────────────────────────────────────────────────────

export const LICENSES = [
  'cc0',
  'cc-by',
  'cc-by-sa',
] as const;

export type LicenseType = typeof LICENSES[number];

export const SYMBOL_USAGES = [
  'ceremonial',
  'daily',
  'royal',
  'spiritual',
  'universal',
] as const;



export const DEFAULT_COLORS: PatternColor[] = [
  {
    hex: '#C0573E',
    name: 'Primaire',
    meaning: 'Couleur principale',
  },
  {
    hex: '#F5EBE0',
    name: 'Secondaire',
    meaning: 'Couleur secondaire',
  },
];

// ─────────────────────────────────────────────────────────────
// DEFAULT SYMBOL
// ─────────────────────────────────────────────────────────────

export const DEFAULT_SYMBOL: PatternSymbol = {
  name: '',
  nameFr: '',
  meaning: '',
  usage: '',
  sacred: false,
  cssPreview: '',
};

// ─────────────────────────────────────────────────────────────
// FIELD LIMITS
// ─────────────────────────────────────────────────────────────

export const FIELD_LIMITS = {
  summary: 500,
  history: 2000,
  technique: 1000,
  ceremonial: 1000,
  symbolMeaning: 512,
  keywordsMax: 10,
  colorsMax: 5,
  symbolsMax: 20,
  sourcesMax: 10,
} as const;

// ─────────────────────────────────────────────────────────────
// FORM STEPS (UI ONLY)
// ─────────────────────────────────────────────────────────────

export const FORM_STEPS = [
  { label: 'Identité', desc: 'Nom & origine géographique' },
  { label: 'Description', desc: 'Contexte & symbolisme' },
  { label: 'Couleurs & Assets', desc: 'Palette & fichier SVG' },
  { label: 'Révision', desc: 'Vérification avant envoi' },
] as const;

export type StepIndex = 0 | 1 | 2 | 3;

export type RegionType = PatternOrigin['region'];


export type SymbolUsageType =
  PatternSymbolism['usage'];