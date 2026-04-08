'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AuthResponse, authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginDto, RegisterDto } from '../types';

// Main auth hook - state from store
export function useAuth() {
  const { user, isLoading, isHydrated, error, logout, isAdmin, isCurator, canContribute } =
    useAuthStore();

  const isAuthenticated = !!user;

  return {
    user: isAuthenticated ? user : null,
    isLoading,
    isHydrated,
    error,
    isAuthenticated,
    isAdmin: isAuthenticated && isAdmin(),
    isCurator: isAuthenticated && isCurator(),
    canContribute: isAuthenticated && canContribute(),
    logout,
  };
}

// Session validation hook - checks /me endpoint
export function useSessionValidation() {
  const { setUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.getMe(),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setUser(response.data);
      setLoading(false);
    },
    onError: (err: Error) => {
      setError(err.message);
      setLoading(false);
    },
  });
}

// Login hook
export function useLogin() {
  const router = useRouter();
  const { setUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),

    onMutate: () => {
      setLoading(true);
      setError(null);
    },

    onSuccess: (response: AuthResponse) => {
      const { user } = response.data;
      setUser(user);
      setLoading(false);
      router.push('/dashboard');
    },

    onError: (err: Error) => {
      setError(err.message);
      setLoading(false);
    },
  });
}

// Register hook
export function useRegister() {
  const router = useRouter();
  const { setUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: (dto: RegisterDto) => authService.register(dto),

    onMutate: () => {
      setLoading(true);
      setError(null);
    },

    onSuccess: (response: AuthResponse) => {
      const { user } = response.data;
      setUser(user);
      setLoading(false);
      router.push('/dashboard');
    },

    onError: (err: Error) => {
      setError(err.message);
      setLoading(false);
    },
  });
}

// Logout hook
export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // silent
    }

    logout();
    router.push('/');
  }, [logout, router]);
}
