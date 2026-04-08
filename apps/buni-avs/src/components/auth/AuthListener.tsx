'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authEvents } from '../../core/api/client';
import { useAuthStore } from '@buni/auth';
import { Route } from 'next';

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    authEvents.onUnauthorized = () => {
      // Clear auth state on 401
      useAuthStore.setState({ user: null });
      const params = new URLSearchParams({ expired: 'true' });
      router.push((`/auth/login?${params.toString()}`) as Route)
    };
  }, [router]);

  return null;
}
