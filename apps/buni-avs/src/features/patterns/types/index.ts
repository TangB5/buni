// =============================================================================
// Feature Patterns — Types
//
// Architecture :
//   PatternSchema (Zod)  →  Pattern (type API inféré)
//   PatternType / RegionType / ...  dérivés du schema, pas redéfinis à la main
//   Step*Data  →  types de formulaire (côté client uniquement)
//   CreatePatternPayload  →  ce qu'on envoie à l'API
// =============================================================================

import { z } from 'zod';
import { AVS_PATTERN_TYPES, AVS_REGIONS } from 'apps/buni-avs/src/core/constants/avs';

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA ZOD — source de vérité de Pattern (API / backend)
// ─────────────────────────────────────────────────────────────────────────────

export const PatternSchema = z.object({
  id:          z.string().uuid(),
  slug:        z.string(),
  nameFr:      z.string(),
  nameEn:      z.string(),
  descFr:      z.string(),
  descEn:      z.string(),
  patternType: z.custom<typeof AVS_PATTERN_TYPES[number]>(),
  region:      z.custom<typeof AVS_REGIONS[number]>(),
  country:     z.string().length(2),

  colors: z.object({
    primary:    z.string(),
    secondary:  z.string(),
    accent:     z.string().optional(),
    additional: z.array(z.string()).default([]),
  }),

  symbolism: z.object({
    meaning:  z.string(),
    keywords: z.array(z.string()),
    usage:    z.enum(['ceremonial', 'daily', 'royal', 'spiritual', 'universal']),
  }),

  assets: z.object({
    svgUrl:     z.string().url().optional(),
    previewUrl: z.string().url().optional(),
    license:    z.enum(['cc0', 'cc-by', 'cc-by-sa', 'proprietary']).default('cc-by'),
  }),

  isPublished: z.boolean(),
  isFeatured:  z.boolean(),
  viewCount:   z.number().int().min(0),
  downloads:   z.number().int().min(0),
  createdAt:   z.string().datetime(),
  updatedAt:   z.string().datetime(),
});

// ─────────────────────────────────────────────────────────────────────────────
// TYPES DÉRIVÉS DU SCHEMA — jamais redéfinis à la main
// ─────────────────────────────────────────────────────────────────────────────

/** Motif tel que retourné par l'API. */
export type Pattern = z.infer<typeof PatternSchema>;

/** 'kente' | 'bogolan' | 'adinkra' | ... — piloté par AVS_PATTERN_TYPES */
export type PatternType    = Pattern['patternType'];

/** 'west-africa' | 'east-africa' | ... — piloté par AVS_REGIONS */
export type RegionType     = Pattern['region'];

/** 'cc0' | 'cc-by' | 'cc-by-sa' | 'proprietary' */
export type LicenseType    = Pattern['assets']['license'];

/** 'ceremonial' | 'daily' | 'royal' | 'spiritual' | 'universal' */
export type SymbolUsageType = Pattern['symbolism']['usage'];

/** Status côté formulaire (non exposé dans PatternSchema car géré par le backend) */
export type PatternStatus = 'draft' | 'review' | 'published' | 'rejected';

// ─────────────────────────────────────────────────────────────────────────────
// FILTRES & PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

export interface PatternFilters {
  search?:      string;
  patternType?: PatternType | 'all';
  region?:      RegionType  | 'all';
  page?:        number;
  perPage?:     number;
}

export interface PatternListResponse {
  data:       Pattern[];
  totalItems: number;
  totalPages: number;
  page:       number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-TYPES FORMULAIRE — spécifiques au client, pas dans le schema API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Couleur enrichie côté formulaire (hex + nom + signification).
 * Différent de Pattern['colors'] qui est une structure primary/secondary/accent.
 */
export interface PatternColor {
  hex:     string;
  name:    string;
  meaning: string;
}

/**
 * Symbole constitutif du motif, avec image File optionnelle (upload).
 * Le champ `image` est strippé avant envoi à l'API (voir mapper).
 */
export interface PatternSymbol {
  name:       string;
  nameFr:     string;
  cssPreview: string;
  meaning:    string;
  usage:      string;
  sacred:     boolean;
  image?:     File;
}

export interface ArtisanQuote {
  text:    string;
  author:  string;
  role:    string;
  country: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ÉTATS DU FORMULAIRE MULTI-STEP
// ─────────────────────────────────────────────────────────────────────────────

export interface Step1Data {
  nameFr:      string;
  nameLocal:   string;
  nameEn:      string;
  patternType: PatternType;
  region:      RegionType;
  country:     string;
  people?:     string;
  flag?:       string;
  coords?:     [number, number];
  kingdom?:    string;
  era?:        string;
  license:     LicenseType;
}

export interface Step2Data {
  descFr:         string;
  descEn:         string;
  summary:        string;
  history:        string;
  technique:      string;
  symbolMeaning:  string;
  ceremonial:     string;
  symbolKeywords: string[];
  symbolUsage:    SymbolUsageType;
}

export interface Step3Data {
  colors:       PatternColor[];
  svgPattern?:  string;
  artisanQuote?: ArtisanQuote;
  sources:      string[];
  symbols:      PatternSymbol[];
}

export interface PatternFormState {
  step1:       Partial<Step1Data>;
  step2:       Partial<Step2Data>;
  step3:       Partial<Step3Data>;
  svgFile:     File | null;
  currentStep: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD API — ce que le mapper produit et le service envoie
// ─────────────────────────────────────────────────────────────────────────────

export interface CreatePatternPayload {
  // Identité (Step 1)
  nameFr:      string;
  nameEn:      string;
  nameLocal:   string;
  patternType: PatternType;
  region:      RegionType;
  country:     string;
  license:     LicenseType;
  people?:     string;
  flag?:       string;
  coords?:     [number, number];
  kingdom?:    string;
  era?:        string;
  // Description (Step 2)
  descFr:         string;
  descEn:         string;
  summary:        string;
  history:        string;
  technique:      string;
  symbolMeaning:  string;
  symbolUsage:    SymbolUsageType;
  ceremonial:     string;
  symbolKeywords: string[];
  // Assets (Step 3)
  colors:       PatternColor[];
  sources:      string[];
  svgPattern?:  string;
  artisanQuote?: ArtisanQuote;
  /** Symbols sans le champ File — strippé par le mapper */
  symbols:      Omit<PatternSymbol, 'image'>[];
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRES
// ─────────────────────────────────────────────────────────────────────────────

export interface FieldErrors {
  [key: string]: string;
}