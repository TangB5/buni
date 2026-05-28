import type {
  PatternType,
  PatternColor,
  PatternOrigin,
  PatternSymbolism,
  PatternSymbol,
  ArtisanQuote,
  PatternLicense,
} from '@buni/patterns';

import type {
  PatternStatus,
} from '..';

// ─────────────────────────────────────────────────────────────
// DOMAIN MODEL
// Frontend/domain representation
// ─────────────────────────────────────────────────────────────

export interface Pattern {
  id: string;

  slug: string;

  // ── Names ──────────────────────────────────────────────────

  name: string;

  localName?: string;

  nameEn?: string;

  // ── Media ──────────────────────────────────────────────────

  imgUrl: string;

  svgUrl?: string;

  svgPattern?: string;

  // ── Classification ─────────────────────────────────────────

  type: PatternType;

  cssClass: string;

  // ── Origin ────────────────────────────────────────────────

  origin: PatternOrigin;

  // ── Content ───────────────────────────────────────────────

  summary: string;

  history?: string;

  technique?: string;

  ceremonial?: string;

  era: string;

  symbolism: PatternSymbolism;

  // ── Collections ───────────────────────────────────────────

  colors: PatternColor[];

  symbols: PatternSymbol[];

  sources: string[];

  // ── Quote ─────────────────────────────────────────────────

  artisanQuote?: ArtisanQuote;

  // ── Metadata ──────────────────────────────────────────────

  license: PatternLicense;

  featured: boolean;

  status: PatternStatus;

  views: number;

  downloads: number;

  createdAt?: string;

  updatedAt?: string;
}