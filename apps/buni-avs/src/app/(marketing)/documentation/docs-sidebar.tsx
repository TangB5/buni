'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_SPACES } from './nav-data';


const FAVORITES_KEY = 'avs-docs-favorites';
const HISTORY_KEY = 'avs-docs-history';
const HISTORY_LIMIT = 5;

function useLocalList(key: string) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore malformed storage */ }
  }, [key]);
  const persist = (next: string[]) => {
    setItems(next);
    try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage unavailable */ }
  };
  return [items, persist] as const;
}

export function DocsSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useLocalList(FAVORITES_KEY);
  const [history] = useLocalList(HISTORY_KEY);
  const [tab, setTab] = useState<'nav' | 'favoris' | 'historique'>('nav');

  // Track visited pages for the "récemment consultés" list
  useEffect(() => {
    if (!pathname?.startsWith('/documentation')) return;
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      const prev: string[] = raw ? JSON.parse(raw) : [];
      const next = [pathname, ...prev.filter((p) => p !== pathname)].slice(0, HISTORY_LIMIT);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch { /* storage unavailable */ }
  }, [pathname]);

  function toggleFavorite(href: string) {
    setFavorites(favorites.includes(href) ? favorites.filter((f) => f !== href) : [href, ...favorites]);
  }

  const activeSpaceSlug = useMemo(() => pathname?.split('/')[2], [pathname]);

  const content = (
    <div className="flex h-full flex-col bg-avs-secondary">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-avs-accent/9 p-2">
        {([
          ['nav', 'pi-list', 'Navigation'],
          ['favoris', 'pi-star', 'Favoris'],
          ['historique', 'pi-history', 'Historique'],
        ] as const).map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-current={tab === id}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-colors ${
              tab === id ? 'bg-avs-primary/10 text-avs-primary' : 'text-avs-accent/40 hover:text-avs-accent/70'
            }`}
          >
            <i className={`pi ${icon}`} style={{ fontSize: '11px' }} aria-hidden />
            <span className="hidden xl:inline">{label}</span>
          </button>
        ))}
      </div>

      <nav className="doc-scroll flex-1 overflow-y-auto p-3" aria-label="Navigation de la documentation">
        {tab === 'nav' &&
          NAV_SPACES.map((space) => {
            const isExpanded = expanded[space.slug] ?? space.slug === activeSpaceSlug;
            return (
              <div key={space.slug} className="mb-0.5">
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [space.slug]: !isExpanded }))}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    space.slug === activeSpaceSlug ? 'text-avs-primary' : 'text-avs-accent/70 hover:text-avs-accent'
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: `${space.color}14`, color: space.color }}>
                    <i className={`pi pi-${space.icon}`} style={{ fontSize: '11px' }} />
                  </span>
                  <span className="flex-1 truncate">{space.label}</span>
                  <i className={`pi pi-chevron-right text-[9px] text-avs-accent/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`} aria-hidden />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="ml-9 overflow-hidden border-l border-avs-accent/9 pl-3"
                    >
                      {space.pages.map((p) => {
                        const href = `/documentation/${space.slug}/${p.slug}`;
                        const isActive = pathname === href;
                        return (
                          <div key={p.slug} className="group flex items-center">
                            <Link
                              href={href}
                              className={`flex-1 truncate rounded-lg px-2 py-1.5 text-[13px] transition-colors ${
                                isActive ? 'bg-avs-primary/10 font-semibold text-avs-primary' : 'text-avs-accent/55 hover:text-avs-accent'
                              }`}
                            >
                              {p.title}
                            </Link>
                            <button
                              onClick={() => toggleFavorite(href)}
                              aria-label={favorites.includes(href) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                              className={`px-1.5 opacity-0 transition-opacity group-hover:opacity-100 ${favorites.includes(href) ? '!opacity-100 text-avs-primary' : 'text-avs-accent/25'}`}
                            >
                              <i className={favorites.includes(href) ? 'pi pi-star-fill' : 'pi pi-star'} style={{ fontSize: '10px' }} />
                            </button>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

        {tab === 'favoris' && (
          favorites.length === 0
            ? <p className="px-3 py-6 text-center text-[13px] text-avs-accent/35">Aucun favori pour l&apos;instant. Cliquez sur l&apos;étoile d&apos;une page.</p>
            : favorites.map((href) => <SidebarLink key={href} href={href} active={pathname === href} />)
        )}

        {tab === 'historique' && (
          history.length === 0
            ? <p className="px-3 py-6 text-center text-[13px] text-avs-accent/35">Votre historique de lecture apparaîtra ici.</p>
            : history.map((href) => <SidebarLink key={href} href={href} active={pathname === href} />)
        )}
      </nav>

      {/* Quick access footer */}
      <div className="space-y-0.5 border-t border-avs-accent/9 p-3">
        {[
          { href: 'https://github.com/avs-standard', label: 'GitHub', icon: 'pi-github', external: true },
          { href: '/documentation/composants', label: 'Composants', icon: 'pi-box' },
          { href: '/documentation/icones', label: 'Icônes', icon: 'pi-sun' },
        ].map(({ href, label, icon, external }) => (
          <a
            key={href}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-avs-accent/32 transition-colors hover:text-avs-primary"
          >
            <i className={`pi ${icon}`} style={{ fontSize: '12px' }} />
            {label}
            {external && <i className="pi pi-external-link ml-auto opacity-40" style={{ fontSize: '9px' }} />}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop — persistent */}
      <aside className="doc-scroll sticky top-0 hidden h-screen w-72 shrink-0 border-r border-avs-accent/9 lg:block">
        {content}
      </aside>

      {/* Mobile — slide-over */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-avs-accent/50 lg:hidden" onClick={onClose} aria-hidden
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-avs-accent/9 lg:hidden"
              role="dialog" aria-modal="true" aria-label="Navigation"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarLink({ href, active }: { href: string; active: boolean }) {
  const title = href.split('/').pop()?.replace(/-/g, ' ') ?? href;
  return (
    <Link
      href={href}
      className={`block truncate rounded-lg px-3 py-2 text-[13px] capitalize transition-colors ${
        active ? 'bg-avs-primary/10 font-semibold text-avs-primary' : 'text-avs-accent/55 hover:text-avs-accent'
      }`}
    >
      {title}
    </Link>
  );
}