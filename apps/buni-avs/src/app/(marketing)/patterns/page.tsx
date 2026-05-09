'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'lucide-react';
import { PatternReplacer } from 'apps/buni-avs/src/features/patterns/components/SvgPatternDisplay';
import {
  PatternDoc,
  PatternSymbol,
} from '@buni/patterns';
import { PATTERNS_DOCS } from './mock';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TYPES = ['ALL', 'KENTE', 'NDOP', 'BOGOLAN', 'ADINKRA', 'WAX', 'NDEBELE', 'KUBA'];

const SECTIONS = [
  { id: 'histoire',   label: 'Histoire'    },
  { id: 'technique',  label: 'Technique'   },
  { id: 'symbolisme', label: 'Symbolisme'  },
  { id: 'ceremoniel', label: 'Cérémoniel'  },
  { id: 'sources',    label: 'Sources'     },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

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
      className="
        flex items-center gap-1.5
        rounded-lg px-2.5 py-1.5
        font-mono text-[9px] font-semibold
        border border-avs-accent/10
        text-avs-accent/50
        hover:text-avs-primary hover:border-avs-primary/20
        transition-all duration-150
      "
    >
      {copied ? <Check size={9} /> : <Copy size={9} />}
      {copied ? 'Copié !' : (label ?? text)}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LICENSE BADGE
// ─────────────────────────────────────────────────────────────────────────────

function LicenseBadge({ license }: { license: PatternDoc['license'] }) {
  const variants: Record<string, string> = {
    cc0:        'bg-avs-primary/10 text-avs-primary   border border-avs-primary/20',
    'cc-by':    'bg-avs-primary/10 text-avs-primary   border border-avs-primary/20',
    'cc-by-sa': 'bg-avs-indigo/10  text-avs-indigo    border border-avs-indigo/20',
  };

  const labels: Record<string, string> = {
    cc0: 'CC0', 'cc-by': 'CC BY', 'cc-by-sa': 'CC BY-SA',
  };

  return (
    <span className={`rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase backdrop-blur-sm ${variants[license]}`}>
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
    <div className="rounded-xl px-3 py-2.5 bg-avs-secondary-dark border border-avs-accent/10">
      <p className="mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase text-avs-accent/40">
        {label}
      </p>
      <p className="flex items-center gap-1 text-xs font-semibold text-avs-accent">
        <Icon size={10} className="text-avs-primary shrink-0" />
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
      className="h-full overflow-y-auto border border-avs-accent/10 [scrollbar-width:thin]"
    >
      {/* ── Cover ────────────────────────────────────────────────────── */}
      <div className="relative h-52 bg-avs-secondary-dark overflow-hidden">
        <PatternReplacer cssClass={pattern.cssClass} className="absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/5" />

        {/* Top-left badges */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span className="rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase backdrop-blur-sm bg-avs-primary text-avs-secondary">
            {pattern.type}
          </span>
          <LicenseBadge license={pattern.license} />
        </div>

        {/* Top-right stats */}
        <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-avs-secondary backdrop-blur-sm drop-shadow">
            <Download size={9} /> {pattern.downloads.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-avs-secondary backdrop-blur-sm drop-shadow">
            <Eye size={9} /> {pattern.views.toLocaleString()} vues
          </span>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="px-7 pt-6 pb-14 bg-avs-secondary">

        {/* Identity */}
        <div className="mb-7 pb-7 border-b border-avs-accent/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display leading-tight font-black text-avs-accent text-3xl tracking-tight">
                {pattern.nameFr}
              </h2>
              <p className="mt-1 font-mono text-sm italic text-avs-accent/60">
                {pattern.nameLocal}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
              <CopyBtn text={`.${pattern.cssClass}`} label="Copier classe CSS" />
              <button className="
                group relative flex items-center gap-1.5 overflow-hidden
                rounded-xl px-4 py-2 text-xs font-bold
                bg-avs-primary text-avs-secondary
                shadow-avs-sm hover:shadow-avs-md
                hover:-translate-y-0.5 transition-all duration-200
              ">
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  aria-hidden
                />
                <Download size={11} /> SVG
              </button>
            </div>
          </div>

          {/* Meta chips */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <MetaChip icon={Users} label="Peuple" value={pattern.origin.people} />
            <MetaChip icon={MapPin} label="Région" value={pattern.origin.region} />
            <MetaChip icon={MapPin} label="Pays" value={`${pattern.origin.flag} ${pattern.origin.country}`} />
            <MetaChip icon={Calendar} label="Époque" value={pattern.era} />
          </div>

          {/* Summary */}
          <p className="mt-5 text-sm leading-[1.85] text-avs-accent/70">
            {pattern.summary}
          </p>
        </div>

        {/* Color palette */}
        <div className="mb-7 pb-7 border-b border-avs-accent/10">
          <h3 className="font-display mb-4 flex items-center gap-2 text-base font-bold text-avs-accent">
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-avs-primary/10 text-avs-primary">
              <Layers size={11} />
            </span>
            Palette culturelle
          </h3>

          <div className="space-y-2.5">
            {pattern.colors.map(({ hex, name, meaning }) => (
              <div key={hex} className="flex items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-black/10 dark:ring-white/10 hover:scale-105 transition-transform"
                  style={{ background: hex, boxShadow: `0 2px 8px ${hex}40` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-avs-accent">{name}</p>
                    <span className="font-mono text-[9px] text-avs-accent/40">{hex}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-snug text-avs-accent/60">{meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Symbols */}
        <div className="mb-7 pb-7 border-b border-avs-accent/10">
          <h3 className="font-display mb-1.5 flex items-center gap-2 text-base font-bold text-avs-accent">
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-avs-primary/10 text-avs-primary">
              <Star size={11} />
            </span>
            Symboles constitutifs
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-avs-accent/40">
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
                  className={`
                    group overflow-hidden rounded-2xl text-left
                    border transition-all duration-200
                    ${isOpen
                      ? 'border-avs-primary/20 bg-avs-primary/5'
                      : 'border-avs-accent/10 bg-avs-secondary hover:border-avs-primary/20'
                    }
                  `}
                >
                  <div className="flex items-start gap-3 p-3.5">
                    <div
                      className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-black/10 dark:ring-white/10"
                      style={{ background: sym.cssPreview }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className={`font-display text-sm leading-tight font-bold ${isOpen ? 'text-avs-primary' : 'text-avs-accent'}`}>
                          {sym.nameFr}
                        </p>
                        {sym.sacred && (
                          <span className="rounded-md px-1.5 py-0.5 font-mono text-[7px] font-black tracking-wider uppercase bg-avs-kente/15 text-avs-kente border border-avs-kente/25">
                            Sacré
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 font-mono text-[9px] italic text-avs-accent/40">
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
                        <div className="space-y-3 px-3.5 pt-0 pb-4 border-t border-avs-primary/20">
                          <div className="pt-3">
                            <p className="mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase text-avs-primary">
                              Signification
                            </p>
                            <p className="text-xs leading-relaxed text-avs-accent/70">
                              {sym.meaning}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 font-mono text-[8px] font-black tracking-[0.16em] uppercase text-avs-primary">
                              Usage cérémoniel
                            </p>
                            <p className="text-xs leading-relaxed text-avs-accent/70">
                              {sym.usage}
                            </p>
                          </div>
                          {sym.sacred && (
                            <div className="flex items-start gap-2 rounded-xl p-3 bg-avs-kente/8 border border-avs-kente/20">
                              <Info size={11} className="mt-0.5 shrink-0 text-avs-kente" />
                              <p className="text-[10px] leading-relaxed text-avs-kente/85">
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
          <div className="mb-5 flex flex-wrap gap-0 border-b border-avs-accent/10">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`
                  -mb-px border-b-2 px-4 py-2.5 text-xs font-semibold
                  transition-all duration-150
                  ${activeSection === id
                    ? 'border-avs-primary text-avs-primary'
                    : 'border-transparent text-avs-accent/40 hover:text-avs-accent'
                  }
                `}
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
                <p className="text-sm leading-[1.85] text-avs-accent/70">
                  {
                    ({
                      histoire:   pattern.history,
                      technique:  pattern.technique,
                      symbolisme: pattern.symbolism,
                      ceremoniel: pattern.ceremonial,
                    } as Record<string, string>)[activeSection]
                  }
                </p>
              ) : (
                <div className="space-y-2">
                  {pattern.sources.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl px-4 py-3 bg-avs-secondary-dark border border-avs-accent/10"
                    >
                      <span className="mt-0.5 shrink-0 font-mono text-[9px] font-black text-avs-primary">
                        [{i + 1}]
                      </span>
                      <p className="text-xs leading-relaxed text-avs-accent/70">{s}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Artisan quote */}
        {pattern.artisanQuote && (
          <div className="overflow-hidden rounded-2xl border border-avs-accent/10">
            <div className={`${pattern.cssClass} h-1`} aria-hidden />
            <div className="px-6 py-5 bg-avs-secondary">
              <p
                className="font-display text-5xl leading-none select-none text-avs-primary/25"
                style={{ fontFamily: 'Georgia, serif' }}
                aria-hidden
              >
                &ldquo;
              </p>
              <blockquote className="font-display -mt-2 text-base leading-relaxed italic text-avs-accent/70">
                {pattern.artisanQuote.text}
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div
                  className={`${pattern.cssClass} relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-avs-accent/15`}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="font-display text-sm font-black text-avs-secondary drop-shadow">
                      {pattern.artisanQuote.author.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-avs-accent">{pattern.artisanQuote.author}</p>
                  <p className="text-[10px] text-avs-accent/50">{pattern.artisanQuote.role}</p>
                  <p className="text-[10px] text-avs-accent/40">{pattern.artisanQuote.country}</p>
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

export default function Page() {
  const [selected, setSelected]     = useState<PatternDoc | null>(null);
  const [search, setSearch]         = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [mobileDoc, setMobileDoc]   = useState(false);
  const [patterns, setPatterns]     = useState<PatternDoc[]>([]);

  // Load patterns from backend
  useEffect(() => {
    // TODO: Replace with actual API call
    const mockPatterns: PatternDoc[] = PATTERNS_DOCS;
    setPatterns(mockPatterns);
  }, []);

  const filtered = patterns.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.nameFr.toLowerCase().includes(q) ||
      p.origin.country.toLowerCase().includes(q) ||
      p.origin.people.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q);
    const matchType = activeType === 'ALL' || p.type === activeType;
    return matchSearch && matchType;
  });

  const handleSelect = (p: PatternDoc) => {
    setSelected(p);
    setMobileDoc(true);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-avs-secondary">

      {/* ══ TOPBAR ══════════════════════════════════════════════════════ */}
      <div className="relative shrink-0 overflow-hidden px-5 py-5 bg-avs-secondary border-b border-avs-accent/10 backdrop-blur-xl">
        <div className="avs-pattern-wax-dakar pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden />

        <div className="relative flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px w-6 bg-avs-primary" aria-hidden />
                <span className="font-mono text-[9px] font-bold tracking-[0.24em] uppercase text-avs-primary">
                  Documentation culturelle · {patterns.length} motifs
                </span>
              </div>
              <h1 className="font-display leading-none font-black text-avs-accent text-4xl tracking-tight">
                Encyclopédie des Motifs
              </h1>
            </div>
            <p className="hidden max-w-xs text-right text-xs leading-relaxed sm:block text-avs-accent/50">
              Fiches ethnographiques complètes — symboles constitutifs, histoire, technique,
              sources primaires.
            </p>
          </div>

          {/* Search + type filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-55 flex-1">
              <Search
                size={13}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-avs-accent/40"
                aria-hidden
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Motif, peuple, symbole, pays…"
                className="avs-input pl-9 pr-9 focus:border-avs-primary"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-0.5 text-avs-accent/40 hover:text-avs-accent transition-colors"
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
                  className={`
                    shrink-0 rounded-xl px-3 py-1.5
                    font-mono text-[9px] font-black tracking-[0.14em] uppercase
                    transition-all duration-150
                    ${activeType === t
                      ? 'bg-avs-primary text-avs-secondary shadow-avs-sm'
                      : 'border border-avs-accent/15 text-avs-accent/50 bg-avs-secondary hover:border-avs-primary/20 hover:text-avs-primary'
                    }
                  `}
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
          className={`
            flex w-74 shrink-0 flex-col overflow-hidden
            bg-avs-secondary border-r border-avs-accent/10
            ${mobileDoc ? 'hidden lg:flex' : 'flex'}
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-avs-accent/10">
            <p className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-avs-accent/40">
              {filtered.length} motif{filtered.length > 1 ? 's' : ''}
            </p>
            {(search || activeType !== 'ALL') && (
              <button
                onClick={() => { setSearch(''); setActiveType('ALL'); }}
                className="font-mono text-[9px] font-bold tracking-wide underline underline-offset-3 text-avs-primary"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
              <div className="avs-pattern-wax-dakar h-12 w-12 rounded-full opacity-30" aria-hidden />
              <p className="text-center text-sm text-avs-accent/40">
                Aucun motif ne correspond.
              </p>
            </div>
          ) : (
            <nav className="flex-1 overflow-y-auto py-1.5 [scrollbar-width:thin]" aria-label="Liste des motifs">
              {filtered.map((p) => {
                // FIX : selected peut être null → utiliser ?.id
                const isActive = selected?.id === p.id;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                    className={`
                      group w-full text-left transition-colors duration-100
                      border-b border-avs-accent/10
                      border-l-2
                      ${isActive
                        ? 'border-l-avs-primary bg-avs-primary/5'
                        : 'border-l-transparent hover:bg-avs-secondary-dark'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <PatternReplacer
                        cssClass={p.cssClass}
                        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`font-display truncate text-sm leading-tight font-bold ${isActive ? 'text-avs-primary' : 'text-avs-accent'}`}>
                          {p.nameFr}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] text-avs-accent/40">
                          {p.origin.flag} {p.origin.country}
                        </p>
                        <p className="mt-0.5 text-[10px] text-avs-accent/30">
                          {p.symbols.length} symboles
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight size={13} className="text-avs-primary shrink-0" />
                      )}
                    </div>

                    <div className="flex h-1.5 overflow-hidden mx-4 mb-3">
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

          <div className="p-4 border-t border-avs-accent/10">
            <p className="text-center text-[10px] leading-relaxed text-avs-accent">
              Documentation établie à partir de sources primaires ethnographiques vérifiées.
            </p>
          </div>
        </aside>

        {/* DOC PANEL */}
        <main
          className={`flex-1 overflow-hidden bg-avs-secondary ${!mobileDoc ? 'hidden lg:block' : 'block'}`}
          aria-label="Documentation du motif sélectionné"
        >
          {mobileDoc && (
            <div className="border-b border-avs-accent/10 px-5 py-3 lg:hidden">
              <button
                onClick={() => setMobileDoc(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-avs-accent/60 hover:text-avs-primary transition-colors"
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
                <PatternDocSheet pattern={selected} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full flex-col items-center justify-center gap-3 text-avs-accent/30"
              >
                <div className="avs-pattern-wax-dakar h-16 w-16 rounded-2xl opacity-20" aria-hidden />
                <p className="text-sm font-medium">Sélectionnez un motif pour voir sa documentation</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
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