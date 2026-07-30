'use client';

import { BuniLoader } from '@buni/ui';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-avs-accent/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={message || 'Chargement…'}
    >
      <BuniLoader size={80} showText={false} theme="dark" />
    </div>
  );
}
