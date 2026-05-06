'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Copy,
  Check,
  ChevronRight,
  MapPin,
  Calendar,
  BookOpen,
  Layers,
  ArrowUpRight,
  X,
  Info,
  Star,
  Eye,
} from 'lucide-react';
import { PatternReplacer } from 'apps/buni-avs/src/features/patterns/components/SvgPatternDisplay';
import { PatternDoc, PATTERNS_DOCS, PatternSymbol } from 'apps/buni-avs/src/features/patterns/data/patterns-data';
// import { PATTERNS_DOCS } from 'apps/buni-avs/src/features/patterns/data/patterns-docs';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// DATA (unchanged from original)
// ─────────────────────────────────────────────────────────────────────────────

const TYPES = ['ALL', 'KENTE', 'NDOP', 'BOGOLAN', 'ADINKRA', 'WAX', 'NDEBELE', 'KUBA'];

const SECTIONS = [
  { id: 'histoire', label: 'Histoire' },
  { id: 'technique', label: 'Technique' },
  { id: 'symbolisme', label: 'Symbolisme' },
  { id: 'ceremoniel', label: 'Cérémoniel' },
  { id: 'sources', label: 'Sources' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
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
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[9px] font-semibold transition-all duration-150"
      style={{
        color: copied ? '#22c55e' : 'var(--enc-hint)',
        border: '1px solid var(--enc-border)',
      }}
      onMouseEnter={(e) => {
        if (!copied) (e.currentTarget as HTMLElement).style.color = 'var(--enc-primary)';
      }}
      onMouseLeave={(e) => {
        if (!copied) (e.currentTarget as HTMLElement).style.color = 'var(--enc-hint)';
      }}
    >
      {copied ? <Check size={9} /> : <Copy size={9} />}
      {copied ? 'Copié !' : (label ?? text)}
    </button>
  );
}

function LicenseBadge({ license }: { license: PatternDoc['license'] }) {
  const conf = {
    cc0: { label: 'CC0', color: '#22c55e' },
    'cc-by': { label: 'CC BY', color: '#4A6741' },
    'cc-by-sa': { label: 'CC BY-SA', color: '#2A4A6B' },
  }[license];
  return (
    <span
      className="rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase"
      style={{
        background: `${conf.color}14`,
        color: conf.color,
        border: `1px solid ${conf.color}28`,
      }}
    >
      {conf.label}
    </span>
  );
}

function MetaChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{ background: 'var(--enc-subtle)', border: '1px solid var(--enc-border)' }}
    >
      <p
        className="mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase"
        style={{ color: 'var(--enc-hint)' }}
      >
        {label}
      </p>
      <p
        className="flex items-center gap-1 text-xs font-semibold"
        style={{ color: 'var(--enc-text)' }}
      >
        <Icon size={10} style={{ color: 'var(--enc-primary)', flexShrink: 0 }} />
        {value}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN DOC SHEET
