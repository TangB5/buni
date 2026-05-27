import type { PatternType, PatternLicense, PatternStatus } from './registry';

// ─────────────────────────────────────────────────────────────
// CORE DOMAIN TYPES
// ─────────────────────────────────────────────────────────────

export interface PatternColor {
  hex: string;
  name: string;
  meaning: string;
}

export interface PatternSymbolism {
  meaning: string;
  keywords?: string[];
  usage: 'ceremonial' | 'daily' | 'royal' | 'spiritual' | 'universal';
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

// ─────────────────────────────────────────────────────────────
// MAIN ENTITY
// ─────────────────────────────────────────────────────────────

export interface Pattern {
  id: string;
  slug: string;

  name: string;
  localName?: string;
  nameEn?: string;

  imgUrl: string;
  type: PatternType;

  svgUrl?: string;
  svgPattern?: string;

  cssClass: string;

  origin: PatternOrigin;

  summary: string;
  history?: string;
  symbolism: PatternSymbolism;
  technique?: string;
  ceremonial?: string;
  era: string;

  colors: PatternColor[];
  symbols: PatternSymbol[];

  sources: string[];

  artisanQuote?: ArtisanQuote;

  license: PatternLicense;

  
  featured: boolean;
  status: PatternStatus;

  views: number;
  downloads: number;

  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// UI MODEL
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}