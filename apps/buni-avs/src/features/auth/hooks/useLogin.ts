'use client';

import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@buni/auth';
import type { LoginDto } from '../types';

interface LoginResponse {
  success: boolean;
  data: {
    user: any;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      return res.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      setUser(data.data.user, data.data.tokens.accessToken);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
