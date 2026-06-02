// =============================================================================
// AVS — Feature Auth
// types · store · hooks · composants
// =============================================================================
// ─────────────────────────────────────────────────────────────────────────────
// src/features/auth/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';
export const UserRoleEnum = z.enum(['viewer', 'contributor', 'curator', 'admin']);
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable().optional(),
    role: UserRoleEnum,
    avatar: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
});
export const LoginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Minimum 8 caractères'),
});
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
//# sourceMappingURL=index.js.map