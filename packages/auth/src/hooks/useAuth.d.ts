export declare function useAuth(): {
    user: {
        id: string;
        email: string;
        role: "viewer" | "contributor" | "curator" | "admin";
        createdAt: string;
        name?: string | null | undefined;
        avatar?: string | null | undefined;
    } | null;
    isLoading: boolean;
    isHydrated: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isCurator: boolean;
    canContribute: boolean;
    logout: () => void;
};
export declare function useLogout(): () => Promise<void>;
//# sourceMappingURL=useAuth.d.ts.map