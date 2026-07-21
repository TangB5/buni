import { z } from 'zod';

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
