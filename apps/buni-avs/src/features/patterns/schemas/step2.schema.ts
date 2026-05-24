import { z } from 'zod';

export const Step2Schema = z.object({
  descFr: z
    .string()
    .min(20, 'Minimum 20 caractères')
    .max(2000, 'Maximum 2000 caractères'),

  descEn: z
    .string()
    .min(20, 'Minimum 20 caractères')
    .max(2000, 'Maximum 2000 caractères'),

  summary: z
    .string()
    .min(10, 'Minimum 10 caractères')
    .max(500, 'Maximum 500 caractères'),

  history: z
    .string()
    .min(10, 'Contexte historique requis')
    .max(2000, 'Maximum 2000 caractères'),

  technique: z
    .string()
    .min(10, 'Technique de fabrication requise')
    .max(1000, 'Maximum 1000 caractères'),

  symbolMeaning: z
    .string()
    .min(10, 'Signification symbolique requise')
    .max(512, 'Maximum 512 caractères'),

  ceremonial: z
    .string()
    .min(10, 'Usage cérémoniel requis')
    .max(1000, 'Maximum 1000 caractères'),

  symbolKeywords: z
    .array(z.string().min(1))
    .min(1, 'Au moins 1 mot-clé requis')
    .max(10, 'Maximum 10 mots-clés'),

  symbolUsage: z.enum([
    'ceremonial', 'daily', 'royal', 'spiritual', 'universal',
  ]),
});

export type Step2Schema = z.infer<typeof Step2Schema>;