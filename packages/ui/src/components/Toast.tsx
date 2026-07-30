'use client';
import * as React from 'react';
import { useState, useCallback, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, Info, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '../utils';
 
type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'kente';
interface Toast { id: string; variant: ToastVariant; title?: string; message: string; duration?: number; }
interface ToastContextValue { add: (t: Omit<Toast, 'id'>) => string; remove: (id: string) => void; }
 
const ToastContext = createContext<ToastContextValue | null>(null);
 
const TOAST_CONFIG: Record<ToastVariant, { css: string; Icon: typeof Check }> = {
  success: { css: 'bg-green-50 border-green-200 text-green-800',         Icon: Check        },
  error:   { css: 'bg-red-50 border-red-200 text-red-700',               Icon: AlertCircle  },
  info:    { css: 'bg-avs-indigo/8 border-avs-indigo/30 text-avs-indigo', Icon: Info         },
  warning: { css: 'bg-amber-50 border-amber-200 text-amber-800',          Icon: AlertCircle  },
  kente:   { css: 'bg-avs-kente/10 border-avs-kente/30 text-avs-kente',   Icon: Sparkles     },
};
 
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
 
  const remove = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []);
 
  const add = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev.slice(-4), { ...t, id }]);
    setTimeout(() => remove(id), t.duration ?? 4500);
    return id;
  }, [remove]);
 
  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="pointer-events-none absolute top-5 right-25 z-100 flex flex-col gap-2.5 w-80">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => {
            const { css, Icon } = TOAST_CONFIG[toast.variant];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 40, scale: .94 }}
                animate={{ opacity: 1, x: 0,  scale: 1    }}
                exit={{    opacity: 0, x: 40,  scale: .94  }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={cn('pointer-events-auto flex items-start gap-3 rounded-avs-xl border px-4 py-3.5 shadow-avs-md', css)}
                role="alert"
              >
                <Icon size={15} className="mt-0.5 shrink-0" aria-hidden />
                <div className="flex-1 min-w-0">
                  {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
                  <p className={cn('text-sm leading-snug', toast.title ? 'opacity-75 mt-0.5' : '')}>{toast.message}</p>
                </div>
                <button
                  onClick={() => remove(toast.id)}
                  className="shrink-0 opacity-50 hover:opacity-100 transition-opacity rounded-avs p-0.5 hover:bg-black/8"
                  aria-label="Fermer"
                >
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
 
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast doit être utilisé dans un ToastProvider');
  return ctx;
}
 