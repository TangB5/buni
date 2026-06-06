'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@buni/auth';
import { useRouter } from 'next/navigation';
import type { LoginDto } from '../types';

interface LoginResponse {
  success: boolean;
  data: {
    user: any;
    tokens?: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export const useLogin = () => {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      return res.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      setToken(data.data.tokens?.accessToken ?? null);
      router.push('/dashboard');
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
