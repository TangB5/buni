import { z } from 'zod';
import { PATTERN_TYPES, REGIONS } from './registry';

export const PatternSchema = z.object({
  // ─────────────────────────────────────────────────────
  // IDENTITÉ
  // ─────────────────────────────────────────────────────

  id: z.string().uuid(),

  slug: z.string(),

  name: z.string(),

  localName: z.string().default(''),

  type: z.enum(PATTERN_TYPES),

  cssClass: z.string().default('avs-pattern-wax-dakar'),

  // ─────────────────────────────────────────────────────
  // ORIGINE
  // ─────────────────────────────────────────────────────

  origin: z.object({
    country: z.string().default(''),

    people: z.string().default(''),

    region: z.enum(REGIONS),

    coords: z.tuple([z.number(), z.number()]).default([0, 0]),

    flag: z.string().default(''),
  }),

  // ─────────────────────────────────────────────────────
  // CONTENU CULTUREL
  // ─────────────────────────────────────────────────────

  summary: z.string().default(''),

  history: z.string().default(''),

  technique: z.string().default(''),

  ceremonial: z.string().default(''),

  era: z.string().default(''),

  symbolism: z.object({
    meaning: z.string().default(''),

    keywords: z.array(z.string()).default([]),

    usage: z.enum(['ceremonial', 'daily', 'royal', 'spiritual', 'universal']).default('universal'),
  }),

  // ─────────────────────────────────────────────────────
  // STYLES / VISUEL
  // ─────────────────────────────────────────────────────

  colors: z.array(
  z.object({
    hex: z.string(),
    name: z.string().default(''),
    meaning: z.string().default(''),
  })
),

  symbols: z.array(
    z.object({
      name: z.string(),
      nameFr: z.string(),
      meaning: z.string(),
      usage: z.string(),
      sacred: z.boolean(),
      cssPreview: z.string().optional(),
      imageUrl: z.string().optional(),
    })
  ).default([]),

  sources: z.array(z.string()).default([]),

  artisanQuote: z.string().optional(),

  svgPattern: z.string().optional(),

  // ─────────────────────────────────────────────────────
  // LICENCE
  // ─────────────────────────────────────────────────────

  license: z.enum(['cc0', 'cc-by', 'cc-by-sa', 'proprietary']).default('cc-by'),

  // ─────────────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────────────

  downloads: z.number().int().min(0).default(0),

  views: z.number().int().min(0).default(0),

  // ─────────────────────────────────────────────────────
  // META
  // ─────────────────────────────────────────────────────

  createdAt: z.string().datetime(),

  updatedAt: z.string().datetime(),

  published: z.boolean().default(true),

  featured: z.boolean().default(false),
});