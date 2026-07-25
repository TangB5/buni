'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginDto, RegisterDto } from '../types';

// Main auth hook - state from store
export function useAuth() {
  const { user, isLoading, isHydrated, error, logout, isAdmin, isSuperAdmin, isCurator, canContribute } =
    useAuthStore();

  const isAuthenticated = !!user;

  return {
    user: isAuthenticated ? user : null,
    isLoading,
    isHydrated,
    error,
    isAuthenticated,
    isAdmin: isAuthenticated && isAdmin(),
    isSuperAdmin: isAuthenticated && isSuperAdmin(),
    isCurator: isAuthenticated && isCurator(),
    canContribute: isAuthenticated && canContribute(),
    logout,
  };
}

// Logout hook
export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return useCallback(async () => {
    logout();
    router.push('/');
  }, [logout, router]);
}
