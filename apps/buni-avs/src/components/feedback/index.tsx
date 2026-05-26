'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X, AlertTriangle } from 'lucide-react';
import { cn } from '@buni/ui';

// =============================================================================
// ALERT — messages d'état inline
// =============================================================================
type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const ALERT_CONFIG: Record<AlertVariant, { icon: typeof Info; classes: string }> = {
  info:    { icon: Info,          classes: 'border-avs-indigo/30 bg-avs-indigo/8 text-avs-indigo'    },
  success: { icon: CheckCircle,   classes: 'border-green-300/50 bg-green-50 text-green-700'          },
  warning: { icon: AlertTriangle, classes: 'border-amber-300/50 bg-amber-50 text-amber-700'          },
  error:   { icon: XCircle,       classes: 'border-red-300/50 bg-red-50 text-red-700'                },
};

interface AlertProps {
  variant?:   AlertVariant;
  title?:     string;
  message:    string;
  className?: string;
  onClose?:   () => void;
}

export function Alert({ variant = 'info', title, message, className, onClose }: AlertProps) {
  const { icon: Icon, classes } = ALERT_CONFIG[variant];
  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 rounded-avs border px-4 py-3', classes, className)}
    >
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        <p className={cn('text-sm', title && 'mt-0.5 opacity-85')}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Fermer l'alerte"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// TOAST — notification temporaire (bas de page)
// =============================================================================
interface ToastProps {
  id:       string;
  variant?: AlertVariant;
  title?:   string;
  message:  string;
  onClose:  (id: string) => void;
}

export function Toast({ id, variant = 'info', title, message, onClose }: ToastProps) {
  const { icon: Icon, classes } = ALERT_CONFIG[variant];

  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex w-80 items-start gap-3 rounded-avs-lg border px-4 py-3.5 shadow-avs-lg',
        classes
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        <p className={cn('text-sm', title && 'mt-0.5 opacity-85')}>{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fermer"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

// Hook useToast
interface ToastItem { id: string; variant?: AlertVariant; title?: string; message: string; }

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const add = React.useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const remove = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastContainer = React.useCallback(() => (
    <div className="avs-toast flex flex-col gap-2 pointer-events-none" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onClose={remove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  ), [toasts, remove]);

  return { add, remove, ToastContainer, toasts };
}

// =============================================================================
// EMPTY STATE
// =============================================================================
interface EmptyStateProps {
  icon?:        React.ReactNode;
  title:        string;
  description?: string;
  action?:      ReactNode;
  className?:   string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-avs-accent/6">
          {icon}
        </div>
      )}
      <div>
        <p className="font-display text-lg font-semibold text-avs-accent/50">{title}</p>
        {description && <p className="mt-1 text-sm text-avs-accent/35">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// =============================================================================
// ERROR BOUNDARY
// =============================================================================
interface ErrorBoundaryProps {
  children:  ReactNode;
  fallback?: ReactNode;
}
interface ErrorBoundaryState { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[AVS ErrorBoundary]', error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" className="rounded-avs-lg border-2 border-avs-primary/30 bg-avs-primary/5 p-8 text-center">
          <AlertCircle size={32} className="mx-auto mb-3 text-avs-primary" aria-hidden />
          <p className="font-display font-semibold text-avs-accent">Une erreur est survenue</p>
          <p className="mt-1 text-sm text-avs-accent/60">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-4 text-xs font-semibold text-avs-primary underline-offset-4 hover:underline"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// =============================================================================
// LOADING PAGE
// =============================================================================
export function LoadingPage({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" aria-live="polite">
      <div className="avs-pattern-ndop h-16 w-16 animate-avs-spin rounded-full opacity-60" aria-hidden />
      <p className="text-sm font-medium text-avs-accent/50">{label}</p>
    </div>
  );
}