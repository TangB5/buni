import { z } from 'zod';

const ColorSchema = z.object({
  hex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur HEX invalide (ex: #C0573E)'),
  name:    z.string().min(1, 'Nom de la couleur requis'),
  meaning: z.string().min(1, 'Signification requise'),
});

const SymbolSchema = z.object({
  name:       z.string().min(1, 'Nom du symbole requis'),
  nameFr:     z.string().min(1, 'Nom français requis'),
  cssPreview: z.string().min(1, 'Aperçu CSS requis'),
  meaning:    z.string().min(1, 'Signification requise'),
  usage:      z.string().min(1, 'Usage requis'),
  sacred:     z.boolean(),
  // File is validated at runtime, not by Zod (browser File API)
  image:      z.instanceof(File).optional(),
});

const ArtisanQuoteSchema = z.object({
  text:    z.string().min(10, 'Minimum 10 caractères').max(500),
  author:  z.string().min(2, 'Nom de l\'artisan requis').max(128),
  role:    z.string().min(2, 'Rôle requis').max(128),
  country: z.string().min(2, 'Pays requis').max(64),
});

export const Step3Schema = z.object({
  colors: z
    .array(ColorSchema)
    .min(2, 'Au moins 2 couleurs requises')
    .max(5, 'Maximum 5 couleurs'),

  svgPattern:   z.string().optional(),
  artisanQuote: ArtisanQuoteSchema.optional(),

  sources: z
    .array(z.string().min(1))
    .min(1, 'Au moins une source requise')
    .max(10, 'Maximum 10 sources'),

  symbols: z
    .array(SymbolSchema)
    .min(1, 'Au moins un symbole requis')
    .max(20, 'Maximum 20 symboles'),
});

export type Step3Schema = z.infer<typeof Step3Schema>;