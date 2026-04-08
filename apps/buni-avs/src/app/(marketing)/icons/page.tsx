'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IconsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('https://icons.buni.africa');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl mb-4">Redirection...</h1>
        <p className="text-gray-600">Les icônes ont été déplacées vers icons.buni.africa</p>
      </div>
    </div>
  );
}
