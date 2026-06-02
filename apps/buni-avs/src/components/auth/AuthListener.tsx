'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@buni/auth';
import { Route } from 'next';
import { useEffect } from 'react';

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    // This is now handled by the apiClient interceptor
    // that calls logout() on 401 responses
  }, [router]);

  return null;
}
