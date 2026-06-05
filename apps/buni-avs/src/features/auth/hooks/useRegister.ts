'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@buni/auth';
import type { RegisterDto } from '../types';

interface RegisterResponse {
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

export const useRegister = () => {
  const { setUser, setToken } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: RegisterDto) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      return res.json() as Promise<RegisterResponse>;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      setToken(data.data.tokens.accessToken);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
  };
};
