import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '../types';


interface AuthState {
  user:        User | null;
  token:       string | null;
  isHydrated:  boolean;
  setUser:     (user: User, token: string) => void;
  logout:      () => void;
  setHydrated: () => void;
  isAdmin:     () => boolean;
  isCurator:   () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null, token: null, isHydrated: false,
        setUser:    (user, token)  => set({ user, token }, false, 'auth/setUser'),
        logout:     ()             => set({ user:null, token:null }, false, 'auth/logout'),
        setHydrated:()             => set({ isHydrated:true }, false, 'auth/hydrated'),
        isAdmin:    ()             => get().user?.role === 'admin',
        isCurator:  ()             => ['admin','curator'].includes(get().user?.role ?? ''),
      }),
      {
        name: 'buni-auth',
        partialize: s => ({ user:s.user, token:s.token }),
        onRehydrateStorage: () => s => s?.setHydrated(),
      }
    ),
    { name: 'Buni Auth' }
  )
);
