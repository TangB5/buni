'use client';

import { useDarkMode } from '@buni/utils';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';


export function ThemeToggle() {
  const { isDark, toggleDarkMode, isMounted } = useDarkMode();

  if (!isMounted) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
      className="w-10 h-10 p-0 rounded-full"
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
