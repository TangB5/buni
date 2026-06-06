import type { AuthState, User } from '../types';
interface AuthActions {
    setUser: (user: User) => void;
    setToken: (token: string | null) => void;
    updateUser: (partial: Partial<User>) => void;
    logout: () => void;
    setLoading: (v: boolean) => void;
    setError: (e: string | null) => void;
    setHydrated: () => void;
    isAdmin: () => boolean;
    isCurator: () => boolean;
    canContribute: () => boolean;
}
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AuthState & AuthActions>, "setState" | "devtools"> & {
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
}>;
export {};
//# sourceMappingURL=useAuthStore.d.ts.map