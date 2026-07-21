'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_SPACES } from './nav-data';


// ─────────────────────────────────────────────────────────────────────────────
// FLAT SEARCH INDEX — spaces + their pages, built once from nav data
// ─────────────────────────────────────────────────────────────────────────────

interface SearchEntry { href: string; title: string; group: string; icon: string; color: string }

const INDEX: SearchEntry[] = NAV_SPACES.flatMap((space) => [
  { href: `/documentation/${space.slug}`, title: space.label, group: 'Espaces', icon: space.icon, color: space.color },
  ...space.pages.map((p) => ({
    href: `/documentation/${space.slug}/${p.slug}`,
    title: p.title,
    group: space.label,
    icon: space.icon,
    color: space.color,
  })),
]);

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ⌘K / Ctrl+K to toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return INDEX.slice(0, 8);
    const q = query.toLowerCase();
    return INDEX.filter((e) => e.title.toLowerCase().includes(q) || e.group.toLowerCase().includes(q)).slice(0, 10);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    router.push(href as Route);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
    if (e.key === 'Enter' && results[highlight]) go(results[highlight]!.href);
  }

  return (
    <>
      {/* Trigger — sits in the topbar / homepage hero */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left shadow-sm transition-colors"
        style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)', color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--doc-primary, #C0573E)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--doc-border, rgba(29,29,27,0.09))'; }}
        aria-label="Ouvrir la recherche"
      >
        <i className="pi pi-search" style={{ fontSize: '13px' }} aria-hidden />
        <span className="flex-1 text-sm">Rechercher…</span>
        <kbd className="rounded-md px-1.5 py-0.5 font-mono text-[10px]" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-primary-10, rgba(192,87,62,0.10))', color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[90] backdrop-blur-sm"
              style={{ background: 'var(--doc-hint, rgba(29,29,27,0.32))' }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Recherche"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-[14vh] z-[91] w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl"
              style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}
            >
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--doc-border, rgba(29,29,27,0.09))' }}>
                <i className="pi pi-search" style={{ fontSize: '13px', color: 'var(--doc-hint, rgba(29,29,27,0.32))' }} aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
                  onKeyDown={onKeyDown}
                  placeholder="Rechercher dans la documentation…"
                  className="flex-1 bg-transparent text-[15px] outline-none"
                  style={{ color: 'var(--doc-text, #1D1D1B)' }}
                />
                <kbd className="rounded-md px-1.5 py-0.5 font-mono text-[10px]" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-primary-10, rgba(192,87,62,0.10))', color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>Esc</kbd>
              </div>

              <ul className="doc-scroll max-h-[50vh] overflow-y-auto py-2" role="listbox" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--doc-border-md, rgba(29,29,27,0.14)) transparent' }}>
                {results.length === 0 && (
                  <li className="px-5 py-8 text-center text-sm" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>Aucun résultat pour « {query} »</li>
                )}
                {results.map((r, i) => (
                  <li key={r.href} role="option" aria-selected={i === highlight}>
                    <button
                      onClick={() => go(r.href)}
                      onMouseEnter={() => setHighlight(i)}
                      className="flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors"
                      style={i === highlight ? { background: 'var(--doc-primary-10, rgba(192,87,62,0.10))' } : {}}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${r.color}14`, color: r.color }}>
                        <i className={`pi pi-${r.icon}`} style={{ fontSize: '12px' }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium" style={{ color: 'var(--doc-text, #1D1D1B)' }}>{r.title}</span>
                        <span className="block truncate text-[11px]" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>{r.group}</span>
                      </span>
                      <i className="pi pi-arrow-right" style={{ fontSize: '10px', color: 'var(--doc-hint, rgba(29,29,27,0.32))' }} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}