import { z } from 'zod';
export declare const UserRoleEnum: z.ZodEnum<{
    viewer: "viewer";
    contributor: "contributor";
    curator: "curator";
    admin: "admin";
}>;
export type UserRole = z.infer<typeof UserRoleEnum>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodEnum<{
        viewer: "viewer";
        contributor: "contributor";
        curator: "curator";
        admin: "admin";
    }>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type User = z.infer<typeof UserSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginDto = z.infer<typeof LoginSchema>;
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        viewer: "viewer";
        contributor: "contributor";
        curator: "curator";
        admin: "admin";
    }>>;
}, z.core.$strip>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isHydrated: boolean;
    error: string | null;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
//# sourceMappingURL=index.d.ts.map