import type { Pattern } from './types';

// ─────────────────────────────────────────────────────────────
// TYPE GUARD
// ─────────────────────────────────────────────────────────────

export function isPattern(value: unknown): value is Pattern {
  if (!value || typeof value !== 'object') return false;

  const p = value as Pattern;

  return (
    typeof p.id === 'string' &&
    typeof p.slug === 'string' &&
    typeof p.name === 'string'
  );
}