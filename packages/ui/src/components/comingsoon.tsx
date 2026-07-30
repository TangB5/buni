'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Zap, ArrowRight } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface ComingsoonProps {
  icon: ReactNode;
  title: string;
  description: string;
  details: string;
  validation: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Comingsoon({
  icon,
  title,
  description,
  details,
  validation,
  isOpen,
  onClose,
}: ComingsoonProps) {
    
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="bg-avs-accent/60 fixed inset-0 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-avs-secondary border-avs-accent/9 pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl">
              <div
                className="avs-pattern-kente-royale absolute inset-0 opacity-[0.04]"
                aria-hidden
              />
              <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-0.5" aria-hidden />

              <div className="relative px-8 py-8">
                <button
                  onClick={onClose}
                  className="border-avs-accent/9 text-avs-accent/55 hover:text-avs-accent absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl border transition-colors"
                  aria-label="Fermer"
                >
                  <X size={15} />
                </button>

                <div className="bg-avs-primary/8 text-avs-primary mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
                  {icon}
                </div>

                <h2
                  className="text-avs-accent font-display mb-2 text-center text-2xl leading-tight font-black"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {title}
                </h2>
                <p className="text-avs-accent/55 mb-2 text-center text-sm leading-relaxed">
                  {description}
                </p>
                <p className="text-avs-accent/35 mb-7 text-center text-xs">
                  {details}
                </p>

                <button
                  onClick={onClose}
                  className="group text-avs-secondary bg-avs-primary shadow-avs-md hover:shadow-avs-lg flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                >
                  {validation}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
