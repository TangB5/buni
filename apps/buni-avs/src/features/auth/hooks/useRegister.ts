'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@buni/auth';
import { authService } from '../services/auth.service';
import { RegisterSchema } from '../types';

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
      const response = await authService.register(validatedData);

      if (!response.success) {
        throw new Error('Registration failed');
      }

      return response as RegisterResponse;
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
