import type { AuthState, User } from '../types';
interface AuthActions {
    setUser: (user: User) => void;
    updateUser: (partial: Partial<User>) => void;
    logout: () => void;
    setLoading: (v: boolean) => void;
    setError: (e: string | null) => void;
    setHydrated: () => void;
    isAdmin: () => boolean;
    isCurator: () => boolean;
    canContribute: () => boolean;
}
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<AuthState & AuthActions>, "setState" | "devtools"> & {
    setState(partial: (AuthState & AuthActions) | Partial<AuthState & AuthActions> | ((state: AuthState & AuthActions) => (AuthState & AuthActions) | Partial<AuthState & AuthActions>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: (AuthState & AuthActions) | ((state: AuthState & AuthActions) => AuthState & AuthActions), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "setState" | "persist"> & {
    setState(partial: (AuthState & AuthActions) | Partial<AuthState & AuthActions> | ((state: AuthState & AuthActions) => (AuthState & AuthActions) | Partial<AuthState & AuthActions>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): unknown;
    setState(state: (AuthState & AuthActions) | ((state: AuthState & AuthActions) => AuthState & AuthActions), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AuthState & AuthActions, {
            user: {
                id: string;
                email: string;
                role: "viewer" | "contributor" | "curator" | "admin";
                createdAt: string;
                name?: string | null | undefined;
                avatar?: string | null | undefined;
            } | null;
            token: null;
            isHydrated: boolean;
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthState & AuthActions) => void) => () => void;
        onFinishHydration: (fn: (state: AuthState & AuthActions) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AuthState & AuthActions, {
            user: {
                id: string;
                email: string;
                role: "viewer" | "contributor" | "curator" | "admin";
                createdAt: string;
                name?: string | null | undefined;
                avatar?: string | null | undefined;
            } | null;
            token: null;
            isHydrated: boolean;
        }, unknown>>;
    };
}>;
export {};
//# sourceMappingURL=useAuthStore.d.ts.map