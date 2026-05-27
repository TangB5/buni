// =============================================================================
// AVS / BUNI — Pattern Registry (SOURCE OF TRUTH)
// =============================================================================

/**
 * Pattern types (canonique)
 */
export const PATTERN_TYPES = [
  'kente',
  'bogolan',
  'adinkra',
  'ndebele',
  'ndop',
  'wax',
  'kuba',
  'berber',
] as const;

export const PATTERN_STATUS=[
  'published',
  'draft',
  'review',
  'rejected',
] as const;

export type PatternStatus = typeof PATTERN_STATUS[number];

export type PatternType = typeof PATTERN_TYPES[number];

/**
 * Regions (canonique)
 */
export const REGIONS = [
  'west-africa',
  'east-africa',
  'central-africa',
  'north-africa',
  'south-africa',
  'diaspora',
] as const;

export type RegionType = typeof REGIONS[number];

/**
 * Licenses
 */
export const PATTERN_LICENSES = [
  'cc0',
  'cc-by',
  'cc-by-sa',
  'proprietary',
] as const;

export type PatternLicense = typeof PATTERN_LICENSES[number];


/**
 * CSS mapping (UI concern but stable registry)
 */
export const CSS_PATTERN_MAP = {
  kente: 'avs-pattern-kente-royale',
  bogolan: 'avs-pattern-bogolan-fanga',
  adinkra: 'avs-pattern-adinkra-sankofa',
  ndebele: 'avs-pattern-ndebele-amabhaxa',
  ndop: 'avs-pattern-ndop-sultan',
  wax: 'avs-pattern-wax-dakar',
  kuba: 'avs-pattern-kuba-kasai',
  berber: 'avs-pattern-berber-amazigh',
} as const satisfies Record<PatternType, string>;

/**
 * fallback safe class
 */
export const FALLBACK_PATTERN_CSS = 'avs-pattern-wax-dakar';

/**
 * helper runtime guard (important for monorepo stability)
 */
export function isPatternType(value: string): value is PatternType {
  return (PATTERN_TYPES as readonly string[]).includes(value);
}

export function isRegion(value: string): value is RegionType {
  return (REGIONS as readonly string[]).includes(value);
}

export function isPatternLicense(value: string): value is PatternLicense {
  return (PATTERN_LICENSES as readonly string[]).includes(value);
}