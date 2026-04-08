import * as React from 'react';
import { cn } from '../utils';

export const Spinner: React.FC<{ size?: number; className?: string; label?: string }> = ({ size = 20, className, label }) => (
  <div role="status" aria-label={label ?? 'Chargement'} className={cn('inline-flex items-center gap-2', className)}>
    <div className="avs-pattern-kente rounded-full animate-avs-spin border border-avs-accent/10" style={{ width: size, height: size }} />
    {label && <span className="font-mono text-xs text-avs-accent/40">{label}</span>}
  </div>
);

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('animate-pulse rounded-avs bg-avs-accent/8', className)} {...props} />
);

export const LoadingPage: React.FC<{ label?: string }> = ({ label = 'Chargement…' }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
    <Spinner size={40} />
    <p className="font-mono text-xs uppercase tracking-widest text-avs-accent/35">{label}</p>
  </div>
);
