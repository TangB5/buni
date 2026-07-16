import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
const initial = {
    user: null,
    token: null,
    isLoading: false,
    isHydrated: false,
    error: null,
};
export const useAuthStore = create()(devtools((set, get) => ({
    ...initial,
    setUser: (user) => {
        set({ user, error: null }, false, 'auth/setUser');
    },
    setToken: (token) => {
        set({ token }, false, 'auth/setToken');
    },
    updateUser: (partial) => set((s) => ({ user: s.user ? { ...s.user, ...partial } : null }), false, 'auth/updateUser'),
    logout: () => {
        set(initial, false, 'auth/logout');
    },
    setLoading: (isLoading) => set({ isLoading }, false, 'auth/setLoading'),
    setError: (error) => set({ error }, false, 'auth/setError'),
    setHydrated: () => set({ isHydrated: true }, false, 'auth/setHydrated'),
    isAdmin: () => get().user?.role?.toLowerCase() === 'admin',
    isCurator: () => ['admin', 'curator'].includes(get().user?.role?.toLowerCase() ?? ''),
    canContribute: () => ['admin', 'curator', 'contributor'].includes(get().user?.role?.toLowerCase() ?? ''),
}), { name: 'Buni Auth' }));
//# sourceMappingURL=useAuthStore.js.map