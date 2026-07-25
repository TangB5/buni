import { z } from 'zod';
import type { UpdateProfileForm, BecomeCuratorForm } from '../types';

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères').max(64).optional(),
  bio: z.string().max(280).optional(),
  location: z.string().max(64).optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  github: z.string().max(39).optional(),
  twitter: z.string().max(15).optional(),
  specialty: z.string().max(64).optional(),
  avatar: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const BecomeCuratorSchema = z.object({
  bio: z.string().min(10, 'Minimum 10 caractères').max(280, 'Maximum 280 caractères'),
  specialty: z.string().min(2, 'Minimum 2 caractères').max(64, 'Maximum 64 caractères'),
  location: z.string().min(2, 'Minimum 2 caractères').max(64, 'Maximum 64 caractères'),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  github: z.string().max(39).optional(),
  twitter: z.string().max(15).optional(),
});

export type BecomeCuratorInput = z.infer<typeof BecomeCuratorSchema>;
