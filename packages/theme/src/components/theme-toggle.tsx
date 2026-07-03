'use client';

import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/use-theme';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...i: Parameters<typeof clsx>) => twMerge(clsx(...i));

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      className={cn(
        'border-avs-accent/9 text-avs-accent/55 flex h-9 w-9 items-center justify-center rounded-xl border',
        'hover:bg-avs-accent/4 hover:text-avs-accent hover:border-avs-accent/16',
        'transition-all duration-200',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme === 'dark' ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
