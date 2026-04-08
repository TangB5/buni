// =============================================================================
// Core Utils — Utilitaires partagés
// =============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── cn — merge de classes Tailwind ────────────────────────────────────────────
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// ── Formatters ────────────────────────────────────────────────────────────────
export const fmt = {
  /** Nombre avec séparateurs de milliers */
  number: (n: number, locale = 'fr-FR') =>
    new Intl.NumberFormat(locale).format(n),

  /** Nombre compact : 1 200 → 1,2k */
  compact: (n: number) =>
    new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(n),

  /** Date relative : "il y a 3 jours" */
  relative: (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = Date.now() - d.getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);
    if (mins  <  1) return 'à l\'instant';
    if (mins  < 60) return `il y a ${mins} min`;
    if (hours < 24) return `il y a ${hours}h`;
    if (days  <  7) return `il y a ${days}j`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  /** Date longue : "12 janvier 2024" */
  date: (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  },
};

// ── Slug ──────────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 64);
}

// ── Couleurs ──────────────────────────────────────────────────────────────────
/** Détermine si un HEX est clair (pour le contraste texte) */
export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Luminance perceptuelle (W3C)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

/** Convertit HEX → RGB */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1]!, 16), g: parseInt(result[2]!, 16), b: parseInt(result[3]!, 16) }
    : null;
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function buildPaginationRange(current: number, total: number, delta = 2): (number | '…')[] {
  const range: (number | '…')[] = [];
  const left  = current - delta;
  const right = current + delta;
  let prev    = 0;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      if (prev && i - prev > 1) range.push('…');
      range.push(i);
      prev = i;
    }
  }
  return range;
}

// ── Guards ────────────────────────────────────────────────────────────────────
export function isDefined<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// ── Debounce ──────────────────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms = 300): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

// ── localStorage safe ─────────────────────────────────────────────────────────
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch { return fallback; }
  },
  set: (key: string, value: unknown): void => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};