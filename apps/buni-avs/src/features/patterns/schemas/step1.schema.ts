import { z } from 'zod';

export const Step1Schema = z.object({
  nameFr: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(128, 'Maximum 128 caractères'),

  nameLocal: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(128, 'Maximum 128 caractères'),

  nameEn: z
    .string()
    .min(2, 'Minimum 2 caractères')
    .max(128, 'Maximum 128 caractères'),

  patternType: z.enum([
    'kente', 'bogolan', 'adinkra', 'ndebele', 'ndop', 'wax', 'kuba', 'berber',
  ] as const),

  region: z.enum([
    'west-africa', 'east-africa', 'central-africa',
    'north-africa', 'south-africa', 'diaspora',
  ] as const),

  country: z
    .string()
    .length(2, 'Code pays ISO 2 lettres (ex: CM)')
    .toUpperCase(),

  people:  z.string().max(128).optional(),
  flag:    z.string().max(8).optional(),
  kingdom: z.string().max(128).optional(),
  era:     z.string().max(64).optional(),

  coords: z
    .tuple([z.number(), z.number()])
    .optional(),

  license: z.enum(['cc0', 'cc-by', 'cc-by-sa', 'proprietary'] as const).default('cc-by'),
});

export type Step1Schema = z.infer<typeof Step1Schema>;