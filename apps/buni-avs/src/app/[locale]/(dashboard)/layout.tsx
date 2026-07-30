'use client';

import { useAuth } from '@buni/auth';
import { BuniLoader } from '@buni/ui';
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
      <div className="bg-avs-secondary min-h-screen relative">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-avs-accent/60 backdrop-blur-sm">
          <BuniLoader size={200} showText={false} theme="dark" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
