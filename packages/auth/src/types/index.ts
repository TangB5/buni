// =============================================================================
// AVS — Feature Auth
// types · store · hooks · composants
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';

export const UserRoleEnum = z.enum(['viewer', 'contributor', 'curator', 'admin']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  role: UserRoleEnum,
  avatar: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères').max(64),
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis'),
  role: UserRoleEnum.default('viewer'),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
