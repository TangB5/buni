// =============================================================================
// AVS — Pattern Registry
// src/core/domain/pattern.ts
//
// CLEAN ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
// Ce fichier représente le DOMAINE métier.
//
// Il contient :
// - les entités métier
// - les types
// - les view models
// - les utilitaires
//
// Il NE contient PAS :
// - Prisma
// - Supabase
// - props wrappers
// - metadata ambiguës
// - logique backend
// =============================================================================

// ──────────────────────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────────────────────

export type PatternLicense =
  | 'cc0'
  | 'cc-by'
  | 'cc-by-sa';

export type PatternType =
  | 'NDOP'
  | 'KENTE'
  | 'BOGOLAN'
  | 'ADINKRA'
  | 'TOGHU'
  | 'MUDCLOTH'
  | 'BARKCLOTH'
  | 'NDEBELE'
  | 'KUBA'
  | 'WAX';

// ──────────────────────────────────────────────────────────────────────────────
// VALUE OBJECTS
// ──────────────────────────────────────────────────────────────────────────────

export interface PatternColor {
  hex: string;

  name: string;

  meaning: string;
}

export interface PatternSymbol {
  name: string;

  nameFr: string;

  meaning: string;

  usage: string;

  sacred: boolean;

  cssPreview?: string;

  imageUrl?: string;
}

export interface PatternOrigin {
  people: string;

  region: string;

  country: string;

  flag?: string;

  coords?: [number, number];
}

export interface ArtisanQuote {
  text: string;

  author: string;

  role: string;

  country: string;
}
 
// ──────────────────────────────────────────────────────────────────────────────
// MAIN DOMAIN ENTITY
// ──────────────────────────────────────────────────────────────────────────────

export interface Pattern {
  id: string;

  slug: string;

  // Names
  name: string;

  localName?: string;

  nameEn?: string;

  // Classification
  type: PatternType;

  // SVG
  svgUrl?: string;

  svgPattern?: string;

  cssClass: string;

  // Cultural origin
  origin: PatternOrigin;

  // Documentation
  summary: string;

  history?: string;

  symbolism: string;

  technique?: string;

  ceremonial?: string;

  era: string;

  // Visual identity
  colors: PatternColor[];

  symbols: PatternSymbol[];

  // References
  sources: string[];

  artisanQuote?: ArtisanQuote;

  // Legal
  license: PatternLicense;

  // Publication
  published: boolean;

  featured: boolean;

  // Analytics
  views: number;

  downloads: number;

  // Dates
  createdAt?: string;

  updatedAt?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// LIGHTWEIGHT UI MODEL
// ──────────────────────────────────────────────────────────────────────────────

export interface PatternCard {
  id: string;

  slug: string;

  name: string;

  localName?: string;

  type: PatternType;

  svgUrl?: string;

  region: string;

  country: string;

  colors: string[];

  summary: string;

  views: number;

  featured: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// API RESPONSES
// ──────────────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  success: boolean;

  data: T[];

  pagination: {
    page: number;

    perPage: number;

    total: number;

    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;

  data: T;
}

// ──────────────────────────────────────────────────────────────────────────────
// TRANSFORMERS
// ──────────────────────────────────────────────────────────────────────────────

export function toPatternCard(
  pattern: Pattern
): PatternCard {
  return {
    id: pattern.id,

    slug: pattern.slug,

    name: pattern.name,

    localName: pattern.localName,

    type: pattern.type,

    svgUrl: pattern.svgUrl,

    region: pattern.origin.region,

    country: pattern.origin.country,

    colors: pattern.colors.map(
      color => color.hex
    ),

    summary: pattern.summary,

    views: pattern.views,

    featured: pattern.featured,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// UTILITAIRES
// ──────────────────────────────────────────────────────────────────────────────

export function getPatternsByType(
  patterns: Pattern[],
  type: PatternType
): Pattern[] {
  return patterns.filter(
    pattern => pattern.type === type
  );
}

export function getPatternsByCountry(
  patterns: Pattern[],
  country: string
): Pattern[] {
  return patterns.filter(
    pattern =>
      pattern.origin.country.toLowerCase() ===
      country.toLowerCase()
  );
}

export function getSacredPatterns(
  patterns: Pattern[]
): Pattern[] {
  return patterns.filter(pattern =>
    pattern.symbols.some(
      symbol => symbol.sacred
    )
  );
}

export function searchPatterns(
  patterns: Pattern[],
  query: string
): Pattern[] {
  const q = query.toLowerCase();

  return patterns.filter(pattern =>
    pattern.name
      .toLowerCase()
      .includes(q) ||

    pattern.localName
      ?.toLowerCase()
      .includes(q) ||

    pattern.summary
      .toLowerCase()
      .includes(q) ||

    pattern.origin.people
      .toLowerCase()
      .includes(q)
  );
}

export function getPatternPalette(
  pattern: Pattern
): string[] {
  return pattern.colors.map(
    color => color.hex
  );
}

export function generatePaletteJson(
  pattern: Pattern
): string {
  return JSON.stringify(
    {
      id: pattern.id,

      name: pattern.name,

      localName:
        pattern.localName,

      type: pattern.type,

      origin: pattern.origin,

      colors: pattern.colors,

      license:
        pattern.license,

      source:
        'AVS — African Visual Standard · avs-standard.com',
    },
    null,
    2
  );
}

export function getSacredSymbols(
  pattern: Pattern
): PatternSymbol[] {
  return pattern.symbols.filter(
    symbol => symbol.sacred
  );
}

export function getCssVariables(
  pattern: Pattern
): Record<string, string> {
  return Object.fromEntries(
    pattern.colors.map(
      (color, index) => [
        `--pattern-color-${index + 1}`,
        color.hex,
      ]
    )
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TYPE GUARDS
// ──────────────────────────────────────────────────────────────────────────────

export function isPattern(
  value: unknown
): value is Pattern {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return false;
  }

  const pattern =
    value as Pattern;

  return (
    typeof pattern.id === 'string' &&
    typeof pattern.slug === 'string' &&
    typeof pattern.name === 'string'
  );
}