// ─────────────────────────────────────────────────────────────────────────────
function PatternDocSheet({ pattern }: { pattern: PatternDoc }) {
  const [activeSymbol, setActiveSymbol] = useState<PatternSymbol | null>(null);
  const [activeSection, setActiveSection] = useState<(typeof SECTIONS)[number]['id']>('histoire');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSymbol(null);
    setActiveSection('histoire');
  }, [pattern.id]);

  return (
    <div
      ref={contentRef}
      className="h-full overflow-y-auto"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--enc-border) transparent' }}
    >
      {/* ── Cover ──────────────────────────────────────────────────────────── */}
      <div className="relative h-52" style={{ background: ' var(--enc-doc-bg) 10%' }}>
        <PatternReplacer cssClass={pattern.cssClass} className="absolute inset-0" />

        {/* Layered overlay */}

        <div className="absolute inset-0" />

        {/* Top-left badges */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span
            className="rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase backdrop-blur-sm"
            style={{ background: 'rgba(10,8,6,0.75)', color: '#F5EBE0' }}
          >
            {pattern.type}
          </span>
          <LicenseBadge license={pattern.license} />
        </div>

        {/* Top-right stats */}
        <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5">
          <span
            className="flex items-center gap-1.5 font-mono text-[10px]"
            style={{ color: 'rgba(245,235,224,0.55)' }}
          >
            <Download size={9} /> {pattern.downloads.toLocaleString()}
          </span>
          <span
            className="flex items-center gap-1.5 font-mono text-[10px]"
            style={{ color: 'rgba(245,235,224,0.55)' }}
          >
            <Eye size={9} /> {pattern.views.toLocaleString()} vues
          </span>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="px-7 pt-1 pb-14" style={{ background: 'var(--enc-doc-bg)' }}>
        {/* Identity */}
        <div className="mb-7 pb-7" style={{ borderBottom: '1px solid var(--enc-border)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="font-display leading-tight font-black"
                style={{
                  fontSize: 'clamp(1.5rem,3vw,2rem)',
                  color: 'var(--enc-text)',
                  letterSpacing: '-0.02em',
                }}
              >
                {pattern.nameFr}
              </h2>
              <p className="mt-1 font-mono text-sm italic" style={{ color: 'var(--enc-hint)' }}>
                {pattern.nameLocal}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
              <CopyBtn text={`.${pattern.cssClass}`} label="Copier classe CSS" />
              <button
                className="group relative flex items-center gap-1.5 overflow-hidden rounded-xl px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--enc-primary)',
                  boxShadow: '0 3px 12px var(--enc-primary-20)',
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden
                />
                <Download size={11} /> SVG
              </button>
            </div>
          </div>

          {/* Meta chips */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <MetaChip icon={Users as typeof MapPin} label="Peuple" value={pattern.origin.people} />
            <MetaChip icon={MapPin} label="Région" value={pattern.origin.region} />
            <MetaChip
              icon={MapPin}
              label="Pays"
              value={`${pattern.origin.flag} ${pattern.origin.country}`}
            />
            <MetaChip icon={Calendar} label="Époque" value={pattern.era} />
          </div>

          {/* Summary */}
          <p className="mt-5 text-sm leading-[1.85]" style={{ color: 'var(--enc-muted)' }}>
            {pattern.summary}
          </p>
        </div>

        {/* Color palette */}
        <div className="mb-7 pb-7" style={{ borderBottom: '1px solid var(--enc-border)' }}>
          <h3
            className="font-display mb-4 flex items-center gap-2 text-base font-bold"
            style={{ color: 'var(--enc-text)' }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-lg"
              style={{ background: 'var(--enc-primary-10)', color: 'var(--enc-primary)' }}
            >
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
                    <p className="text-xs font-bold" style={{ color: 'var(--enc-text)' }}>
                      {name}
                    </p>
                    <span className="font-mono text-[9px]" style={{ color: 'var(--enc-hint)' }}>
                      {hex}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-snug" style={{ color: 'var(--enc-muted)' }}>
                    {meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Symbols */}
        <div className="mb-7 pb-7" style={{ borderBottom: '1px solid var(--enc-border)' }}>
          <h3
            className="font-display mb-1.5 flex items-center gap-2 text-base font-bold"
            style={{ color: 'var(--enc-text)' }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-lg"
              style={{ background: 'var(--enc-primary-10)', color: 'var(--enc-primary)' }}
            >
              <Star size={11} />
            </span>
            Symboles constitutifs
          </h3>
          <p className="mb-4 text-xs leading-relaxed" style={{ color: 'var(--enc-hint)' }}>
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
                  className="group overflow-hidden rounded-2xl text-left transition-all duration-200"
                  style={{
                    border: `1px solid ${isOpen ? 'var(--enc-primary-20)' : 'var(--enc-border)'}`,
                    background: isOpen ? 'var(--enc-primary-10)' : 'var(--enc-surface)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen)
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--enc-primary-20)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen)
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--enc-border)';
                  }}
                >
                  <div className="flex items-start gap-3 p-3.5">
                    <div
                      className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-black/10 dark:ring-white/10"
                      style={{ background: sym.cssPreview }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className="font-display text-sm leading-tight font-bold"
                          style={{ color: isOpen ? 'var(--enc-primary)' : 'var(--enc-text)' }}
                        >
                          {sym.nameFr}
                        </p>
                        {sym.sacred && (
                          <span
                            className="rounded-md px-1.5 py-0.5 font-mono text-[7px] font-black tracking-wider uppercase"
                            style={{
                              background: 'rgba(212,160,23,0.15)',
                              color: '#D4A017',
                              border: '1px solid rgba(212,160,23,0.25)',
                            }}
                          >
                            Sacré
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-0.5 font-mono text-[9px] italic"
                        style={{ color: 'var(--enc-hint)' }}
                      >
                        {sym.name}
                      </p>
                    </div>
                    <ChevronRight
                      size={13}
                      className="mt-0.5 shrink-0 transition-transform duration-200"
                      style={{
                        color: isOpen ? 'var(--enc-primary)' : 'var(--enc-hint)',
                        transform: isOpen ? 'rotate(90deg)' : 'none',
                      }}
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
                        <div
                          className="space-y-3 px-3.5 pt-0 pb-4"
                          style={{ borderTop: '1px solid var(--enc-primary-20)' }}
                        >
                          <div className="pt-3">
                            <p
                              className="mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase"
                              style={{ color: 'var(--enc-primary)' }}
                            >
                              Signification
                            </p>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: 'var(--enc-muted)' }}
                            >
                              {sym.meaning}
                            </p>
                          </div>
                          <div>
                            <p
                              className="mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase"
                              style={{ color: 'var(--enc-primary)' }}
                            >
                              Usage cérémoniel
                            </p>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: 'var(--enc-muted)' }}
                            >
                              {sym.usage}
                            </p>
                          </div>
                          {sym.sacred && (
                            <div
                              className="flex items-start gap-2 rounded-xl p-3"
                              style={{
                                background: 'rgba(212,160,23,0.08)',
                                border: '1px solid rgba(212,160,23,0.20)',
                              }}
                            >
                              <Info
                                size={11}
                                className="mt-0.5 shrink-0"
                                style={{ color: '#D4A017' }}
                              />
                              <p
                                className="text-[10px] leading-relaxed"
                                style={{ color: 'rgba(212,160,23,0.85)' }}
                              >
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
          <div
            className="mb-5 flex flex-wrap gap-0"
            style={{ borderBottom: '1px solid var(--enc-border)' }}
          >
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className="-mb-px border-b-2 px-4 py-2.5 text-xs font-semibold transition-all duration-150"
                style={{
                  borderBottomColor: activeSection === id ? 'var(--enc-primary)' : 'transparent',
                  color: activeSection === id ? 'var(--enc-primary)' : 'var(--enc-hint)',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== id)
                    (e.currentTarget as HTMLElement).style.color = 'var(--enc-text)';
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== id)
                    (e.currentTarget as HTMLElement).style.color = 'var(--enc-hint)';
                }}
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
              {activeSection !== 'sources' ? (
                <p className="text-sm leading-[1.85]" style={{ color: 'var(--enc-muted)' }}>
                  {
                    {
                      histoire: pattern.history,
                      technique: pattern.technique,
                      symbolisme: pattern.symbolism,
                      ceremoniel: pattern.ceremonial,
                    }[activeSection]
                  }
                </p>
              ) : (
                <div className="space-y-2">
                  {pattern.sources.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl px-4 py-3"
                      style={{
                        background: 'var(--enc-subtle)',
                        border: '1px solid var(--enc-border)',
                      }}
                    >
                      <span
                        className="mt-0.5 shrink-0 font-mono text-[9px] font-black"
                        style={{ color: 'var(--enc-primary)' }}
                      >
                        [{i + 1}]
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--enc-muted)' }}>
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Artisan quote */}
        {pattern.artisanQuote && (
          <div
            className="overflow-hidden rounded-2xl"
            style={{ border: '1px solid var(--enc-border)' }}
          >
            <div className={`${pattern.cssClass} h-1`} aria-hidden />
            <div className="px-6 py-5" style={{ background: 'var(--enc-surface)' }}>
              <p
                className="font-display text-5xl leading-none select-none"
                style={{ color: 'var(--enc-primary)', opacity: 0.25, fontFamily: 'Georgia, serif' }}
                aria-hidden
              >
                &ldquo;
              </p>
              <blockquote
                className="font-display -mt-2 text-base leading-relaxed italic"
                style={{ color: 'var(--enc-muted)' }}
              >
                {pattern.artisanQuote.text}
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div
                  className={`${pattern.cssClass} relative h-9 w-9 shrink-0 overflow-hidden rounded-full`}
                  style={{ border: '1.5px solid var(--enc-border)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="font-display text-sm font-black text-white drop-shadow">
                      {pattern.artisanQuote.author.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--enc-text)' }}>
                    {pattern.artisanQuote.author}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--enc-hint)' }}>
                    {pattern.artisanQuote.role}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--enc-hint)', opacity: 0.7 }}>
                    {pattern.artisanQuote.country}
                  </p>
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
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function PatternsPage() {
  const [selected, setSelected] = useState<PatternDoc>(PATTERNS_DOCS[0]!);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [mobileDoc, setMobileDoc] = useState(false);

  const filtered = PATTERNS_DOCS.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.nameFr.toLowerCase().includes(q) ||
      p.origin.country.toLowerCase().includes(q) ||
      p.origin.people.toLowerCase().includes(q) ||
      p.symbols.some((s) => s.nameFr.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    const matchType = activeType === 'ALL' || p.type === activeType;
    return matchSearch && matchType;
  });

  const handleSelect = (p: PatternDoc) => {
    setSelected(p);
    setMobileDoc(true);
  };

  return (
    <>
      
      <div
        className="flex h-screen flex-col overflow-hidden"
        style={{ background: 'var(--enc-bg)' }}
      >
        {/* ══════════════════════════════════════════════════════
            TOPBAR
        ══════════════════════════════════════════════════════ */}
        <div
          className="relative shrink-0 overflow-hidden px-5 py-5"
          style={{
            background: 'var(--enc-topbar-bg)',
            borderBottom: '1px solid var(--enc-border)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Pattern bg — very subtle */}
          <div
            className="avs-pattern-wax-dakar pointer-events-none absolute inset-0 opacity-[0.03]"
            aria-hidden
          />

          <div className="relative flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-px w-6" style={{ background: '#C0573E' }} aria-hidden />
                  <span
                    className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase"
                    style={{ color: '#C0573E' }}
                  >
                    Documentation culturelle · {PATTERNS_DOCS.length} motifs
                  </span>
                </div>
                <h1
                  className="font-display leading-none font-black"
                  style={{
                    fontSize: 'clamp(1.5rem,4vw,2.5rem)',
                    color: 'var(--enc-text)',
                    letterSpacing: '-0.025em',
                  }}
                >
                  Encyclopédie des Motifs
                </h1>
              </div>
              <p
                className="hidden max-w-xs text-right text-xs leading-relaxed sm:block"
                style={{ color: 'var(--enc-hint)' }}
              >
                Fiches ethnographiques complètes — symboles constitutifs, histoire, technique,
                sources primaires.
              </p>
            </div>

            {/* Search + type filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative min-w-[220px] flex-1">
                <Search
                  size={13}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2"
                  style={{ color: 'var(--enc-hint)' }}
                  aria-hidden
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Motif, peuple, symbole, pays…"
                  className="w-full rounded-xl py-2.5 pr-9 pl-9 text-sm transition-all outline-none"
                  style={{
                    background: 'var(--enc-surface)',
                    border: '1.5px solid var(--enc-border-md)',
                    color: 'var(--enc-text)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--enc-primary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--enc-border-md)')}
                />
                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearch('')}
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-0.5 transition-colors"
                      style={{ color: 'var(--enc-hint)' }}
                      aria-label="Effacer"
                    >
                      <X size={13} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Type pills */}
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className="shrink-0 rounded-xl px-3 py-1.5 font-mono text-[9px] font-black tracking-[0.14em] uppercase transition-all duration-150"
                    style={
                      activeType === t
                        ? {
                            background: 'var(--enc-primary)',
                            color: '#fff',
                            boxShadow: '0 2px 10px var(--enc-primary-20)',
                          }
                        : {
                            border: '1px solid var(--enc-border-md)',
                            color: 'var(--enc-hint)',
                            background: 'var(--enc-surface)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (activeType !== t) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          'var(--enc-primary-20)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--enc-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeType !== t) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--enc-border-md)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--enc-hint)';
                      }
                    }}
                  >
                    {t === 'ALL' ? 'Tous' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            TWO-COLUMN LAYOUT
        ══════════════════════════════════════════════════════ */}
        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <aside
            className={`enc-scrollbar flex w-[296px] shrink-0 flex-col overflow-hidden ${mobileDoc ? 'hidden lg:flex' : 'flex'}`}
            style={{
              background: 'var(--enc-sidebar-bg)',
              borderRight: '1px solid var(--enc-border)',
            }}
          >
            {/* Count header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--enc-border)' }}
            >
              <p
                className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase"
                style={{ color: 'var(--enc-hint)' }}
              >
                {filtered.length} motif{filtered.length > 1 ? 's' : ''}
              </p>
              {(search || activeType !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setActiveType('ALL');
                  }}
                  className="font-mono text-[9px] font-bold tracking-wide underline underline-offset-3"
                  style={{ color: 'var(--enc-primary)' }}
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
                <p className="text-center text-sm" style={{ color: 'var(--enc-hint)' }}>
                  Aucun motif ne correspond.
                </p>
              </div>
            ) : (
              <nav
                className="enc-scrollbar flex-1 overflow-y-auto py-1.5"
                aria-label="Liste des motifs"
              >
                {filtered.map((p) => {
                  const isActive = selected.id === p.id;
                  return (
                    <motion.button
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                      className="group w-full text-left transition-colors duration-100"
                      style={{
                        borderLeft: `2px solid ${isActive ? 'var(--enc-primary)' : 'transparent'}`,
                        background: isActive ? 'var(--enc-primary-10)' : 'transparent',
                        borderBottom: '1px solid var(--enc-border)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background = 'var(--enc-subtle)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        {/* Pattern swatch */}
                        <PatternReplacer
                          cssClass={p.cssClass}
                          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-105 dark:ring-white/10"
                        />

                        <div className="min-w-0 flex-1">
                          <p
                            className="font-display truncate text-sm leading-tight font-bold"
                            style={{ color: isActive ? 'var(--enc-primary)' : 'var(--enc-text)' }}
                          >
                            {p.nameFr}
                          </p>
                          <p
                            className="mt-0.5 font-mono text-[9px]"
                            style={{ color: 'var(--enc-hint)' }}
                          >
                            {p.origin.flag} {p.origin.country}
                          </p>
                          <p
                            className="mt-0.5 text-[10px]"
                            style={{ color: 'var(--enc-hint)', opacity: 0.7 }}
                          >
                            {p.symbols.length} symboles
                          </p>
                        </div>

                        {isActive && (
                          <ChevronRight
                            size={13}
                            style={{ color: 'var(--enc-primary)', flexShrink: 0 }}
                          />
                        )}
                      </div>

                      {/* Color bar */}
                      <div
                        className="flex h-1.5 overflow-hidden"
                        style={{ margin: '0 1rem 0.75rem' }}
                      >
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

            {/* Sidebar footer */}
            <div className="p-4" style={{ borderTop: '1px solid var(--enc-border)' }}>
              <p
                className="text-center text-[10px] leading-relaxed"
                style={{ color: 'var(--enc-hint)', opacity: 0.7 }}
              >
                Documentation établie à partir de sources primaires ethnographiques vérifiées.
              </p>
            </div>
          </aside>

          {/* DOC PANEL */}
          <main
            className={`flex-1 overflow-hidden ${!mobileDoc ? 'hidden lg:block' : 'block'}`}
            style={{ background: 'var(--enc-doc-bg)' }}
            aria-label="Documentation du motif sélectionné"
          >
            {/* Mobile back button */}
            {mobileDoc && (
              <div
                className="border-b px-5 py-3 lg:hidden"
                style={{ borderColor: 'var(--enc-border)' }}
              >
                <button
                  onClick={() => setMobileDoc(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: 'var(--enc-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--enc-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--enc-muted)')}
                >
                  <ChevronRight size={12} style={{ transform: 'rotate(180deg)' }} /> Retour à la
                  liste
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <PatternDocSheet pattern={selected} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

// Local import needed for Users icon used in MetaChip
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
