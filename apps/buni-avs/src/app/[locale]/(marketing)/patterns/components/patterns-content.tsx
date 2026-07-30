'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PatternSheet } from './pattern-sheet';
import { PATTERNS_DOCS } from '../mock';
import { patternRepository } from '@/features/patterns/repositories/pattern.repository';
import { useTranslations } from '@/i18n';

const TYPES = ['ALL', 'KENTE', 'NDOP', 'BOGOLAN', 'ADINKRA', 'WAX', 'NDEBELE', 'KUBA'];

export function PatternsContent() {
  const t = useTranslations('patterns');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [mobileDoc, setMobileDoc] = useState(false);
  const [patterns, setPatterns] = useState<any[]>([]);

  // Load patterns: mocks first, then merge with backend
  useEffect(() => {
    setPatterns(PATTERNS_DOCS);

    const loadPatternsFromBackend = async () => {
      try {
        const backendPatterns = await patternRepository.findAll();
        const mockIds = new Set(PATTERNS_DOCS.map((p) => p.id));
        const newPatterns = backendPatterns.filter((p) => !mockIds.has(p.id));
        setPatterns([...PATTERNS_DOCS, ...newPatterns]);
      } catch (error) {
        console.error('Error loading patterns from backend:', error);
        setPatterns(PATTERNS_DOCS);
      }
    };

    loadPatternsFromBackend();
  }, []);

  // Handle pattern from URL params
  useEffect(() => {
    const patternId = searchParams.get('pattern');
    if (patternId && patterns.length > 0) {
      const found = patterns.find((p) => p.id === patternId);
      if (found) {
        setSelected(found);
        setMobileDoc(true);
      }
    }
  }, [searchParams, patterns]);

  const filtered = patterns.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.origin.country.toLowerCase().includes(q) ||
      p.origin.people.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q);
    const matchType = activeType === 'ALL' || p.type === activeType;
    return matchSearch && matchType;
  });

  const handleSelect = (p: any) => {
    setSelected(p);
    setMobileDoc(true);
    router.push(`/patterns?pattern=${p.id}`, { scroll: false });
  };

  return (
    <div className="bg-avs-secondary flex h-screen flex-col overflow-hidden">
      {/* TOPBAR */}
      <div className="bg-avs-secondary border-avs-accent/10 relative shrink-0 overflow-hidden border-b px-4 sm:px-6 py-4 sm:py-5 backdrop-blur-xl">
        <div
          className="avs-pattern-wax-dakar pointer-events-none absolute inset-0 opacity-[0.03]"
          aria-hidden
        />

        <div className="relative flex flex-col gap-4 sm:gap-5">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-avs-primary h-px w-4 sm:w-6" aria-hidden />
                <span className="text-avs-primary font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.24em] uppercase">
                  {t('header.label', { count: patterns.length })}
                </span>
              </div>
              <h1 className="font-display text-avs-accent text-2xl sm:text-4xl leading-none font-black tracking-tight">
                {t('header.title')}
              </h1>
            </div>
            <p className="text-avs-accent/50 max-w-xs text-xs leading-relaxed">
              {t('header.description')}
            </p>
          </div>

          {/* Search + type filters */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <i
                className="pi pi-search text-avs-accent/40 absolute top-1/2 left-3 sm:left-3.5 -translate-y-1/2"
                style={{ fontSize: '12px' }}
                aria-hidden
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search.placeholder')}
                className="avs-input focus:border-avs-primary pr-9 pl-9 text-sm"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch('')}
                    className="text-avs-accent/40 hover:text-avs-accent absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-0.5 transition-colors"
                    aria-label={t('search.clear')}
                  >
                    <i className="pi pi-times" style={{ fontSize: '12px' }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`shrink-0 rounded-lg px-2.5 sm:px-3 py-1.5 font-mono text-[8px] sm:text-[9px] font-black tracking-[0.14em] uppercase transition-all duration-150 ${
                    activeType === type
                      ? 'bg-avs-primary text-avs-secondary shadow-avs-sm'
                      : 'border-avs-accent/15 text-avs-accent/50 bg-avs-secondary hover:border-avs-primary/20 hover:text-avs-primary border'
                  } `}
                >
                  {t(`types.${type}` as any)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`bg-avs-secondary border-avs-accent/10 flex w-full sm:w-72 lg:w-80 shrink-0 flex-col overflow-hidden border-r ${mobileDoc ? 'hidden lg:flex' : 'flex'} `}
        >
          <div className="border-avs-accent/10 flex items-center justify-between border-b px-3 sm:px-4 py-2.5 sm:py-3">
            <p className="text-avs-accent/40 font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.18em] uppercase">
              {t('sidebar.count', { count: filtered.length })}
            </p>
            {(search || activeType !== 'ALL') && (
              <button
                onClick={() => {
                  setSearch('');
                  setActiveType('ALL');
                }}
                className="text-avs-primary font-mono text-[8px] sm:text-[9px] font-bold tracking-wide underline underline-offset-3"
              >
                {t('search.reset')}
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 sm:p-8">
              <div
                className="avs-pattern-wax-dakar h-16 w-16 sm:h-20 sm:w-20 rounded-full opacity-20"
                aria-hidden
              />
              <div className="text-center">
                <p className="text-avs-accent/40 text-sm font-medium">{t('sidebar.noResults.title')}</p>
                <p className="text-avs-accent/30 mt-1 text-xs">{t('sidebar.noResults.subtitle')}</p>
              </div>
            </div>
          ) : (
            <nav
              className="flex-1 overflow-y-auto py-1.5 [scrollbar-width:thin]"
              aria-label={t('sidebar.listLabel')}
            >
              {filtered.map((p) => {
                const isActive = selected?.id === p.id;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={`group border-avs-accent/10 w-full border-b border-l-2 text-left transition-colors duration-100 ${
                      isActive
                        ? 'border-l-avs-primary bg-avs-primary/5'
                        : 'hover:bg-avs-secondary-dark border-l-transparent'
                    } `}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5">
                      <div
                        className={`${p.cssClass} relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-lg sm:rounded-xl ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-105 dark:ring-white/10`}
                      >
                        {p.imgUrl ? (
                          <img
                            src={p.imgUrl}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-display truncate text-sm leading-tight font-bold ${isActive ? 'text-avs-primary' : 'text-avs-accent'}`}
                        >
                          {p.name}
                        </p>
                        <p className="text-avs-accent/40 mt-0.5 font-mono text-[8px] sm:text-[9px]">
                          {p.origin.flag} {p.origin.country}
                        </p>
                        <p className="text-avs-accent/30 mt-0.5 text-[9px] sm:text-[10px] line-clamp-1">
                          {p.origin.people}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-hidden">
          {selected ? (
            <PatternSheet pattern={selected} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="avs-pattern-wax-dakar mx-auto mb-4 h-16 w-16 sm:h-20 sm:w-20 rounded-full opacity-20" />
                <p className="text-avs-accent/40 text-sm">
                  {t('main.selectPattern')}
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Mobile close button */}
        {mobileDoc && selected && (
          <button
            onClick={() => {
              setMobileDoc(false);
              setSelected(null);
              router.push('/patterns', { scroll: false });
            }}
            className="lg:hidden fixed bottom-6 right-6 bg-avs-primary text-avs-secondary shadow-avs-md flex h-12 w-12 items-center justify-center rounded-full z-50"
            aria-label={t('mobile.close')}
          >
            <i className="pi pi-times" style={{ fontSize: '16px' }} />
          </button>
        )}
      </div>
    </div>
  );
}
