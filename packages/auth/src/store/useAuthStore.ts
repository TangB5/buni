import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { User, AuthTokens } from '../types';

interface AuthStore {
  user:            User | null;
  tokens:          AuthTokens | null;
  isHydrated:      boolean;
  isAuthenticated: boolean;
  isAdmin:         boolean;
  isCurator:       boolean;
  canContribute:   boolean;
  setUser:    (user: User, tokens: AuthTokens) => void;
  clearAuth:  () => void;
  setHydrated:() => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user:            null,
        tokens:          null,
        isHydrated:      false,
        isAuthenticated: false,
        isAdmin:         false,
        isCurator:       false,
        canContribute:   false,
        setUser: (user, tokens) => set({
          user, tokens,
          isAuthenticated: true,
          isAdmin:         user.role === 'admin',
          isCurator:       user.role === 'curator' || user.role === 'admin',
          canContribute:   user.role !== 'viewer',
        }),
        clearAuth:   () => set({ user: null, tokens: null, isAuthenticated: false, isAdmin: false, isCurator: false, canContribute: false }),
        setHydrated: () => set({ isHydrated: true }),
      }),
      { name: 'buni-auth', partialize: s => ({ user: s.user, tokens: s.tokens }) }
    ),
    { name: 'buni-auth' }
  )
);
