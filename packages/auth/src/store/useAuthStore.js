import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
const initial = {
    user: null,
    token: null,
    isLoading: false,
    isHydrated: false,
    error: null,
};
export const useAuthStore = create()(devtools(persist((set, get) => ({
    ...initial,
    setUser: (user) => {
        set({ user, error: null }, false, 'auth/setUser');
    },
    updateUser: (partial) => set((s) => ({ user: s.user ? { ...s.user, ...partial } : null }), false, 'auth/updateUser'),
    logout: () => {
        set(initial, false, 'auth/logout');
    },
    setLoading: (isLoading) => set({ isLoading }, false, 'auth/setLoading'),
    setError: (error) => set({ error }, false, 'auth/setError'),
    setHydrated: () => set({ isHydrated: true }, false, 'auth/setHydrated'),
    isAdmin: () => get().user?.role === 'admin',
    isCurator: () => ['admin', 'curator'].includes(get().user?.role ?? ''),
    canContribute: () => ['admin', 'curator', 'contributor'].includes(get().user?.role ?? ''),
}), {
    name: 'buni-auth',
    partialize: (s) => ({
        user: s.user,
        token: null,
        isHydrated: s.isHydrated,
    }),
}), { name: 'Buni Auth' }));
//# sourceMappingURL=useAuthStore.js.map