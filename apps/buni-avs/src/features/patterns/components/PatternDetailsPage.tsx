'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, Share2, Download, 
  BookOpen, Hammer, Sparkles, Landmark, Palette, Layers, 
  Quote, Link2 
} from 'lucide-react';
import Link from 'next/link';
import { formatNumber } from '@buni/utils';

import { usePattern } from '../hooks/usePatterns';
import { PatternAdminActions } from './PatternAdminActions';

const CSS_PATTERN_MAP: Record<string, string> = {
  NDOP:    'avs-pattern-ndop-sultan',
  KENTE:   'avs-pattern-kente-royale',
  BOGOLAN: 'avs-pattern-bogolan-fanga',
  WAX:     'avs-pattern-wax-dakar',
  ADINKRA: 'avs-pattern-adinkra-sankofa',
  KUBA:    'avs-pattern-kuba-kasai',
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION DES SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'histoire',   label: 'Histoire',    icon: BookOpen },
  { id: 'technique',  label: 'Technique',   icon: Hammer },
  { id: 'symbolisme', label: 'Symbolisme',  icon: Sparkles },
  { id: 'ceremoniel', label: 'Cérémoniel',  icon: Landmark },
  { id: 'couleurs',   label: 'Couleurs',    icon: Palette },
  { id: 'symboles',   label: 'Symboles',    icon: Layers },
  { id: 'sources',    label: 'Sources',     icon: Link2 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANTS DE NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

function SectionNav({ available, activeSection }: { available: Set<string>; activeSection: string | null }) {
  const items = SECTIONS.filter((s) => available.has(s.id));
  if (items.length === 0) return null;

  return (
    <div className="sticky top-12 z-10 hidden lg:block">
      <nav className="pl-4 border-l border-avs-accent/10">
        <p className="mb-6 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-avs-accent/40">
          Sommaire
        </p>
        <ul className="space-y-4">
          {items.map(({ id, label, icon: Icon }) => (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                className={`group flex items-center gap-4 text-sm transition-all duration-300 ${
                  activeSection === id 
                    ? 'font-medium text-avs-primary' 
                    : 'font-light text-avs-accent/50 hover:text-avs-accent'
                }`}
              >
                {activeSection === id && (
                  <motion.div 
                    layoutId="activeSection"
                    className="absolute -left-[17px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-avs-primary"
                  />
                )}
                <Icon size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function MobileSectionNav({ available, activeSection, onSectionClick }: { available: Set<string>; activeSection: string | null; onSectionClick: (id: string) => void }) {
  const items = SECTIONS.filter((s) => available.has(s.id));
  if (items.length === 0) return null;

  return (
    <div className="sticky top-0 z-20 lg:hidden">
      <div className="border-b-[0.5px] border-avs-accent/10 bg-avs-secondary/80 backdrop-blur-xl">
        <div className="flex overflow-x-auto px-4 gap-6 scrollbar-hide">
          {items.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onSectionClick(id)}
              className={`relative shrink-0 px-1 py-4 text-xs font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeSection === id 
                  ? 'text-avs-primary border-avs-primary' 
                  : 'text-avs-accent/50 border-transparent hover:text-avs-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANTS DE MISE EN PAGE
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: typeof MapPin }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-avs-primary/20">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-avs-primary" aria-hidden />
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-avs-primary/8 text-avs-primary">
          <Icon size={16} aria-hidden />
        </div>
        <div>
          <p className="font-display text-xl font-black leading-none text-avs-accent" style={{ letterSpacing: '-0.02em' }}>{value}</p>
          <p className="mt-0.5 text-xs text-avs-accent/35">{label}</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ children, className, id, featured = false }: { children: React.ReactNode; className?: string; id?: string; featured?: boolean }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`scroll-mt-32 w-full rounded-2xl bg-avs-secondary transition-all duration-300 hover:-translate-y-0.5 border ${
        featured 
          ? 'border-avs-primary/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
          : 'border-avs-accent/9 hover:border-avs-primary/20'
      } ${className ?? ''}`}
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(192,87,62,0.10)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      {children}
    </motion.div>
  );
}

function PanelHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-avs-accent/9 px-6 py-5 md:px-8 md:py-6">
      <h3 className="font-display text-lg font-black text-avs-accent" style={{ letterSpacing: '-0.015em' }}>{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm font-light text-avs-accent/35">{subtitle}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

export default function PatternDetailsPage({ slug }: { slug: string }) {
  const { data: pattern, isLoading, error } = usePattern(slug);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const heroY = useTransform(scrollY, [0, 400], [0, 40]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.filter(s => pattern && (
        (s.id === 'histoire' && pattern.history) ||
        (s.id === 'technique' && pattern.technique) ||
        (s.id === 'symbolisme' && pattern.symbolism) ||
        (s.id === 'ceremoniel' && pattern.ceremonial) ||
        (s.id === 'couleurs' && pattern.colors?.length) ||
        (s.id === 'symboles' && pattern.symbols?.length) ||
        (s.id === 'sources' && pattern.sources?.length)
      ));
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pattern]);

  const handleSectionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-avs-secondary">
        <div className="relative bg-avs-secondary border-b border-avs-accent/9">
          <div className="avs-pattern-kente-royale absolute inset-0 opacity-[0.03]" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-avs-accent/6 rounded animate-pulse" />
          </div>
        </div>
        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-5 animate-pulse">
                <div className="h-4 w-16 bg-avs-accent/6 rounded" />
                <div className="mt-2 h-6 w-12 bg-avs-accent/6 rounded" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-avs-accent/9 bg-avs-secondary p-8 animate-pulse">
            <div className="aspect-[21/9] w-full bg-avs-accent/6 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-avs-secondary">
        <p className="mb-4 font-light text-avs-accent/60">Motif introuvable.</p>
        <Link href="/patternsDashboard" className="text-sm font-medium text-avs-primary hover:underline">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const patCss = CSS_PATTERN_MAP[pattern.type?.toUpperCase()] || 'avs-pattern-wax-dakar';
  const available = new Set<string>([
    pattern.history && 'histoire',
    pattern.technique && 'technique',
    pattern.symbolism && 'symbolisme',
    pattern.ceremonial && 'ceremoniel',
    pattern.colors?.length && 'couleurs',
    pattern.symbols?.length && 'symboles',
    pattern.sources?.length && 'sources',
  ].filter(Boolean) as string[]);

  return (
    <div className="min-h-screen bg-avs-secondary font-sans">
      {/* ══ HEADER ══════════════════════════════════════════════════════ */}
      <div className="relative bg-avs-secondary border-b border-avs-accent/9">
        <div className="avs-pattern-kente-royale absolute inset-0 opacity-[0.03]" aria-hidden />
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-px w-6 bg-avs-primary" aria-hidden />
              <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">
                Archive Visuelle Sénégalaise
              </span>
            </div>
            <h1 className="font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', letterSpacing: '-0.025em' }}>
              {pattern.name || pattern.localName}
            </h1>
            <p className="mt-1 text-sm text-avs-accent/35">
              {pattern.type} · {pattern.origin?.country || 'Origine inconnue'}
            </p>
          </div>
          <Link
            href="/patternsDashboard"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
            <ArrowLeft size={13} /> Retour
          </Link>
        </div>
      </div>

      <MobileSectionNav 
        available={available} 
        activeSection={activeSection} 
        onSectionClick={handleSectionClick} 
      />

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* ══ STATS ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard value={formatNumber(pattern.views || 0)} label="Vues" icon={MapPin} />
          <StatCard value={formatNumber(pattern.downloads || 0)} label="Téléchargements" icon={Download} />
          <StatCard value={pattern.type || 'N/A'} label="Type" icon={Palette} />
          <StatCard value={pattern.era || 'N/A'} label="Ère" icon={BookOpen} />
        </div>

        <div className="grid gap-12 lg:grid-cols-[200px_1fr] lg:items-start">
          <SectionNav available={available} activeSection={activeSection} />

          <div className="min-w-0 w-full space-y-16 pb-20">
            
            {/* HERO IMAGE */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary"
            >
              <div className="avs-pattern-ndop-sultan absolute inset-x-0 top-0 h-px opacity-70" aria-hidden />
              <div className="relative aspect-[4/3] w-full md:aspect-[21/9] overflow-hidden bg-avs-accent/5">
                {pattern.imgUrl ? (
                  <img
                    src={pattern.imgUrl}
                    alt={pattern.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`${patCss} w-full h-full opacity-80`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-avs-secondary via-avs-secondary/25 to-transparent" />
              </div>

              <div className="relative -mt-16 p-6 md:-mt-20 md:p-12 lg:-mt-28 lg:p-16">
                <div className="max-w-3xl">
                  <p className="text-base md:text-xl font-light leading-relaxed text-avs-accent/70 max-w-2xl">
                    {pattern.summary}
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-avs-accent/9 pt-8">
                  <div className="flex gap-3">
                    <button className="flex items-center justify-center h-10 w-10 rounded-full border border-avs-accent/9 text-avs-accent/35 hover:text-avs-accent hover:border-avs-accent/16 transition-all duration-150">
                      <Share2 size={16} />
                    </button>
                    <button className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 text-sm font-bold text-avs-secondary bg-avs-primary shadow-avs-md hover:-translate-y-0.5 transition-all duration-200">
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                      <Download size={14} /> Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <PatternAdminActions pattern={pattern as any} />
            </motion.div>

            {/* ══ CONTENU ═══════════════════════════════════════════════════ */}
            <div className="space-y-8">
              
              {pattern.history && (
                <Panel id="histoire" featured>
                  <PanelHeader 
                    title="Histoire & Origines" 
                    subtitle="L'évolution de ce motif à travers le temps"
                  />
                  <div className="p-6 md:p-12">
                    <p className="text-base font-light leading-relaxed text-avs-accent/80 md:text-lg">
                      {pattern.history}
                    </p>
                  </div>
                </Panel>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                {pattern.technique && (
                  <Panel id="technique">
                    <PanelHeader title="Technique" subtitle="Méthodes de fabrication" />
                    <div className="p-6 md:p-8">
                      <p className="text-sm font-light leading-relaxed text-avs-accent/70">
                        {pattern.technique}
                      </p>
                    </div>
                  </Panel>
                )}

                {pattern.symbolism && (
                  <Panel id="symbolisme">
                    <PanelHeader title="Symbolisme" subtitle="Significations culturelles" />
                    <div className="p-6 md:p-8">
                      <p className="mb-6 text-sm font-light leading-relaxed text-avs-accent/70">
                        {pattern.symbolism?.meaning}
                      </p>
                      {pattern.symbolism?.keywords && (
                        <div className="flex flex-wrap gap-2">
                          {pattern.symbolism.keywords.map((k: string) => (
                            <span
                              key={k}
                              className="rounded-lg px-2 py-0.5 font-mono text-[8px] font-semibold bg-avs-primary/8 text-avs-primary"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Panel>
                )}
              </div>

              {pattern.ceremonial && (
                <Panel id="ceremoniel">
                  <PanelHeader title="Usage Cérémoniel" subtitle="Contextes traditionnels" />
                  <div className="p-6 md:p-12">
                    <p className="text-base font-light leading-relaxed text-avs-accent/80">
                      {pattern.ceremonial}
                    </p>
                  </div>
                </Panel>
              )}
            </div>

            {/* ══ COULEURS ═════════════════════════════════════════════════ */}
            {pattern.colors && pattern.colors.length > 0 && (
              <Panel id="couleurs">
                <PanelHeader 
                  title="Palette Chromatique" 
                  subtitle={`${pattern.colors.length} teintes authentiques composant le motif`}
                />
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                    {pattern.colors.map((color: any, index: number) => (
                      <motion.div
                        key={color?.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
                        className="group flex flex-col items-center text-center"
                      >
                        <div 
                          className="mb-3 aspect-square w-full max-w-16 rounded-full border border-black/5 shadow-sm transition-transform duration-300 group-hover:scale-105" 
                          style={{ backgroundColor: color?.hex }} 
                        />
                        <p className="text-sm font-medium text-avs-accent">{color?.name}</p>
                        <p className="font-mono text-[10px] tracking-widest text-avs-accent/40 mt-0.5">{color?.hex}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {/* ══ SYMBOLES ═════════════════════════════════════════════════ */}
            {pattern.symbols && pattern.symbols.length > 0 && (
              <Panel id="symboles">
                <PanelHeader title="Lexique des Symboles" subtitle="Éléments iconographiques" />
                <div className="p-6 md:p-8">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pattern.symbols.map((symbol: any) => (
                      <motion.div
                        key={symbol?.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="group flex items-center gap-4 rounded-2xl border border-avs-accent/9 p-4 transition-all duration-200 hover:translate-x-0.5 hover:border-avs-primary/20"
                      >
                        {symbol?.imageUrl && (
                          <img
                            src={symbol.imageUrl}
                            alt={symbol.name}
                            className="h-11 w-11 shrink-0 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-display text-sm font-bold leading-tight text-avs-accent" style={{ letterSpacing: '-0.01em' }}>{symbol?.name}</h3>
                          {symbol?.meaning && (
                            <p className="mt-1.5 text-xs font-light leading-relaxed text-avs-accent/35 line-clamp-2">{symbol.meaning}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {/* ══ CITATION ARTISAN ═══════════════════════════════════════ */}
            {pattern.artisanQuote && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="avs-pattern-kente-royale relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.96) 0%, rgba(26,18,8,0.89) 100%)' }} aria-hidden />
                <div className="relative px-8 py-10 text-center">
                  <Quote className="mx-auto mb-6 text-avs-primary/30" size={36} strokeWidth={1} />
                  <p className="mx-auto max-w-2xl font-display font-light italic leading-relaxed text-avs-secondary" style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)' }}>
                    «&nbsp;{pattern.artisanQuote.text}&nbsp;»
                  </p>
                  <div className="mt-8 flex flex-col items-center">
                    <p className="text-sm font-medium tracking-wide text-avs-secondary uppercase">
                      {pattern.artisanQuote.author}
                    </p>
                    <p className="mt-1 text-xs font-light text-avs-secondary/52">
                      {pattern.artisanQuote.role}, {pattern.artisanQuote.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ SOURCES ═════════════════════════════════════════════════ */}
            {pattern.sources && pattern.sources.length > 0 && (
              <Panel id="sources">
                <PanelHeader title="Références" subtitle="Documentation et bibliographie" />
                <div className="p-6 md:p-8">
                  <ul className="space-y-2">
                    {pattern.sources.map((source, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(idx * 0.035, 0.25), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 text-sm font-light text-avs-accent/35 transition-colors hover:text-avs-primary"
                        >
                          <Link2 size={14} className="opacity-50 shrink-0" />
                          <span className="truncate">{source}</span>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Panel>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}