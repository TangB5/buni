'use client';

import { Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLocale } from '../hooks/use-locale';

const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(...i));

interface LocaleToggleProps {
  className?: string;
}

export function LocaleToggle({ className = '' }: LocaleToggleProps) {
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === 'fr' ? 'en' : 'fr');
  };

  return (
    <button
      onClick={toggleLocale}
      aria-label={`Switch to ${locale === 'fr' ? 'English' : 'Français'}`}
      className={cn(
        'border-avs-accent/9 text-avs-accent/55 flex h-9 w-9 items-center justify-center rounded-xl border',
        'hover:bg-avs-accent/4 hover:text-avs-accent hover:border-avs-accent/16',
        'transition-all duration-200',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={locale}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="font-mono text-xs font-bold"
        >
          {locale.toUpperCase()}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
