import type {
  PatternColor,
  PatternLicense,
  PatternStatus,
  PatternSymbol,
  PatternSymbolism,
  PatternType,
  ArtisanQuote,
  PatternOrigin,
} from '@buni/patterns';

// ─────────────────────────────────────────────────────────────
// BACKEND DTO
// Représente EXACTEMENT la réponse backend
// ─────────────────────────────────────────────────────────────

export interface PatternDto {
  id: string;

  slug: string;

  name: string;

  nameLocal?: string;

  nameEn?: string;

  imgUrl: string;

  type: PatternType;

  cssClass?: string;

  status: PatternStatus;

  isFeatured: boolean;

  svgUrl?: string;

  svgPattern?: string;

  origin?: PatternOrigin;

  summary?: string;

  history?: string;

  symbolism?: PatternSymbolism;

  technique?: string;

  ceremonial?: string;

  era?: string;

  colors?: PatternColor[];

  symbols?: PatternSymbol[];

  sources?: string[];

  artisanQuote?: ArtisanQuote;

  license?: PatternLicense;

  views?: number;

  downloads?: number;

  createdAt?: string;

  updatedAt?: string;

  createdById?: string;
}