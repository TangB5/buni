'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@buni/auth';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

interface GoogleLoginResponse {
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

export const useGoogleLogin = () => {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (accessToken: string) => {
      const response = await authService.googleLogin(accessToken);

      if (!response.success) {
        throw new Error('Google login failed');
      }

      return response as GoogleLoginResponse;
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
