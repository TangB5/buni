// =============================================================================
// AVS — SVG Pattern Registry (Backend-driven)
// src/core/utils/svg-patterns.ts
//
// NOUVELLE ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
// Les SVG sont maintenant gérés côté backend + Supabase Storage.
//
// Ce fichier ne contient PLUS les assets statiques.
// Il fournit :
// - les types TypeScript
// - les helpers utilitaires
// - les transformations frontend
//
// Le backend retourne les PatternDoc.
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
  | 'BARKCLOTH';

export interface PatternColor {
  hex: string;
  name: string;
  meaning: string;
}

export interface PatternSymbol {
  name: string;
  nameFr: string;
  cssPreview: string;
  meaning: string;
  usage: string;
  sacred: boolean;
  imageUrl?: string;
}

export interface PatternOrigin {
  people: string;
  region: string;
  country: string;
  flag: string;

  // [latitude, longitude]
  coords: [number, number];
}

export interface ArtisanQuote {
  text: string;
  author: string;
  role: string;
  country: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN BACKEND DOCUMENT
// ──────────────────────────────────────────────────────────────────────────────

export interface PatternDoc {
  id: string;

  // URL-friendly slug
  slug: string;

  // Display names
  nameFr: string;
  nameLocal: string;

  // Pattern category
  type: PatternType;

  // CSS classes
  svgPattern?: string;
  cssClass: string;

  // Storage path returned by backend
  // ex: patterns/ndop-bamoum.svg
  storagePath?: string;

  // Optional public URL returned directly by backend
  svgUrl?: string;

  // Cultural origin
  origin: PatternOrigin;

  // Historical metadata
  era: string;

  // Licensing
  license: PatternLicense;

  // Main palette
  colors: PatternColor[];

  // Documentation
  summary: string;
  history: string;
  technique: string;
  symbolism: string;
  ceremonial: string;

  // Symbol system
  symbols: PatternSymbol[];

 
  // Optional quote
  artisanQuote?: ArtisanQuote;

  // Academic / cultural references
  sources: string[];

  // Analytics
  downloads: number;
  views: number;

  // Dates
  createdAt?: string;
  updatedAt?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// FRONTEND VIEW MODEL
// ──────────────────────────────────────────────────────────────────────────────

export interface SvgPatternMeta {
  id: string;
  slug: string;

  name: string;
  localName: string;

  type: PatternType;

  svgUrl: string;

  origin: string;

  region: string;

  country: string;

  colors: string[];

  description: string;

  license: PatternLicense;

  downloads: number;
  views: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// TRANSFORMERS
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Transforme un PatternDoc backend
 * en structure légère frontend
 */
export function toSvgPatternMeta(
  pattern: PatternDoc
): SvgPatternMeta {
  return {
    id: pattern.id,

    slug: pattern.slug,

    name: pattern.nameFr,

    localName: pattern.nameLocal,

    type: pattern.type,

    svgUrl: pattern.svgUrl ?? '',

    origin: `${pattern.origin.region}, ${pattern.origin.country}`,

    region: pattern.origin.region,

    country: pattern.origin.country,

    colors: pattern.colors.map(c => c.hex),

    description: pattern.summary,

    license: pattern.license,

    downloads: pattern.downloads,

    views: pattern.views,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// UTILITAIRES
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Retourne uniquement les patterns d'un type donné
 */
export function getPatternsByType(
  patterns: PatternDoc[],
  type: PatternType
): PatternDoc[] {
  return patterns.filter(p => p.type === type);
}

/**
 * Retourne uniquement les patterns d'un pays
 */
export function getPatternsByCountry(
  patterns: PatternDoc[],
  country: string
): PatternDoc[] {
  return patterns.filter(
    p =>
      p.origin.country.toLowerCase() ===
      country.toLowerCase()
  );
}

/**
 * Retourne uniquement les patterns sacrés
 */
export function getSacredPatterns(
  patterns: PatternDoc[]
): PatternDoc[] {
  return patterns.filter(pattern =>
    pattern.symbols.some(symbol => symbol.sacred)
  );
}

/**
 * Recherche par texte
 */
export function searchPatterns(
  patterns: PatternDoc[],
  query: string
): PatternDoc[] {
  const q = query.toLowerCase();

  return patterns.filter(pattern =>
    pattern.nameFr.toLowerCase().includes(q) ||
    pattern.nameLocal.toLowerCase().includes(q) ||
    pattern.summary.toLowerCase().includes(q) ||
    pattern.origin.people.toLowerCase().includes(q)
  );
}

/**
 * Retourne la palette HEX uniquement
 */
export function getPatternPalette(
  pattern: PatternDoc
): string[] {
  return pattern.colors.map(c => c.hex);
}

/**
 * Génère un JSON exportable de palette
 */
export function generatePaletteJson(
  pattern: PatternDoc
): string {
  return JSON.stringify(
    {
      id: pattern.id,

      name: pattern.nameFr,

      localName: pattern.nameLocal,

      type: pattern.type,

      origin: pattern.origin,

      colors: pattern.colors,

      license: pattern.license,

      source:
        'AVS — African Visual Standard · avs-standard.com',
    },
    null,
    2
  );
}

/**
 * Retourne les symboles sacrés uniquement
 */
export function getSacredSymbols(
  pattern: PatternDoc
): PatternSymbol[] {
  return pattern.symbols.filter(
    symbol => symbol.sacred
  );
}

/**
 * Retourne les couleurs principales format CSS
 */
export function getCssVariables(
  pattern: PatternDoc
): Record<string, string> {
  return Object.fromEntries(
    pattern.colors.map((color, index) => [
      `--pattern-color-${index + 1}`,
      color.hex,
    ])
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TYPES API
// ──────────────────────────────────────────────────────────────────────────────

export interface PatternsApiResponse {
  data: PatternDoc[];

  total: number;

  page?: number;

  limit?: number;
}

export interface PatternApiResponse {
  data: PatternDoc;
}

// ──────────────────────────────────────────────────────────────────────────────
// TYPE GUARDS
// ──────────────────────────────────────────────────────────────────────────────

export function isPatternDoc(
  value: unknown
): value is PatternDoc {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const pattern = value as PatternDoc;

  return (
    typeof pattern.id === 'string' &&
    typeof pattern.slug === 'string' &&
    typeof pattern.nameFr === 'string'
  );
}