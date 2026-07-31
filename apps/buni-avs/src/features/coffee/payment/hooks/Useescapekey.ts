import { useEffect } from 'react';

/**
 * Appelle `onEscape` quand la touche Échap est pressée, uniquement
 * pendant que `active` est vrai (ex: modale ouverte).
 */
export function useEscapeKey(onEscape: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onEscape]);
}