'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@buni/auth';
import { RegisterSchema } from '../types';
import { z } from 'zod';

interface RegisterResponse {
  success: boolean;
  data: {
    user: any;
  };
}

export const useRegister = () => {
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const validatedData = RegisterSchema.parse(data);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      return res.json() as Promise<RegisterResponse>;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
  };
};
