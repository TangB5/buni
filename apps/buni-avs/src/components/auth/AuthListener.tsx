'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authEvents } from '../../core/api/client';
import { useAuthStore } from '@buni/auth';

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    authEvents.onUnauthorized = () => {
      // Clear auth state on 401
      useAuthStore.setState({ user: null });
      router.push('/auth/login?expired=true');
    };
  }, [router]);

  return null;
}
