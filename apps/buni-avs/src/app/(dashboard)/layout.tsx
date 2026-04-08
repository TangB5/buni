'use client';

import { useAuth } from '@buni/auth';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      const params = new URLSearchParams({ expired: 'true' });
      router.push('/auth/login?' + params.toString() as Route);
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return (
      <div className="bg-avs-secondary flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-avs-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-avs-accent/60 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
