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
    if (e.key === 'Enter' && results[highlight]) go(results[highlight].href);
  }

  return (
    <>
      {/* Trigger — sits in the topbar / homepage hero */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-avs-accent/10 bg-avs-secondary px-4 py-2.5 text-left text-avs-accent/40 shadow-sm transition-colors hover:border-avs-primary/30"
        aria-label="Ouvrir la recherche"
      >
        <i className="pi pi-search text-[13px]" aria-hidden />
        <span className="flex-1 text-sm">Rechercher…</span>
        <kbd className="rounded-md border border-avs-accent/12 bg-avs-accent/5 px-1.5 py-0.5 font-mono text-[10px] text-avs-accent/40">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[90] bg-avs-accent/60 backdrop-blur-sm"
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
              className="fixed left-1/2 top-[14vh] z-[91] w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-avs-accent/10 bg-avs-secondary shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-avs-accent/9 px-5 py-4">
                <i className="pi pi-search text-avs-accent/40" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
                  onKeyDown={onKeyDown}
                  placeholder="Rechercher dans la documentation…"
                  className="flex-1 bg-transparent text-[15px] text-avs-accent outline-none placeholder:text-avs-accent/30"
                />
                <kbd className="rounded-md border border-avs-accent/12 px-1.5 py-0.5 font-mono text-[10px] text-avs-accent/40">Esc</kbd>
              </div>

              <ul className="doc-scroll max-h-[50vh] overflow-y-auto py-2" role="listbox">
                {results.length === 0 && (
                  <li className="px-5 py-8 text-center text-sm text-avs-accent/35">Aucun résultat pour « {query} »</li>
                )}
                {results.map((r, i) => (
                  <li key={r.href} role="option" aria-selected={i === highlight}>
                    <button
                      onClick={() => go(r.href)}
                      onMouseEnter={() => setHighlight(i)}
                      className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${i === highlight ? 'bg-avs-primary/10' : ''}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${r.color}14`, color: r.color }}>
                        <i className={`pi pi-${r.icon}`} style={{ fontSize: '12px' }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-avs-accent">{r.title}</span>
                        <span className="block truncate text-[11px] text-avs-accent/35">{r.group}</span>
                      </span>
                      <i className="pi pi-arrow-right text-[10px] text-avs-accent/25" aria-hidden />
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