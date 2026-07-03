'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Copy,
  Check,
  ChevronRight,
  MapPin,
  Calendar,
  Layers,
  X,
  Info,
  Star,
  Eye,
  Share2,
} from 'lucide-react';

import { Pattern, PatternSymbol } from '@buni/patterns';
import { useToast } from '@buni/ui';
import { PATTERNS_DOCS } from './mock';
import { patternRepository } from '@/features/patterns/repositories/pattern.repository';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TYPES = ['ALL', 'KENTE', 'NDOP', 'BOGOLAN', 'ADINKRA', 'WAX', 'NDEBELE', 'KUBA'];

const SECTIONS = [
  { id: 'histoire', label: 'Histoire' },
  { id: 'technique', label: 'Technique' },
  { id: 'symbolisme', label: 'Symbolisme' },
  { id: 'ceremoniel', label: 'Cérémoniel' },
  { id: 'sources', label: 'Sources' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN DISPLAY HELPER
// ─────────────────────────────────────────────────────────────────────────────

const CSS_CLASS_FALLBACK: Record<string, string> = {
  'avs-pattern-adinkra-default': 'avs-pattern-adinkra-sankofa',
  'avs-pattern-kente-default': 'avs-pattern-kente-royale',
  'avs-pattern-ndop-default': 'avs-pattern-ndop-sultan',
  'avs-pattern-bogolan-default': 'avs-pattern-bogolan-fanga',
  'avs-pattern-wax-default': 'avs-pattern-wax-dakar',
};

function getPatternBackground(pattern: Pattern): React.CSSProperties | undefined {
  // Priority 1: Use imgUrl if available
  if (pattern.imgUrl && pattern.imgUrl.trim()) {
    return {
      backgroundImage: `url('${pattern.imgUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  // Priority 2: Use CSS class (with fallback if needed)
  // Don't need to return styles; CSS class will be applied via className
  return undefined;
}

function getPatternCSSClass(cssClass: string): string {
  // Try direct mapping first

  if (CSS_CLASS_FALLBACK[cssClass]) {
    return CSS_CLASS_FALLBACK[cssClass] as string;
  }
  // If it's already a known class, use it
  return cssClass || 'avs-pattern-wax-dakar';
}

// ─────────────────────────────────────────────────────────────────────────────
// COPY BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [text]);

  return (
    <button
      onClick={() => void copy()}
      className="border-avs-accent/10 text-avs-accent/50 hover:text-avs-primary hover:border-avs-primary/20 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[9px] font-semibold transition-all duration-150"
    >
      {copied ? <Check size={9} /> : <Copy size={9} />}
      {copied ? 'Copié !' : (label ?? text)}
    </button>
  );
}

function ShareBtn({ pattern }: { pattern: Pattern }) {
  const { add: addToast } = useToast();

  const handleShare = async () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/patterns?pattern=${pattern.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: pattern.name,
          text: pattern.summary,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        addToast({ variant: 'success', message: 'Lien copié !' });
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-avs-primary/10 text-avs-primary hover:bg-avs-primary/20 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200"
      title="Partager ce motif"
    >
      <Share2 size={11} /> Partager
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LICENSE BADGE
// ─────────────────────────────────────────────────────────────────────────────

function LicenseBadge({ license }: { license: Pattern['license'] }) {
  const variants: Record<string, string> = {
    cc0: 'bg-avs-primary/10 text-avs-primary   border border-avs-primary/20',
    'cc-by': 'bg-avs-primary/10 text-avs-primary   border border-avs-primary/20',
    'cc-by-sa': 'bg-avs-indigo/10  text-avs-indigo    border border-avs-indigo/20',
  };

  const labels: Record<string, string> = {
    cc0: 'CC0',
    'cc-by': 'CC BY',
    'cc-by-sa': 'CC BY-SA',
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase backdrop-blur-sm ${variants[license]}`}
    >
      {labels[license]}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// META CHIP
// ─────────────────────────────────────────────────────────────────────────────

function MetaChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-avs-secondary-dark border-avs-accent/10 rounded-xl border px-3 py-2.5">
      <p className="text-avs-accent/40 mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase">
        {label}
      </p>
      <p className="text-avs-accent flex items-center gap-1 text-xs font-semibold">
        <Icon size={10} className="text-avs-primary shrink-0" />
        {value}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN DOC SHEET
// ─────────────────────────────────────────────────────────────────────────────

function PatternSheet({ pattern }: { pattern: Pattern }) {
  const [activeSymbol, setActiveSymbol] = useState<PatternSymbol | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('histoire');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSymbol(null);
    setActiveSection('histoire');
  }, [pattern.id]);

  return (
    <div
      ref={contentRef}
      className="border-avs-accent/10 h-full overflow-y-auto border [scrollbar-width:thin]"
    >
      {/* ── Cover ────────────────────────────────────────────────────── */}
      <div className="bg-avs-secondary-dark relative h-52 overflow-hidden">
        <div className={`${pattern.cssClass} absolute inset-0`} />

        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/5" />

        {/* Top-left badges */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span className="bg-avs-primary text-avs-secondary rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase backdrop-blur-sm">
            {pattern.type}
          </span>
          <LicenseBadge license={pattern.license} />
        </div>

        {/* Top-right stats */}
        <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5">
          <span className="text-avs-secondary flex items-center gap-1.5 font-mono text-[10px] drop-shadow backdrop-blur-sm">
            <Download size={9} /> {pattern.downloads.toLocaleString()}
          </span>
          <span className="text-avs-secondary flex items-center gap-1.5 font-mono text-[10px] drop-shadow backdrop-blur-sm">
            <Eye size={9} /> {pattern.views.toLocaleString()} vues
          </span>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="bg-avs-secondary px-7 pt-6 pb-14">
        {/* Identity */}
        <div className="border-avs-accent/10 mb-7 border-b pb-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-avs-accent text-3xl leading-tight font-black tracking-tight">
                {pattern.name}
              </h2>
              <p className="text-avs-accent/60 mt-1 font-mono text-sm italic">
                {pattern.localName}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
              <CopyBtn text={`.${pattern.cssClass}`} label="Copier classe CSS" />
              <div className="flex gap-2">
                <ShareBtn pattern={pattern} />
                <button className="group bg-avs-primary text-avs-secondary shadow-avs-sm hover:shadow-avs-md relative flex items-center gap-1.5 overflow-hidden rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5">
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden
                  />
                  <Download size={11} /> SVG
                </button>
              </div>
            </div>
          </div>

          {/* Meta chips */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <MetaChip icon={Users} label="Peuple" value={pattern.origin.people} />
            <MetaChip icon={MapPin} label="Région" value={pattern.origin.region} />
            <MetaChip
              icon={MapPin}
              label="Pays"
              value={`${pattern.origin.flag} ${pattern.origin.country}`}
            />
            <MetaChip icon={Calendar} label="Époque" value={pattern.era} />
          </div>

          {/* Summary */}
          <p className="text-avs-accent/70 mt-5 text-sm leading-[1.85]">{pattern.summary}</p>
        </div>

        {/* Color palette */}
        <div className="border-avs-accent/10 mb-7 border-b pb-7">
          <h3 className="font-display text-avs-accent mb-4 flex items-center gap-2 text-base font-bold">
            <span className="bg-avs-primary/10 text-avs-primary flex h-5 w-5 items-center justify-center rounded-lg">
              <Layers size={11} />
            </span>
            Palette culturelle
          </h3>

          <div className="space-y-2.5">
            {pattern.colors.map(({ hex, name, meaning }) => (
              <div key={hex} className="flex items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-black/10 transition-transform hover:scale-105 dark:ring-white/10"
                  style={{ background: hex, boxShadow: `0 2px 8px ${hex}40` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-avs-accent text-xs font-bold">{name}</p>
                    <span className="text-avs-accent/40 font-mono text-[9px]">{hex}</span>
                  </div>
                  <p className="text-avs-accent/60 mt-0.5 text-xs leading-snug">{meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Symbols */}
        <div className="border-avs-accent/10 mb-7 border-b pb-7">
          <h3 className="font-display text-avs-accent mb-1.5 flex items-center gap-2 text-base font-bold">
            <span className="bg-avs-primary/10 text-avs-primary flex h-5 w-5 items-center justify-center rounded-lg">
              <Star size={11} />
            </span>
            Symboles constitutifs
          </h3>
          <p className="text-avs-accent/40 mb-4 text-xs leading-relaxed">
            Cliquez sur un symbole pour voir sa signification complète et son contexte d&apos;usage.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {pattern.symbols.map((sym) => {
              const isOpen = activeSymbol?.name === sym.name;
              return (
                <button
                  key={sym.name}
                  type="button"
                  onClick={() => setActiveSymbol(isOpen ? null : sym)}
                  className={`group overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
                    isOpen
                      ? 'border-avs-primary/20 bg-avs-primary/5'
                      : 'border-avs-accent/10 bg-avs-secondary hover:border-avs-primary/20'
                  } `}
                >
                  <div className="flex items-start gap-3 p-3.5">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
                      {sym.imageUrl ? (
                        <img
                          src={sym.imageUrl}
                          alt={sym.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full" style={{ background: sym.cssPreview }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`font-display text-sm leading-tight font-bold ${isOpen ? 'text-avs-primary' : 'text-avs-accent'}`}
                        >
                          {sym.name}
                        </p>
                        {sym.sacred && (
                          <span className="bg-avs-kente/15 text-avs-kente border-avs-kente/25 rounded-md border px-1.5 py-0.5 font-mono text-[7px] font-black tracking-wider uppercase">
                            Sacré
                          </span>
                        )}
                      </div>
                      <p className="text-avs-accent/40 mt-0.5 font-mono text-[9px] italic">
                        {sym.name}
                      </p>
                    </div>
                    <ChevronRight
                      size={13}
                      className={`mt-0.5 shrink-0 transition-transform duration-200 ${isOpen ? 'text-avs-primary rotate-90' : 'text-avs-accent/30'}`}
                    />
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-avs-primary/20 space-y-3 border-t px-3.5 pt-0 pb-4">
                          <div className="pt-3">
                            <p className="text-avs-primary mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase">
                              Signification
                            </p>
                            <p className="text-avs-accent/70 text-xs leading-relaxed">
                              {sym.meaning}
                            </p>
                          </div>
                          <div>
                            <p className="text-avs-primary mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase">
                              Usage cérémoniel
                            </p>
                            <p className="text-avs-accent/70 text-xs leading-relaxed">
                              {sym.usage}
                            </p>
                          </div>
                          {sym.sacred && (
                            <div className="bg-avs-kente/8 border-avs-kente/20 flex items-start gap-2 rounded-xl border p-3">
                              <Info size={11} className="text-avs-kente mt-0.5 shrink-0" />
                              <p className="text-avs-kente/85 text-[10px] leading-relaxed">
                                Ce symbole est sacré ou réservé à certaines fonctions sociales. Son
                                usage hors contexte traditionnel est considéré comme une
                                transgression culturelle.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documentary sections */}
        <div className="mb-7">
          {/* Tab bar */}
          <div className="border-avs-accent/10 mb-5 flex flex-wrap gap-0 border-b">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  activeSection === id
                    ? 'border-avs-primary text-avs-primary'
                    : 'text-avs-accent/40 hover:text-avs-accent border-transparent'
                } `}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === 'sources' ? (
                <div className="space-y-2">
                  {pattern.sources?.map((s: string, i: number) => (
                    <div
                      key={i}
                      className="bg-avs-secondary-dark border-avs-accent/10 flex items-start gap-3 rounded-xl border px-4 py-3"
                    >
                      <span className="text-avs-primary mt-0.5 shrink-0 font-mono text-[9px] font-black">
                        [{i + 1}]
                      </span>
                      <p className="text-avs-accent/70 text-xs leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              ) : activeSection === 'symbolisme' ? (
                <div className="space-y-4">
                  <p className="text-avs-accent/70 text-sm leading-[1.85]">
                    {pattern.symbolism?.meaning}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {pattern.symbolism?.keywords?.map((k: string) => (
                      <span
                        key={k}
                        className="border-avs-primary/30 text-avs-primary rounded-full border px-2 py-1 text-xs"
                      >
                        {k}
                      </span>
                    ))}
                  </div>

                  <p className="text-avs-accent/70 text-sm leading-[1.85]">
                    {pattern.symbolism?.usage}
                  </p>
                </div>
              ) : (
                <p className="text-avs-accent/70 text-sm leading-[1.85]">
                  {(
                    {
                      histoire: pattern.history,
                      technique: pattern.technique,
                      ceremoniel: pattern.ceremonial,
                    } as Record<string, any>
                  )[activeSection] ?? 'Aucune donnée disponible'}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Artisan quote */}
        {pattern.artisanQuote && (
          <div className="border-avs-accent/10 overflow-hidden rounded-2xl border">
            <div className={`${pattern.cssClass} h-1`} aria-hidden />
            <div className="bg-avs-secondary px-6 py-5">
              <p
                className="font-display text-avs-primary/25 text-5xl leading-none select-none"
                style={{ fontFamily: 'Georgia, serif' }}
                aria-hidden
              >
                &ldquo;
              </p>
              <blockquote className="font-display text-avs-accent/70 -mt-2 text-base leading-relaxed italic">
                {pattern.artisanQuote.text}
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div
                  className={`${pattern.cssClass} border-avs-accent/15 relative h-9 w-9 shrink-0 overflow-hidden rounded-full border`}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="font-display text-avs-secondary text-sm font-black drop-shadow">
                      {pattern.artisanQuote.author.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-avs-accent text-xs font-bold">{pattern.artisanQuote.author}</p>
                  <p className="text-avs-accent/50 text-[10px]">{pattern.artisanQuote.role}</p>
                  <p className="text-avs-accent/40 text-[10px]">{pattern.artisanQuote.country}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE  ← fonction manquante, c'était la cause du bug
// ─────────────────────────────────────────────────────────────────────────────

function PatternsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selected, setSelected] = useState<Pattern | null>(null);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [mobileDoc, setMobileDoc] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  // Load patterns: mocks first, then merge with backend
  useEffect(() => {
    // Start with mock patterns immediately
    setPatterns(PATTERNS_DOCS);

    const loadPatternsFromBackend = async () => {
      try {
        const backendPatterns = await patternRepository.findAll();
        // Merge: keep mocks but add backend patterns not already present
        const mockIds = new Set(PATTERNS_DOCS.map((p) => p.id));
        const newPatterns = backendPatterns.filter((p) => !mockIds.has(p.id));
        setPatterns([...PATTERNS_DOCS, ...newPatterns]);
      } catch (error) {
        console.error('Error loading patterns from backend:', error);
        // Keep mocks only if backend fails
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

  const handleSelect = (p: Pattern) => {
    setSelected(p);
    setMobileDoc(true);

    router.push(`/patterns?pattern=${p.id}`, { scroll: false });
  };

  return (
    <div className="bg-avs-secondary flex h-screen flex-col overflow-hidden">
      {/* ══ TOPBAR ══════════════════════════════════════════════════════ */}
      <div className="bg-avs-secondary border-avs-accent/10 relative shrink-0 overflow-hidden border-b px-5 py-5 backdrop-blur-xl">
        <div
          className="avs-pattern-wax-dakar pointer-events-none absolute inset-0 opacity-[0.03]"
          aria-hidden
        />

        <div className="relative flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-avs-primary h-px w-6" aria-hidden />
                <span className="text-avs-primary font-mono text-[9px] font-bold tracking-[0.24em] uppercase">
                  Documentation culturelle · {patterns.length} motifs
                </span>
              </div>
              <h1 className="font-display text-avs-accent text-4xl leading-none font-black tracking-tight">
                Encyclopédie des Motifs
              </h1>
            </div>
            <p className="text-avs-accent/50 hidden max-w-xs text-right text-xs leading-relaxed sm:block">
              Fiches ethnographiques complètes — symboles constitutifs, histoire, technique, sources
              primaires.
            </p>
          </div>

          {/* Search + type filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-55 flex-1">
              <Search
                size={13}
                className="text-avs-accent/40 absolute top-1/2 left-3.5 -translate-y-1/2"
                aria-hidden
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Motif, peuple, symbole, pays…"
                className="avs-input focus:border-avs-primary pr-9 pl-9"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch('')}
                    className="text-avs-accent/40 hover:text-avs-accent absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-0.5 transition-colors"
                    aria-label="Effacer"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 font-mono text-[9px] font-black tracking-[0.14em] uppercase transition-all duration-150 ${
                    activeType === t
                      ? 'bg-avs-primary text-avs-secondary shadow-avs-sm'
                      : 'border-avs-accent/15 text-avs-accent/50 bg-avs-secondary hover:border-avs-primary/20 hover:text-avs-primary border'
                  } `}
                >
                  {t === 'ALL' ? 'Tous' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ TWO-COLUMN LAYOUT ═══════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`bg-avs-secondary border-avs-accent/10 flex w-74 shrink-0 flex-col overflow-hidden border-r ${mobileDoc ? 'hidden lg:flex' : 'flex'} `}
        >
          <div className="border-avs-accent/10 flex items-center justify-between border-b px-4 py-3">
            <p className="text-avs-accent/40 font-mono text-[9px] font-bold tracking-[0.18em] uppercase">
              {filtered.length} motif{filtered.length > 1 ? 's' : ''}
            </p>
            {(search || activeType !== 'ALL') && (
              <button
                onClick={() => {
                  setSearch('');
                  setActiveType('ALL');
                }}
                className="text-avs-primary font-mono text-[9px] font-bold tracking-wide underline underline-offset-3"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
              <div
                className="avs-pattern-wax-dakar h-12 w-12 rounded-full opacity-30"
                aria-hidden
              />
              <p className="text-avs-accent/40 text-center text-sm">Aucun motif ne correspond.</p>
            </div>
          ) : (
            <nav
              className="flex-1 overflow-y-auto py-1.5 [scrollbar-width:thin]"
              aria-label="Liste des motifs"
            >
              {filtered.map((p) => {
                // FIX : selected peut être null → utiliser ?.id
                const isActive = selected?.id === p.id;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                    className={`group border-avs-accent/10 w-full border-b border-l-2 text-left transition-colors duration-100 ${
                      isActive
                        ? 'border-l-avs-primary bg-avs-primary/5'
                        : 'hover:bg-avs-secondary-dark border-l-transparent'
                    } `}
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <div
                        className={`${p.cssClass} relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-105 dark:ring-white/10`}
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-display truncate text-sm leading-tight font-bold ${isActive ? 'text-avs-primary' : 'text-avs-accent'}`}
                        >
                          {p.name}
                        </p>
                        <p className="text-avs-accent/40 mt-0.5 font-mono text-[9px]">
                          {p.origin.flag} {p.origin.country}
                        </p>
                        <p className="text-avs-accent/30 mt-0.5 text-[10px]">
                          {p.symbols.length} symboles
                        </p>
                      </div>
                      {isActive && <ChevronRight size={13} className="text-avs-primary shrink-0" />}
                    </div>

                    <div className="mx-4 mb-3 flex h-1.5 overflow-hidden">
                      {p.colors.map((c) => (
                        <div
                          key={c.hex}
                          className="flex-1 first:rounded-l-full last:rounded-r-full"
                          style={{ background: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          )}

          <div className="border-avs-accent/10 border-t p-4">
            <p className="text-avs-accent text-center text-[10px] leading-relaxed">
              Documentation établie à partir de sources primaires ethnographiques vérifiées.
            </p>
          </div>
        </aside>

        {/* DOC PANEL */}
        <main
          className={`bg-avs-secondary flex-1 overflow-hidden ${!mobileDoc ? 'hidden lg:block' : 'block'}`}
          aria-label="Documentation du motif sélectionné"
        >
          {mobileDoc && (
            <div className="border-avs-accent/10 border-b px-5 py-3 lg:hidden">
              <button
                onClick={() => setMobileDoc(false)}
                className="text-avs-accent/60 hover:text-avs-primary flex items-center gap-1.5 text-xs font-semibold transition-colors"
              >
                <ChevronRight size={12} className="rotate-180" /> Retour à la liste
              </button>
            </div>
          )}

          {/* FIX : selected peut être null → afficher un état vide par défaut */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <PatternSheet pattern={selected} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-avs-accent/30 flex h-full flex-col items-center justify-center gap-3"
              >
                <div
                  className="avs-pattern-wax-dakar h-16 w-16 rounded-2xl opacity-20"
                  aria-hidden
                />
                <p className="text-sm font-medium">
                  Sélectionnez un motif pour voir sa documentation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PatternsContent />
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL ICONS
// ─────────────────────────────────────────────────────────────────────────────

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
