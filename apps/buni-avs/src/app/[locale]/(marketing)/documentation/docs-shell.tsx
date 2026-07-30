'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { CommandPalette } from './command-palette';
import { ReadingProgress } from './doc-primitives';
import { DocsSidebar } from './docs-sidebar';

export function DocsShell({ children, showSidebar = true }: { children: React.ReactNode; showSidebar?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const crumbs = (pathname ?? '').split('/').filter(Boolean);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--doc-bg, #f8f6f2)' }}>
      <ReadingProgress />
      {showSidebar && <DocsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 px-4 backdrop-blur lg:px-8" style={{ borderBottom: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-1.5 lg:hidden"
            style={{ color: 'var(--doc-muted, rgba(29,29,27,0.52))' }}
            aria-label="Ouvrir la navigation"
          >
            <i className="pi pi-bars" style={{ fontSize: '17px' }} />
          </button>

          <nav aria-label="Fil d'ariane" className="hidden items-center gap-1.5 text-[11px] sm:flex" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))' }}>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <i className="pi pi-chevron-right" style={{ fontSize: '8px' }} aria-hidden />}
                <span className={i === crumbs.length - 1 ? 'font-semibold capitalize' : 'capitalize'} style={{ color: i === crumbs.length - 1 ? 'var(--doc-text, #1D1D1B)' : 'inherit' }}>
                  {c.replace(/-/g, ' ')}
                </span>
              </span>
            ))}
          </nav>

          <div className="ml-auto w-full max-w-[280px]">
            <CommandPalette />
          </div>
        </header>

        {/* Animated content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 flex-1"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}