'use client';
import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface UseAuthReturn {
  user: any | null;
  token: string | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCurator: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const { user, isHydrated, token, isAdmin, isCurator } = useAuthStore();
  return {
    user, token, isHydrated,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    isCurator: isCurator(),
  };
};

// useLogin / useRegister / useLogout — à implémenter avec le client API de chaque app
export { useAuthStore };

export const useLogout = () => {
  const logout = useAuthStore(s => s.logout);
  return useCallback(() => { logout(); }, [logout]);
};