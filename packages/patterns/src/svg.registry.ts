import { PatternType } from './registry';

// ─────────────────────────────────────────────────────────────
// SVG REGISTRY
// ─────────────────────────────────────────────────────────────

export const SVG_REGISTRY = {
  kente: {
    key: 'kente',
    name: 'Kente Royale',
    file: '/patterns/kente-royale.svg',
    preview: 'avs-pattern-kente-royale',
    type: 'kente',
    origin: 'Ghana',
    description: 'Motif traditionnel kente du Ghana',
    colors: ['#FFD700', '#FF0000', '#008000'],
    license: 'cc-by',
  },

  bogolan: {
    key: 'bogolan',
    name: 'Bogolan Fanga',
    file: '/patterns/bogolan-fanga.svg',
    preview: 'avs-pattern-bogolan-fanga',
    type: 'bogolan',
    origin: 'Mali',
    description: 'Motif bogolan du Mali',
    colors: ['#8B6914', '#FFFFFF'],
    license: 'cc-by',
  },

  adinkra: {
    key: 'adinkra',
    name: 'Adinkra Sankofa',
    file: '/patterns/adinkra-sankofa.svg',
    preview: 'avs-pattern-adinkra-sankofa',
    type: 'adinkra',
    origin: 'Ghana',
    description: 'Symboles adinkra du Ghana',
    colors: ['#000000', '#FFFFFF'],
    license: 'cc-by',
  },

  ndebele: {
    key: 'ndebele',
    name: 'Ndebele Amabhaxa',
    file: '/patterns/ndebele-amabhaxa.svg',
    preview: 'avs-pattern-ndebele-amabhaxa',
    type: 'ndebele',
    origin: 'Afrique du Sud',
    description: 'Motif ndebele d\'Afrique du Sud',
    colors: ['#FF0000', '#FFFF00', '#0000FF'],
    license: 'cc-by',
  },

  ndop: {
    key: 'ndop',
    name: 'Ndop Sultan',
    file: '/patterns/ndop-sultan.svg',
    preview: 'avs-pattern-ndop-sultan',
    type: 'ndop',
    origin: 'Cameroun',
    description: 'Tissu ndop du Cameroun',
    colors: ['#000000', '#FFFFFF'],
    license: 'cc-by',
  },

  wax: {
    key: 'wax',
    name: 'Wax Dakar',
    file: '/patterns/wax-dakar.svg',
    preview: 'avs-pattern-wax-dakar',
    type: 'wax',
    origin: 'Sénégal',
    description: 'Tissu wax du Sénégal',
    colors: ['#FF6B35', '#004E89', '#F7FFF7'],
    license: 'cc-by',
  },

  kuba: {
    key: 'kuba',
    name: 'Kuba Kasai',
    file: '/patterns/kuba-kasai.svg',
    preview: 'avs-pattern-kuba-kasai',
    type: 'kuba',
    origin: 'République Démocratique du Congo',
    description: 'Tissu kuba du Congo',
    colors: ['#8B7355', '#D2B48C'],
    license: 'cc-by',
  },

  berber: {
    key: 'berber',
    name: 'Berber Amazigh',
    file: '/patterns/berber-amazigh.svg',
    preview: 'avs-pattern-berber-amazigh',
    type: 'berber',
    origin: 'Afrique du Nord',
    description: 'Motif amazigh d\'Afrique du Nord',
    colors: ['#C41E3A', '#FCD116', '#007FFF'],
    license: 'cc-by',
  },
} as const;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type SvgPatternKey =
  keyof typeof SVG_REGISTRY;

export type SvgPatternMeta =
  typeof SVG_REGISTRY[SvgPatternKey];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function getSvgMeta(
  key: SvgPatternKey
): SvgPatternMeta {
  return SVG_REGISTRY[key];
}

export function getSvgUrl(
  key: SvgPatternKey
): string {
  return SVG_REGISTRY[key].file;
}

export function isSvgPatternKey(
  value: string
): value is SvgPatternKey {
  return value in SVG_REGISTRY;
}

export function getPatternPreviewClass(
  type: PatternType
): string {
  return SVG_REGISTRY[type].preview;
}