'use client';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const store = useAuthStore();
  useEffect(() => { store.setHydrated(); }, []);
  return store;
};

export const useLogout = () => {
  const clearAuth = useAuthStore(s => s.clearAuth);
  return () => { clearAuth(); if (typeof window !== 'undefined') window.location.href = '/'; };
};
