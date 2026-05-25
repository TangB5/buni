// =============================================================================
// Feature Patterns — Frontend Types
//
// Source of truth:
//   @buni/patterns
//
// Ce fichier contient UNIQUEMENT :
// - types frontend
// - états formulaire
// - payloads UI
// - pagination/filtering
//
// Le domaine métier vient du package partagé.
// =============================================================================

import type {
  Pattern,
  PatternType,
  PatternLicense,
  PatternColor,
  PatternSymbol,
  PatternSymbolism,
  PatternOrigin,
  ArtisanQuote,
} from '@buni/patterns';

// ─────────────────────────────────────────────────────────────
// TYPES DÉRIVÉS
// ─────────────────────────────────────────────────────────────

export type RegionType = PatternOrigin['region'];

export type LicenseType = PatternLicense;

export type SymbolUsageType =
  PatternSymbolism['usage'];

export type PatternStatus =
  | 'draft'
  | 'review'
  | 'published'
  | 'rejected';

// ─────────────────────────────────────────────────────────────
// FILTERS & PAGINATION
// ─────────────────────────────────────────────────────────────

export interface PatternFilters {
  search?: string;

  type?: PatternType | 'all';

  region?: RegionType | 'all';

  page?: number;

  perPage?: number;
}

export interface PatternListResponse {
  data: Pattern[];

  totalItems: number;

  totalPages: number;

  page: number;
}

// ─────────────────────────────────────────────────────────────
// FORM TYPES
// ─────────────────────────────────────────────────────────────

export interface UploadablePatternSymbol
  extends PatternSymbol {
  image?: File;
}

// ─────────────────────────────────────────────────────────────
// MULTI-STEP FORM
// ─────────────────────────────────────────────────────────────

export interface Step1Data {
  nameFr: string;

  nameLocal: string;

  nameEn: string;

  type: PatternType;

  region: RegionType;

  country: string;

  people?: string;

  flag?: string;

  coords?: [number, number];

  kingdom?: string;

  era?: string;

  license: LicenseType;
}

export interface Step2Data {
  descFr: string;

  descEn: string;

  summary: string;

  history: string;

  technique: string;

  symbolMeaning: string;

  ceremonial: string;

  symbolKeywords: string[];

  symbolUsage: SymbolUsageType;
}

export interface Step3Data {
  colors: PatternColor[];

  svgPattern?: string;

  artisanQuote?: ArtisanQuote;

  sources: string[];

  symbols: UploadablePatternSymbol[];
}

export interface PatternFormState {
  step1: Partial<Step1Data>;

  step2: Partial<Step2Data>;

  step3: Partial<Step3Data>;

  svgFile: File | null;

  currentStep: number;
}

// ─────────────────────────────────────────────────────────────
// API PAYLOAD
// ─────────────────────────────────────────────────────────────

export interface CreatePatternPayload {
  // Step 1
  nameFr: string;

  nameEn: string;

  nameLocal: string;

  type: PatternType;

  region: RegionType;

  country: string;

  license: LicenseType;

  people?: string;

  flag?: string;

  coords?: [number, number];

  kingdom?: string;

  era?: string;

  // Step 2
  descFr: string;

  descEn: string;

  summary: string;

  history: string;

  technique: string;

  symbolMeaning: string;

  symbolUsage: SymbolUsageType;

  ceremonial: string;

  symbolKeywords: string[];

  // Step 3
  colors: PatternColor[];

  sources: string[];

  svgPattern?: string;

  artisanQuote?: ArtisanQuote;

  symbols: Omit<
    UploadablePatternSymbol,
    'image'
  >[];
}

// ─────────────────────────────────────────────────────────────
// FORM ERRORS
// ─────────────────────────────────────────────────────────────

export interface FieldErrors {
  [key: string]: string;
}

// ─────────────────────────────────────────────────────────────
// RE-EXPORT DOMAIN TYPES
// ─────────────────────────────────────────────────────────────

export type {
  Pattern,
  PatternColor,
  PatternSymbol,
  PatternSymbolism,
  PatternOrigin,
  ArtisanQuote,
};