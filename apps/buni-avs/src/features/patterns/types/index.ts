// =============================================================================
// AVS — Feature Patterns
// types · service · hooks · composants
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';
import type { AVS_PATTERN_TYPES, AVS_REGIONS } from '@/core/constants/avs';

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
  colors:      z.object({
    primary:    z.string(),
    secondary:  z.string(),
    accent:     z.string().optional(),
    additional: z.array(z.string()).default([]),
  }),
  symbolism:  z.object({
    meaning:  z.string(),
    keywords: z.array(z.string()),
    usage:    z.enum(['ceremonial','daily','royal','spiritual','universal']),
  }),
  assets: z.object({
    svgUrl:     z.string().url().optional(),
    previewUrl: z.string().url().optional(),
    license:    z.enum(['cc0','cc-by','cc-by-sa','proprietary']).default('cc-by'),
  }),
  isPublished: z.boolean(),
  isFeatured:  z.boolean(),
  viewCount:   z.number().int().min(0),
  downloads:   z.number().int().min(0),
  createdAt:   z.string().datetime(),
  updatedAt:   z.string().datetime(),
});

export type Pattern      = z.infer<typeof PatternSchema>;
export type PatternType  = Pattern['patternType'];
export type PatternUsage = Pattern['symbolism']['usage'];

export interface PatternFilters {
  search?:      string;
  patternType?: PatternType | 'all';
  region?:      Pattern['region'] | 'all';
  page?:        number;
  perPage?:     number;
}

export interface PatternListResponse {
  data:        Pattern[];
  totalItems:  number;
  totalPages:  number;
  page:        number;
}